import { Body, Controller, Get, Headers, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ILocalChangeset, OtErrorCode, readonlyFields, ResourceIdPrefix, ResourceType } from '@apitable/core';
import { RecordHistoryTypeEnum } from 'enums/record.history.enum';
import { ResourceDataInterceptor } from 'middleware/resource.data.interceptor';
import { ApiResponse } from 'model/api.response';
import { RecordHistoryQueryRo } from 'model/ro/datasheet/record.history.query.ro';
import { RecordHistoryVo } from 'model/vo/datasheet/record.history.vo';
import { ChangesetView, DatasheetPack } from 'models';
import { DatasheetMetaService } from 'modules/services/datasheet/datasheet.meta.service';
import { DatasheetRecordService } from 'modules/services/datasheet/datasheet.record.service';
import { NodePermissionService } from 'modules/services/node/node.permission.service';
import { NodeService } from 'modules/services/node/node.service';
import { NodeShareSettingService } from 'modules/services/node/node.share.setting.service';
import { ChangesetService } from 'modules/services/resource/changeset.service';
import { ResourceService } from 'modules/services/resource/resource.service';
import { UserService } from 'modules/services/user/user.service';
import { OtService } from 'modules/ot/ot.service';

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

  @Get(['resources/:resourceId/changesets', 'resource/:resourceId/changesets'])
  async getChangesetList(
    @Param('resourceId') resourceId: string,
    @Query() query: { revisions: string | number[]; resourceType: ResourceType },
  ): Promise<ChangesetView[]> {
    return await this.changesetService.getChangesetList(resourceId, Number(query.resourceType), query.revisions);
  }

  @Get(['resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack', 'resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getFormForeignDatasheetPack(
    @Headers('cookie') cookie: string, @Param('resourceId') resourceId: string, @Param('foreignDatasheetId') foreignDatasheetId: string
  ): Promise<DatasheetPack> {
    // 检查当前用户是否在当前空间
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, resourceId);
    // 校验节点权限
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
    // 检查节点是否为分享可编辑
    await this.nodeShareSettingService.checkNodeShareCanBeEdited(shareId, resourceId);
    return await this.resourceService.fetchForeignDatasheetPack(resourceId, foreignDatasheetId, { cookie }, shareId);
  }

  /**
   * 获取维格表指定记录的修改历史和评论
   */
  @Get('resources/:resourceId/records/:recId/activity')
  public async getActivity(@Headers('cookie') cookie: string, @Param('resourceId') resourceId: string,
                           @Param('recId') recId: string, @Query() query: RecordHistoryQueryRo): Promise<RecordHistoryVo> {
    // 获取节点的权限
    const permission = await this.nodePermissionService.getNodePermission(resourceId, { cookie }, { main: true, internal: true });
    // 列权限过滤
    const filterFiledIds: string[] = [];
    const fieldPermissionMap = permission.fieldPermissionMap;
    if (fieldPermissionMap) {
      for (const fieldId in fieldPermissionMap) {
        if (fieldPermissionMap.hasOwnProperty(fieldId) && !fieldPermissionMap[fieldId].permission.readable) {
          filterFiledIds.push(fieldId);
        }
      }
    }
    // 需要保留的列，排除自增数字字段/没有可读权限的列
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

