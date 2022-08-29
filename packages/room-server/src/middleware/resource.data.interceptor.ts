import { Injectable, NestInterceptor, Logger, ExecutionContext, CallHandler } from '@nestjs/common';
import { ResourceType, IWidget, ResourceIdPrefix } from '@vikadata/core';
import { InjectLogger } from 'common';
import { ApiResponse } from 'model/api.response';
import { NodeService } from 'modules/services/node/node.service';
import { RoomResourceRelService } from 'modules/socket/room.resource.rel.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IResourceDataInfo as IResourceInfo } from './interface';

/**
 * <p>
 * 资源数据拦截器
 * </p>
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
        // 镜像本身没有数据协同，无需创建资源
        if (info.resourceType != ResourceType.Mirror) {
          resourceIds.push(info.resourceId);
        }
        if (!resourceIds.length) {
          return;
        }
        // 创建或更新 Room - Resource 双向关系
        await this.roomResourceRelService.createOrUpdateRel(info.resourceId, resourceIds);
      }),
    );
  }

  private async getResourceIds(resourceType: ResourceType, data: any): Promise<string[]> {
    const resourceIds: string[] = [];
    switch (resourceType) {
      case ResourceType.Datasheet:
        // 关联表
        if (Object.keys(data.foreignDatasheetMap).length > 0) {
          resourceIds.push(...Object.keys(data.foreignDatasheetMap));
        }
        // 组件面板的组件
        if (data.snapshot.meta.widgetPanels) {
          data.snapshot.meta.widgetPanels.filter(panel => panel.widgets.size !== 0)
            .map(panel => panel.widgets.map(widget => resourceIds.push(widget.id)));
        }
        break;
      case ResourceType.Form:
        // 1. 调用表单的数据加载接口
        if (data.sourceInfo) {
          // 映射数表
          resourceIds.push(data.sourceInfo.datasheetId);
          break;
        }
        // 2. 调用表单源表的关联表数据加载接口
        resourceIds.push(data.datasheet.id);
        if (Object.keys(data.foreignDatasheetMap).length > 0) {
          resourceIds.push(...Object.keys(data.foreignDatasheetMap));
        }
        break;
      case ResourceType.Dashboard:
        const sourceDatasheetIds: Set<string> = new Set();
        Object.values(data.widgetMap).map(async(widget: IWidget) => {
          // 组件
          resourceIds.push(widget.id);
          // 组件引用的数表
          if (widget.snapshot.datasheetId && !sourceDatasheetIds.has(widget.snapshot.datasheetId)) {
            sourceDatasheetIds.add(widget.snapshot.datasheetId);
            // 获取源表房间的所有数表资源ID
            const dstIds = await this.roomResourceRelService.getDatasheetResourceIds(widget.snapshot.datasheetId);
            resourceIds.push(...dstIds);
          }
        });
        break;
      case ResourceType.Mirror:
        // 1. 调用镜像的信息接口
        if (data.sourceInfo) {
          // 判断镜像房间是否已有资源，若有则直接结束
          const hasResource = await this.roomResourceRelService.hasResource(data.mirror.id);
          if (hasResource) {
            break;
          }
          // 获取源表房间的所有数表资源ID
          const dstIds = await this.roomResourceRelService.getDatasheetResourceIds(data.sourceInfo.datasheetId);
          resourceIds.push(...dstIds);
          break;
        }
        // 2. 调用镜像的源表数据加载接口
        // 源表
        resourceIds.push(data.datasheet.id);
        // 源表关联表
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
      this.logger.error('ResourceDataInterceptor: 资源数据加载类型错误');
      return null;
    }
    return { resourceId, resourceType };
  }
}
