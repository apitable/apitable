import { Injectable, NestInterceptor, Logger, ExecutionContext, CallHandler } from '@nestjs/common';
import { ResourceType, IWidget, ResourceIdPrefix } from '@apitable/core';
import { InjectLogger } from '../common';
import { ApiResponse } from '../../fusion/vos/api.response';
import { NodeService } from 'database/services/node/node.service';
import { RoomResourceRelService } from 'shared/services/socket/room.resource.rel.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IResourceDataInfo as IResourceInfo } from './interface';

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
  ) { }
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const info = await this.parseResourceType(request);
    if (!info) {
      return next.handle().pipe();
    }
    return next.handle().pipe(
      tap(async(data: ApiResponse<any>) => {
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

  private async getResourceIds(resourceType: ResourceType, data: any): Promise<string[]> {
    const resourceIds: string[] = [];
    switch (resourceType) {
      case ResourceType.Datasheet:
        // related datasheet
        if (Object.keys(data.foreignDatasheetMap).length > 0) {
          resourceIds.push(...Object.keys(data.foreignDatasheetMap));
        }
        // widget panels
        if (data.snapshot.meta.widgetPanels) {
          data.snapshot.meta.widgetPanels.filter(panel => panel.widgets.size !== 0)
            .map(panel => panel.widgets.map(widget => resourceIds.push(widget.id)));
        }
        break;
      case ResourceType.Form:
        // 1. get form data by calling fetch data API
        if (data.sourceInfo) {
          // reference datasheet
          resourceIds.push(data.sourceInfo.datasheetId);
          break;
        }
        // 2. get related datasheets data by calling fetch data API
        resourceIds.push(data.datasheet.id);
        if (Object.keys(data.foreignDatasheetMap).length > 0) {
          resourceIds.push(...Object.keys(data.foreignDatasheetMap));
        }
        break;
      case ResourceType.Dashboard:
        const sourceDatasheetIds: Set<string> = new Set();
        Object.values(data.widgetMap).map(async(widget: IWidget) => {
          resourceIds.push(widget.id);
          // reference count of the widget
          if (widget.snapshot.datasheetId && !sourceDatasheetIds.has(widget.snapshot.datasheetId)) {
            sourceDatasheetIds.add(widget.snapshot.datasheetId);
            // get all resources in the original datasheet
            const dstIds = await this.roomResourceRelService.getDatasheetResourceIds(widget.snapshot.datasheetId);
            resourceIds.push(...dstIds);
          }
        });
        break;
      case ResourceType.Mirror:
        // 1. call mirror information API
        if (data.sourceInfo) {
          // exit if the mirror room has resource
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
        resourceIds.push(data.datasheet.id);
        // original datasheet related datasheet
        if (Object.keys(data.foreignDatasheetMap).length > 0) {
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
