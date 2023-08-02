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

import { ILocalChangeset, OtErrorCode, readonlyFields, ResourceIdPrefix, ResourceType } from '@apitable/core';
import { Body, Controller, Get, Headers, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { DatasheetRecordService } from 'database/datasheet/services/datasheet.record.service';
import { NodePermissionService } from 'node/services/node.permission.service';
import { NodeService } from 'node/services/node.service';
import { NodeShareSettingService } from 'node/services/node.share.setting.service';
import { OtService } from 'database/ot/services/ot.service';
import { ChangesetService } from 'database/resource/services/changeset.service';
import { ResourceService } from 'database/resource/services/resource.service';
import { UserService } from 'user/services/user.service';
import { ApiResponse } from 'fusion/vos/api.response';
import { RecordHistoryTypeEnum } from 'shared/enums/record.history.enum';
import { PermissionException, ServerException } from 'shared/exception';
import { ResourceDataInterceptor } from 'database/resource/middleware/resource.data.interceptor';
import type { ChangesetView, DatasheetPack } from '../../interfaces';
import type { RecordHistoryQueryRo } from '../../datasheet/ros/record.history.query.ro';
import type { RecordHistoryVo } from '../vos/record.history.vo';

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

  @Get('resources/:resourceId/changesets')
  async getChangesetList(
    @Headers('cookie') cookie: string,
    @Param('resourceId') resourceId: string,
    @Query() query: { sourceId: string; resourceType: ResourceType; startRevision: number; endRevision: number },
  ): Promise<ChangesetView[]> {
    // check if the user belongs to this space
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, resourceId);
    // check the user has the privileges of the node
    await this.nodeService.checkNodePermission(query.sourceId || resourceId, { cookie });
    await this.resourceService.checkResourceEntry(resourceId, query.resourceType, query.sourceId);
    if (query.endRevision - query.startRevision > 100) {
      throw new ServerException(PermissionException.OPERATION_DENIED);
    }
    return await this.changesetService.getChangesetList(resourceId, Number(query.resourceType), query.startRevision, query.endRevision);
  }

  @Get('shares/:shareId/resources/:resourceId/changesets')
  async getShareChangesetList(
    @Param('shareId') shareId: string,
    @Param('resourceId') resourceId: string,
    @Query() query: { sourceId: string; resourceType: ResourceType; startRevision: number; endRevision: number },
  ): Promise<ChangesetView[]> {
    if (query.endRevision - query.startRevision > 100) {
      throw new ServerException(PermissionException.OPERATION_DENIED);
    }
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, query.sourceId || resourceId);
    await this.resourceService.checkResourceEntry(resourceId, query.resourceType, query.sourceId);
    // Share limit can only load the most recent 100 versions
    const maxRevision = await this.changesetService.getMaxRevision(resourceId, query.resourceType);
    if (maxRevision! - query.startRevision >= 100) {
      throw new ServerException(PermissionException.OPERATION_DENIED);
    }
    return await this.changesetService.getChangesetList(resourceId, Number(query.resourceType), query.startRevision, query.endRevision);
  }

  @Get('resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack')
  @UseInterceptors(ResourceDataInterceptor)
  async getForeignDatasheetPack(
    @Headers('cookie') cookie: string,
    @Param('resourceId') resourceId: string,
    @Param('foreignDatasheetId') foreignDatasheetId: string,
  ): Promise<DatasheetPack> {
    // check if the user belongs to this space
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, resourceId);
    // check the user has the privileges of the node
    await this.nodeService.checkNodePermission(resourceId, { cookie });
    return await this.resourceService.fetchForeignDatasheetPack(resourceId, foreignDatasheetId, { cookie }, true);
  }

  @Get('shares/:shareId/resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack')
  @UseInterceptors(ResourceDataInterceptor)
  async getShareForeignDatasheetPack(
    @Headers('cookie') cookie: string,
    @Param('resourceId') resourceId: string,
    @Param('foreignDatasheetId') foreignDatasheetId: string,
    @Param('shareId') shareId: string,
  ): Promise<DatasheetPack> {
    // check if the share link of the node is editable
    await this.nodeShareSettingService.checkNodeShareCanBeEdited(shareId, resourceId);
    return await this.resourceService.fetchForeignDatasheetPack(resourceId, foreignDatasheetId, { cookie }, true, shareId);
  }

  /**
   * get comments and history of the record
   */
  @Get('resources/:resourceId/records/:recId/activity')
  public async getActivity(
    @Headers('cookie') cookie: string,
    @Param('resourceId') resourceId: string,
    @Param('recId') recId: string,
    @Query() query: RecordHistoryQueryRo,
  ): Promise<RecordHistoryVo> {
    // get permissions
    const permission = await this.nodePermissionService.getNodePermission(resourceId, { cookie }, { main: true, internal: true });
    // filter fields by permissions
    const filterFiledIds: string[] = [];
    const fieldPermissionMap = permission.fieldPermissionMap;
    if (fieldPermissionMap) {
      for (const fieldId in fieldPermissionMap) {
        if (fieldPermissionMap.hasOwnProperty(fieldId) && !fieldPermissionMap[fieldId]!.permission.readable) {
          filterFiledIds.push(fieldId);
        }
      }
    }
    // eliminate auto-increment and no permissions fields
    const dstId = resourceId.startsWith(ResourceIdPrefix.Datasheet) ? resourceId : await this.nodeService.getMainNodeId(resourceId);
    const fieldIds = await this.datasheetMetaService.getFieldIdByDstId(dstId, filterFiledIds, readonlyFields);
    const spaceId = await this.nodeService.getSpaceIdByNodeId(dstId);
    const showRecordHistory: boolean = await this.nodeService.showRecordHistory(dstId, query.type == RecordHistoryTypeEnum.MODIFY_HISTORY);
    const recordHistoryDto = await this.datasheetRecordService.getActivityList(spaceId, dstId, recId, showRecordHistory, query, fieldIds);
    return ApiResponse.success(recordHistoryDto!);
  }

  @Post('resources/apply/changesets')
  async applyChangesets(
    @Headers('cookie') cookie: string,
    @Body()
      data: {
      changesets: ILocalChangeset[];
      roomId: string;
    },
  ) {
    const { roomId, changesets } = data;
    let result;
    try {
      result = await this.otService.applyChangesets(roomId, changesets, { cookie });
    } catch (e) {
      if (e instanceof ServerException && e.getCode() === OtErrorCode.MSG_ID_DUPLICATE) {
        return ApiResponse.success(result);
      }
      throw e;
    }

    return result;
  }
}
