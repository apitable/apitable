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

import { IViewProperty, ResourceIdPrefix, ResourceType, ViewType } from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable } from '@nestjs/common';
import { InjectLogger } from 'shared/common';
import { RestService } from 'shared/services/rest/rest.service';
import { Logger } from 'winston';
import { EffectConstantName } from '../interfaces/ot.interface';
import { difference } from 'lodash';
import { DatasheetFieldHandler } from 'database/datasheet/services/datasheet.field.handler';
import { NodeService } from 'node/services/node.service';
import { RoomResourceRelService } from 'database/resource/services/room.resource.rel.service';
import { DatasheetWidgetService } from 'database/datasheet/services/datasheet.widget.service';

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
    private readonly datasheetWidgetService: DatasheetWidgetService,
    private readonly datasheetFieldHandler: DatasheetFieldHandler,
    private readonly restService: RestService
  ) {
  }

  @Span()
  async handleResourceChange(roomId: string, values: any[]) {
    this.logger.info(
      `HandleResourceChange. roomId: ${roomId} values: ${JSON.stringify(
        values.map(value => ({
          resourceId: value.commonData.resourceId,
          dstId: value.commonData.dstId,
        })),
      )}`,
    );
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
      await Promise.all(relNodeIds.map(nodeId => this.roomResourceRelService.createOrUpdateRel(nodeId, addResourceIds)));
    }
    // Break Room - Resource bijection
    if (delResourceIds.length) {
      if (addResourceIds.length) {
        // To avoid simultaneous creation and deletion, break mapping relation of datasheet resource
        delResourceIds = difference<string>(delResourceIds, addResourceIds);
      }
      await this.roomResourceRelService.removeRel(dstId, delResourceIds);
      // Update related node resource asynchronously
      await Promise.all(relNodeIds.map(nodeId => this.roomResourceRelService.removeRel(nodeId, delResourceIds)));
    }
    await this.handleSpaceStatistics(resultSet);
  }

  private async parseDashboardResultSet(dashboardId: string, resultSet: { [key: string]: any }) {
    const addResourceIds: string[] = [];
    let delResourceIds: string[] = [];
    // New widget
    if (resultSet.addWidgetIds.length) {
      addResourceIds.push(...resultSet.addWidgetIds);
      const dstIds = await this.datasheetWidgetService.selectDstIdsByWidgetIds(addResourceIds);
      if (dstIds?.length) {
        addResourceIds.push(...dstIds);
      }
    }
    // Delete widget
    if (resultSet.deleteWidgetIds.length) {
      delResourceIds.push(...resultSet.deleteWidgetIds);
      let dstIds = await this.datasheetWidgetService.selectDstIdsByWidgetIds(delResourceIds);
      if (dstIds?.length) {
        // Delete data source of undeleted widget
        const reservedDstIds = await this.datasheetWidgetService.selectDstIdsByNodeId(dashboardId);
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

  @Span()
  private async handleSpaceStatistics(resultSet: { [key: string]: any }) {
    const viewCount: { [key: number]: number } = {};
    if (resultSet.addViews.length || resultSet.deleteViews.length) {
      this.calculateViewCount(viewCount, resultSet.addViews, false);
      this.calculateViewCount(viewCount, resultSet.deleteViews, true);
    }
    const addRecordCount = resultSet.toCreateRecord.size;
    const recordCount = addRecordCount - resultSet.toDeleteRecordIds.length;
    if (Object.keys(viewCount).length || recordCount != 0) {
      try {
        await this.restService.updateSpaceStatistics(resultSet.spaceId, { viewCount, recordCount });
      } catch (err: any) {
        this.logger.error(`modifySpaceStatisticsError:${resultSet.spaceId}`, { message: err?.message, stack: err?.stack });
      }
    }
  }

  private calculateViewCount(viewCountMap: { [key: number]: number }, views: IViewProperty[], isDeleted: boolean): void {
    // Limit view types to reduce network overhead
    const needCachedViewTypes: ViewType[] = [ViewType.Kanban, ViewType.Gallery, ViewType.Calendar, ViewType.Gantt];
    for (const view of views) {
      if (!needCachedViewTypes.includes(view.type)) {
        continue;
      }
      if (!viewCountMap[view.type]) {
        viewCountMap[view.type] = 0;
      }
      if (isDeleted) {
        viewCountMap[view.type] += -1;
      } else {
        viewCountMap[view.type] += 1;
      }
    }
  }
}
