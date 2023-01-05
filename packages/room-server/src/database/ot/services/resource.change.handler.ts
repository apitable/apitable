/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ResourceIdPrefix, ResourceType } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { InjectLogger } from '../../../shared/common';
import { DatasheetWidgetRepository } from '../../datasheet/repositories/datasheet.widget.repository';
import { Logger } from 'winston';
import { EffectConstantName } from '../interfaces/ot.interface';
import { difference } from 'lodash';
import { DatasheetFieldHandler } from 'database/datasheet/services/datasheet.field.handler';
import { NodeService } from 'node/services/node.service';
import { RoomResourceRelService } from 'database/resource/services/room.resource.rel.service';

/**
 * @author Chambers
 * @date 2021/2/2
 */
@Injectable()
export class ResourceChangeHandler {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly roomResourceRelService: RoomResourceRelService,
    private readonly nodeService: NodeService,
    private readonly datasheetWidgetRepository: DatasheetWidgetRepository,
    private readonly datasheetFieldHandler: DatasheetFieldHandler,
  ) { }

  async handleResourceChange(roomId: string, values: any[]) {
    this.logger.info(`HandleResourceChange. roomId: ${roomId} values: ${values}`);
    const isDsbRoom = roomId.startsWith(ResourceIdPrefix.Dashboard);
    for (const { effectMap, commonData, resultSet } of values) {
      const { dstId, resourceId, resourceType } = commonData;
      switch (resourceType) {
        case ResourceType.Datasheet:
          await this.parseDatasheetResultSet(dstId, effectMap, resultSet);
          break;
        case ResourceType.Dashboard:
          await this.parseDashboardResultSet(resourceId, resultSet);
          break;
        case ResourceType.Form:
          break;
        case ResourceType.Widget:
          // When setting the referenced datasheet of a blank widget in dashboard, this datasheet should be 
          // joined in room
          if (isDsbRoom && resultSet.updateWidgetDepDatasheetId) {
            await this.roomResourceRelService.createOrUpdateRel(dstId, [resultSet.updateWidgetDepDatasheetId]);
          }
          break;
        default:
          break;
      }
    }
  }

  private async parseDatasheetResultSet(dstId: string, effectMap: Map<string, any>, resultSet: { [key: string]: any }) {
    const addResourceIds: any[] = [];
    let delResourceIds: any[] = [];
    // New widget
    if (resultSet.addWidgetIds.length) {
      addResourceIds.push(...resultSet.addWidgetIds);
    }
    // Delete widget
    if (resultSet.deleteWidgetIds.length) {
      delResourceIds.push(...resultSet.deleteWidgetIds);
    }
    // Update references in formula fields
    if (resultSet.toChangeFormulaExpressions.length > 0) {
      await this.datasheetFieldHandler.computeFormulaReference(dstId, resultSet.toChangeFormulaExpressions);
    }
    // New link field
    if (resultSet.toCreateForeignDatasheetIdMap.size) {
      const meta = effectMap.get(EffectConstantName.Meta);
      const dstIds = await this.datasheetFieldHandler.computeLinkFieldReference(dstId, meta, resultSet.toCreateForeignDatasheetIdMap);
      if (dstIds?.length) { 
        addResourceIds.push(...dstIds);
      }
    }
    // Delete link field
    if (resultSet.toDeleteForeignDatasheetIdMap.size) {
      const meta = effectMap.get(EffectConstantName.Meta);
      const dstIds = await this.datasheetFieldHandler.deleteLinkFieldReference(dstId, meta, resultSet.toDeleteForeignDatasheetIdMap);
      if (dstIds?.length) { 
        delResourceIds.push(...dstIds);
      }
    }
    // Original LookUp prop change only influence 1-to-1 reference relation change, compute individually regardless of order is ok.
    // After filter was introduced, field references form 1-to-many relation (like formulas) to cover, to make sure overlapped fields maintain
    // their reference relation, Deleting LookUp analysis should come first
    // Delete LookUp
    if (resultSet.toDeleteLookUpProperties.length > 0) {
      const meta = effectMap.get(EffectConstantName.Meta);
      const dstIds = await this.datasheetFieldHandler.removeLookUpReference(dstId, meta, resultSet.toDeleteLookUpProperties);
      if (dstIds?.length) { 
        delResourceIds.push(...dstIds);
      }
    }
    // New LookUp
    if (resultSet.toCreateLookUpProperties.length > 0) {
      const meta = effectMap.get(EffectConstantName.Meta);
      const dstIds = await this.datasheetFieldHandler.computeLookUpReference(dstId, meta, resultSet.toCreateLookUpProperties);
      if (dstIds?.length) { 
        addResourceIds.push(...dstIds);
      }
    }

    // Obtain related node resource (form, mirror, etc) of the datasheet
    const relNodeIds = await this.nodeService.getRelNodeIds(dstId);
    
    // Create or update Room - Resource bijection
    if (addResourceIds.length) {
      await this.roomResourceRelService.createOrUpdateRel(dstId, addResourceIds);
      // Update related node resource asynchronously
      relNodeIds.forEach(nodeId => 
        this.roomResourceRelService.createOrUpdateRel(nodeId, addResourceIds)
      );
    }
    // Break Room - Resource bijection
    if (delResourceIds.length) {
      if (addResourceIds.length) {
        // To avoid simultaneous creation and deletion, break mapping relation of datasheet resource
        delResourceIds = difference<string>(delResourceIds, addResourceIds);
      }
      await this.roomResourceRelService.removeRel(dstId, delResourceIds);
      // Update related node resource asynchronously
      relNodeIds.forEach(nodeId => 
        this.roomResourceRelService.removeRel(nodeId, delResourceIds)
      );
    }
  }

  private async parseDashboardResultSet(dashboardId: string, resultSet: { [key: string]: any }) {
    const addResourceIds: string[] = [];
    let delResourceIds: string[] = [];
    // New widget
    if (resultSet.addWidgetIds.length) {
      addResourceIds.push(...resultSet.addWidgetIds);
      const dstIds = await this.datasheetWidgetRepository.selectDstIdsByWidgetIds(addResourceIds);
      if (dstIds?.length) {
        addResourceIds.push(...dstIds);
      }
    }
    // Delete widget
    if (resultSet.deleteWidgetIds.length) {
      delResourceIds.push(...resultSet.deleteWidgetIds);
      let dstIds = await this.datasheetWidgetRepository.selectDstIdsByWidgetIds(delResourceIds);
      if (dstIds?.length) {
        // Delete data source of undeleted widget
        const reservedDstIds = await this.datasheetWidgetRepository.selectDstIdsByNodeId(dashboardId);
        if (reservedDstIds?.length) {
          dstIds = difference<string>(dstIds, reservedDstIds);
        }
        delResourceIds.push(...dstIds);
      }
    }
    // Create or update Room - Resource bijection
    if (addResourceIds.length) {
      await this.roomResourceRelService.createOrUpdateRel(dashboardId, addResourceIds);
    }
    // Break Room - Resource bijection
    if (delResourceIds.length) {
      if (addResourceIds.length) {
        // To avoid new widget and deleted widget referencing the same datasheet, break mapping relation of datasheet resource
        delResourceIds = difference<string>(delResourceIds, addResourceIds);
      }
      await this.roomResourceRelService.removeRel(dashboardId, delResourceIds);
    }
  }
}
