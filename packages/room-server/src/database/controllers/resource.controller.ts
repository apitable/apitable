import { Body, Controller, Get, Headers, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ILocalChangeset, OtErrorCode, readonlyFields, ResourceIdPrefix, ResourceType } from '@apitable/core';
import { RecordHistoryTypeEnum } from 'shared/enums/record.history.enum';
import { ResourceDataInterceptor } from 'shared/middleware/resource.data.interceptor';
import { ApiResponse } from '../../fusion/vos/api.response';
import { RecordHistoryQueryRo } from '../ros/record.history.query.ro';
import { RecordHistoryVo } from '../vos/record.history.vo';
import { ChangesetView, DatasheetPack } from '../interfaces';
import { DatasheetMetaService } from 'database/services/datasheet/datasheet.meta.service';
import { DatasheetRecordService } from 'database/services/datasheet/datasheet.record.service';
import { NodePermissionService } from 'database/services/node/node.permission.service';
import { NodeService } from 'database/services/node/node.service';
import { NodeShareSettingService } from 'database/services/node/node.share.setting.service';
import { ChangesetService } from 'database/services/resource/changeset.service';
import { ResourceService } from 'database/services/resource/resource.service';
import { UserService } from 'database/services/user/user.service';
import { OtService } from 'database/services/ot/ot.service';

@Controller('nest/v1')
export class ResourceController {
  constructor(
    private readonly userService: UserService,
    private readonly resourceService: ResourceService,
    private readonly changesetService: ChangesetService,
    private readonly nodeService: NodeService,
    private readonly nodeShareSettingService: NodeShareSettingService,
    private readonly nodePermissionService: NodePermissionService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordService: DatasheetRecordService,
    private readonly otService: OtService,
  ) {}

  // TODO: deprecate revisions parameter
  @Get(['resources/:resourceId/changesets', 'resource/:resourceId/changesets'])
  async getChangesetList(
    @Headers('cookie') cookie: string, @Param('resourceId') resourceId: string,
    @Query() query: { revisions: string | number[]; resourceType: ResourceType; startRevision: number; endRevision: number },
  ): Promise<ChangesetView[]> {
    // check if the user belongs to this space
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, resourceId);
    // check the user has the privileges of the node
    await this.nodeService.checkNodePermission(resourceId, { cookie });
    if (query.revisions?.length > 0) {
      return await this.changesetService.getChangesetList(resourceId, Number(query.resourceType), 
        +query.revisions[0], +query.revisions[query.revisions.length-1]);
    }
    return await this.changesetService.getChangesetList(resourceId, Number(query.resourceType), query.startRevision, query.endRevision);
  }

  @Get(['resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack', 'resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getFormForeignDatasheetPack(
    @Headers('cookie') cookie: string, @Param('resourceId') resourceId: string, @Param('foreignDatasheetId') foreignDatasheetId: string
  ): Promise<DatasheetPack> {
    // check if the user belongs to this space
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, resourceId);
    // check the user has the privileges of the node
    await this.nodeService.checkNodePermission(resourceId, { cookie });
    return await this.resourceService.fetchForeignDatasheetPack(resourceId, foreignDatasheetId, { cookie });
  }

  @Get(['shares/:shareId/resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack',
    'share/:shareId/resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getShareFormForeignDatasheetPack(
    @Headers('cookie') cookie: string, @Param('resourceId') resourceId: string,
    @Param('foreignDatasheetId') foreignDatasheetId: string, @Param('shareId') shareId: string
  ): Promise<DatasheetPack> {
    // check if the share link of the node is editable
    await this.nodeShareSettingService.checkNodeShareCanBeEdited(shareId, resourceId);
    return await this.resourceService.fetchForeignDatasheetPack(resourceId, foreignDatasheetId, { cookie }, shareId);
  }

  /**
   * get comments and history of the record
   */
  @Get('resources/:resourceId/records/:recId/activity')
  public async getActivity(@Headers('cookie') cookie: string, @Param('resourceId') resourceId: string,
                           @Param('recId') recId: string, @Query() query: RecordHistoryQueryRo): Promise<RecordHistoryVo> {
    // get permissions
    const permission = await this.nodePermissionService.getNodePermission(resourceId, { cookie }, { main: true, internal: true });
    // filter fields by permissions
    const filterFiledIds: string[] = [];
    const fieldPermissionMap = permission.fieldPermissionMap;
    if (fieldPermissionMap) {
      for (const fieldId in fieldPermissionMap) {
        if (fieldPermissionMap.hasOwnProperty(fieldId) && !fieldPermissionMap[fieldId].permission.readable) {
          filterFiledIds.push(fieldId);
        }
      }
    }
    // eliminate auto-increment and no permissions fields
    const dstId = resourceId.startsWith(ResourceIdPrefix.Datasheet) ? resourceId :
      await this.nodeService.getMainNodeId(resourceId);
    const fieldIds = await this.datasheetMetaService.getFieldIdByDstId(dstId, filterFiledIds, readonlyFields);
    const spaceId = await this.nodeService.getSpaceIdByNodeId(dstId);
    const showRecordHistory: boolean = await this.nodeService.showRecordHistory(dstId, query.type == RecordHistoryTypeEnum.MODIFY_HISTORY);
    const recordHistoryDto = await this.datasheetRecordService.getActivityList(spaceId, dstId, recId, showRecordHistory, query, fieldIds);
    return ApiResponse.success(recordHistoryDto);
  }

  @Post(['resource/apply/changesets', 'resources/apply/changesets'])
  async applyChangesets(
    @Headers('cookie') cookie: string,
    @Body() data: {
      changesets: ILocalChangeset[];
      roomId: string;
    }
  ) {
    const { roomId, changesets } = data;
    let result;
    try {
      result = await this.otService.applyChangesets(roomId, changesets, { cookie });
    } catch (e) {
      if (e.code === OtErrorCode.MSG_ID_DUPLICATE) {
        return ApiResponse.success(result);
      }
      throw e;
    }

    return result;
  }

}

