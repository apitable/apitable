import { Injectable } from '@nestjs/common';
import { ResourceIdPrefix } from '@apitable/core';
import { IAuthHeader } from '../../../shared/interfaces';
import { AutomationService } from '../../../automation/services/automation.service';
import { DatasheetService } from '../datasheet/datasheet.service';
import { NodeService } from '../node/node.service';
import { WidgetService } from '../widget/widget.service';
import { InjectLogger } from '../../../shared/common';
import { Logger } from 'winston';

@Injectable()
export class ResourceService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly nodeService: NodeService,
    private readonly datasheetService: DatasheetService,
    private readonly widgetService: WidgetService,
    private readonly automationService: AutomationService,
  ) { }

  async getSpaceIdByResourceId(resourceId: string): Promise<string> {
    const nodeId = await this.getNodeIdByResourceId(resourceId);
    return this.nodeService.getSpaceIdByNodeId(nodeId);
  }

  async getNodeIdByResourceId(resourceId: string): Promise<string> {
    // 小组件独立打开，WidgetId 非节点ID
    if (resourceId.startsWith(ResourceIdPrefix.Widget)) {
      return await this.widgetService.getNodeIdByWidgetId(resourceId);
    }
    return resourceId;
  }

  async getHasRobotByResourceIds(resourceIds: string[]) {
    return await this.automationService.isResourcesHasRobots(resourceIds);
  }

  async fetchForeignDatasheetPack(resourceId: string, foreignDatasheetId: string, auth: IAuthHeader, shareId?: string) {
    // 查询映射的数表
    const datasheetId = resourceId.startsWith(ResourceIdPrefix.Datasheet) ? resourceId :
      await this.nodeService.getMainNodeId(resourceId);
    return await this.datasheetService.fetchForeignDatasheetPack(datasheetId, foreignDatasheetId, auth, shareId);
  }
}
