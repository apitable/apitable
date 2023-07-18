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

import { Injectable, NestInterceptor, Logger, ExecutionContext, CallHandler } from '@nestjs/common';
import { ResourceType, ResourceIdPrefix, IWidget, IWidgetPanel, IServerDashboardPack } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { IResourceDataInfo as IResourceInfo } from './interface';
import { NodeService } from 'node/services/node.service';
import { RoomResourceRelService } from 'database/resource/services/room.resource.rel.service';
import { DatasheetPack, FormDataPack, MirrorInfo } from 'database/interfaces';

/**
 * Resource data interceptor
 * @author Chambers
 * @date 2021/2/1
 */
@Injectable()
export class ResourceDataInterceptor implements NestInterceptor {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly roomResourceRelService: RoomResourceRelService,
    private readonly nodeService: NodeService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const info = await this.parseResourceType(request);
    if (!info) {
      return next.handle().pipe();
    }
    return next.handle().pipe(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      tap(async(data: any) => {
        const resourceIds = await this.getResourceIds(info.resourceType, data);
        // no need to create a new resource for mirror
        if (info.resourceType != ResourceType.Mirror) {
          resourceIds.push(info.resourceId);
        }
        if (!resourceIds.length) {
          return;
        }
        // create or update relationship between resource and room
        await this.roomResourceRelService.createOrUpdateRel(info.resourceId, resourceIds);
      }),
    );
  }

  private async getResourceIds(
    resourceType: ResourceType,
    data: DatasheetPack | IServerDashboardPack | MirrorInfo | FormDataPack,
  ): Promise<string[]> {
    const resourceIds: string[] = [];
    switch (resourceType) {
      case ResourceType.Datasheet:
        data = data as DatasheetPack;
        // related datasheet
        if (data.foreignDatasheetMap && Object.keys(data.foreignDatasheetMap).length > 0) {
          resourceIds.push(...Object.keys(data.foreignDatasheetMap));
        }
        // widget panels
        if (data.snapshot.meta.widgetPanels) {
          data.snapshot.meta.widgetPanels
            .filter((panel: IWidgetPanel) => panel.widgets.length !== 0)
            .map((panel: any) => panel.widgets.map((widget: any) => resourceIds.push(widget.id)));
        }
        break;
      case ResourceType.Form:
        data = data as DatasheetPack | FormDataPack;
        // 1. get form data by calling fetch data API
        if (data['sourceInfo']) {
          data = data as FormDataPack;
          // reference datasheet
          resourceIds.push(data.sourceInfo.datasheetId);
          break;
        }
        // 2. get related datasheets data by calling fetch data API
        data = data as DatasheetPack;
        resourceIds.push(data.datasheet.id);
        if (data.foreignDatasheetMap && Object.keys(data.foreignDatasheetMap).length > 0) {
          resourceIds.push(...Object.keys(data.foreignDatasheetMap));
        }
        break;
      case ResourceType.Dashboard:
        data = data as IServerDashboardPack;
        const sourceDatasheetIds: Set<string> = new Set();
        for (const widget of Object.values(data.widgetMap as any as Record<string, IWidget>)) {
          resourceIds.push(widget.id);
          // reference count of the widget
          if (widget.snapshot.datasheetId && !sourceDatasheetIds.has(widget.snapshot.datasheetId)) {
            sourceDatasheetIds.add(widget.snapshot.datasheetId);
            // get all resources in the original datasheet
            const dstIds = await this.roomResourceRelService.getDatasheetResourceIds(widget.snapshot.datasheetId);
            resourceIds.push(...dstIds);
          }
        }
        break;
      case ResourceType.Mirror:
        data = data as MirrorInfo | DatasheetPack;
        // 1. call mirror information API
        if (data['sourceInfo']) {
          // exit if the mirror room has resource
          data = data as MirrorInfo;
          const hasResource = await this.roomResourceRelService.hasResource(data.mirror.id);
          if (hasResource) {
            break;
          }
          // get all datasheet resources by room ID
          const dstIds = await this.roomResourceRelService.getDatasheetResourceIds(data.sourceInfo.datasheetId);
          resourceIds.push(...dstIds);
          break;
        }
        // 2. get the original datasheet by mirror
        // original datasheet
        data = data as DatasheetPack;
        resourceIds.push(data.datasheet.id);
        // original datasheet related datasheet
        if (data.foreignDatasheetMap && Object.keys(data.foreignDatasheetMap).length > 0) {
          resourceIds.push(...Object.keys(data.foreignDatasheetMap));
        }
        break;
      default:
        break;
    }
    return resourceIds;
  }

  private async parseResourceType(request: any): Promise<IResourceInfo | null> {
    let resourceId;
    let resourceType;
    if (request.params.dstId) {
      resourceId = request.params.dstId;
      resourceType = ResourceType.Datasheet;
    } else if (request.params.formId) {
      resourceId = request.params.formId;
      resourceType = ResourceType.Form;
    } else if (request.params.dashboardId) {
      resourceId = request.params.dashboardId;
      resourceType = ResourceType.Dashboard;
    } else if (request.params.mirrorId) {
      const isTemplate = await this.nodeService.isTemplate(request.params.mirrorId);
      if (isTemplate) {
        return null;
      }
      resourceId = request.params.mirrorId;
      resourceType = ResourceType.Mirror;
    } else if (request.params.resourceId) {
      resourceId = request.params.resourceId;
      if (!resourceId.startsWith(ResourceIdPrefix.Form)) {
        return null;
      }
      resourceType = ResourceType.Form;
    } else {
      this.logger.error('ResourceDataInterceptor: resource data type error');
      return null;
    }
    return { resourceId, resourceType };
  }
}
