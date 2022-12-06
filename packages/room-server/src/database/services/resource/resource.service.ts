import { Injectable } from '@nestjs/common';
import { FieldType, ResourceIdPrefix, ResourceType } from '@apitable/core';
import { IAuthHeader } from '../../../shared/interfaces';
import { AutomationService } from '../../../automation/services/automation.service';
import { DatasheetService } from '../datasheet/datasheet.service';
import { NodeService } from '../node/node.service';
import { WidgetService } from '../widget/widget.service';
import { InjectLogger } from '../../../shared/common';
import { Logger } from 'winston';
import { ServerException, PermissionException } from 'shared/exception';
import { DatasheetMetaService } from '../datasheet/datasheet.meta.service';

@Injectable()
export class ResourceService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly nodeService: NodeService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly widgetService: WidgetService,
    private readonly automationService: AutomationService,
  ) { }

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

  async getHasRobotByResourceIds(resourceIds: string[]) {
    return await this.automationService.isResourcesHasRobots(resourceIds);
  }

  async fetchForeignDatasheetPack(resourceId: string, foreignDatasheetId: string, auth: IAuthHeader, shareId?: string) {
    // Obtain referenced datasheet
    const datasheetId = resourceId.startsWith(ResourceIdPrefix.Datasheet) ? resourceId :
      await this.nodeService.getMainNodeId(resourceId);
    return await this.datasheetService.fetchForeignDatasheetPack(datasheetId, foreignDatasheetId, auth, shareId);
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
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    const isExist = Object.values(meta.fieldMap).some(field => {
      if (field.type === FieldType.Link) {
        return field.property.foreignDatasheetId === resourceId;
      }
      return false;
    });
    if (!isExist) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
  }
}
