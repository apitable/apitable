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

import { Injectable } from '@nestjs/common';
import { ResourceType } from '@apitable/core';
import { WidgetService } from 'database/widget/services/widget.service';
import { IResourceInfo } from '../interfaces/resource.interface';
import { NodeService } from 'node/services/node.service';

/**
 * Meta service for all resources (including datasheets, widgets, etc)
 */
@Injectable()
export class MetaService {
  constructor(
    private readonly nodeService: NodeService,
    private readonly widgetService: WidgetService,
  ) { }

  async getResourceInfo(resourceId: string, resourceType: ResourceType): Promise<IResourceInfo> {
    switch (resourceType) {
      case ResourceType.Datasheet:
        const revision = await this.nodeService.getRevisionByDstId(resourceId);
        return { resourceRevision: revision, nodeId: resourceId };
      case ResourceType.Form:
      case ResourceType.Dashboard:
      case ResourceType.Mirror:
        const resourceRevision = await this.nodeService.getReversionByResourceId(resourceId);
        return { resourceRevision, nodeId: resourceId };
      case ResourceType.Widget:
        const widget = await this.widgetService.getWidgetInfo(resourceId);
        return { nodeId: widget?.nodeId, resourceRevision: Number(widget?.revision) };
      default:
        break;
    }
    return {};
  }
}
