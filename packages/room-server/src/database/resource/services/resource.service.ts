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

import { FieldType, IMeta, ResourceIdPrefix, ResourceType } from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable } from '@nestjs/common';
import { AutomationService } from 'automation/services/automation.service';
import { PermissionException, ServerException } from 'shared/exception';
import { IAuthHeader } from 'shared/interfaces';
import { DatasheetMetaService } from '../../datasheet/services/datasheet.meta.service';
import { DatasheetService } from '../../datasheet/services/datasheet.service';
import { NodeService } from '../../../node/services/node.service';
import { WidgetService } from '../../widget/services/widget.service';
import { DatasheetPack } from 'database/interfaces';

@Injectable()
export class ResourceService {
  constructor(
    private readonly nodeService: NodeService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly widgetService: WidgetService,
    private readonly automationService: AutomationService,
  ) {}

  @Span()
  async getSpaceIdByResourceId(resourceId: string): Promise<string> {
    const nodeId = await this.getNodeIdByResourceId(resourceId);
    return this.nodeService.getSpaceIdByNodeId(nodeId);
  }

  async getNodeIdByResourceId(resourceId: string): Promise<string> {
    // Widget is open individually, widgetId is not node ID
    if (resourceId.startsWith(ResourceIdPrefix.Widget)) {
      return await this.widgetService.getNodeIdByWidgetId(resourceId);
    }
    return resourceId;
  }

  @Span()
  async getHasRobotByResourceIds(resourceIds: string[]) {
    const hasRobot = await this.automationService.isResourcesHasRobots(resourceIds);
    if (!hasRobot) {
      return await this.automationService.isResourcesHasTriggers(resourceIds);
    }
    return hasRobot;
  }

  async fetchForeignDatasheetPack(
    resourceId: string,
    foreignDatasheetId: string,
    auth: IAuthHeader,
    allowNative: boolean,
    shareId?: string,
  ): Promise<DatasheetPack> {
    // Obtain referenced datasheet
    const datasheetId = resourceId.startsWith(ResourceIdPrefix.Datasheet) ? resourceId : await this.nodeService.getMainNodeId(resourceId);
    return this.datasheetService.fetchForeignDatasheetPack(datasheetId, foreignDatasheetId, auth, allowNative, shareId);
  }

  async checkResourceEntry(resourceId: string, resourceType: ResourceType, sourceId?: string) {
    if (!sourceId || sourceId == resourceId) {
      return;
    }
    // It haven't other entry if resourceType don't equal datasheet
    if (resourceType != ResourceType.Datasheet) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }

    // Check related node and linked datasheet
    const dstId = sourceId.startsWith(ResourceIdPrefix.Datasheet) ? sourceId : await this.nodeService.getMainNodeId(sourceId);
    if (dstId == resourceId) {
      return;
    }
    // Check if datasheet has linked datasheet with foreignDatasheetId
    const metaMap = await this.datasheetMetaService.getMetaMapByDstIds([dstId, resourceId]);
    const isExist = this.hasLinkRelation(metaMap[dstId], resourceId) || this.hasLinkRelation(metaMap[resourceId], dstId);
    if (!isExist) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
  }

  private hasLinkRelation(meta?: IMeta, resourceId?: string): boolean {
    if (!meta) {
      return false;
    }
    return Object.values(meta.fieldMap).some((field) => {
      if (field.type === FieldType.Link || field.type === FieldType.OneWayLink) {
        return field.property.foreignDatasheetId === resourceId;
      }
      return false;
    });
  }
}
