import { Injectable } from '@nestjs/common';
import { ResourceType } from '@apitable/core';
import { NodeService } from 'modules/services/node/node.service';
import { WidgetService } from '../widget/widget.service';
import { IResourceInfo } from './resource.interface';

/**
 * 所有资源（包括数表、组件...） 的 Meta Service
 */
@Injectable()
export class MetaService {
  constructor(
    private readonly nodeService: NodeService,
    private readonly widgetService: WidgetService,
  ) { }

  /**
   * 查询资源信息
   *
   * @param resourceId    资源ID
   * @param resourceType  资源类型
   */
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
