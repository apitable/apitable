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

import type { IMeta } from '@apitable/core';
import { Body, Controller, Delete, Get, Headers, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { UserService } from 'user/services/user.service';
import { DatasheetException, PermissionException, ServerException } from 'shared/exception';
import { ResourceDataInterceptor } from 'database/resource/middleware/resource.data.interceptor';
import type { CommentReplyDto } from '../dtos/comment.reply.dto';
import { DatasheetRecordSubscriptionBaseService } from 'database/subscription/datasheet.record.subscription.base.service';
import type { DatasheetPack, RecordsMapView, UserInfo, ViewPack } from '../../interfaces';
import { DatasheetPackRo } from '../ros/datasheet.pack.ro';
import { NodeService } from 'node/services/node.service';
import { NodeShareSettingService } from 'node/services/node.share.setting.service';
import { DatasheetMetaService } from '../services/datasheet.meta.service';
import { DatasheetRecordService } from '../services/datasheet.record.service';
import { DatasheetService } from '../services/datasheet.service';
import { MetaService } from 'database/resource/services/meta.service';
import type { DatasheetPackResponse } from '@apitable/databus';

/**
 * Datasheet APIs
 */
@Controller('nest/v1')
export class DatasheetController {
  constructor(
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly nodeShareSettingService: NodeShareSettingService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordService: DatasheetRecordService,
    private readonly datasheetRecordSubscriptionService: DatasheetRecordSubscriptionBaseService,
    private readonly resourceMetaService: MetaService,
  ) {}

  @Get('datasheets/:dstId/dataPack')
  @UseInterceptors(ResourceDataInterceptor)
  async getDataPack(
    @Headers('cookie') cookie: string,
    @Param('dstId') dstId: string,
    @Query() query: DatasheetPackRo,
  ): Promise<DatasheetPackResponse | DatasheetPack> {
    // check if the user belongs to this space
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    return this.datasheetService.fetchDataPack(dstId, { cookie }, true, { recordIds: query.recordIds });
  }

  @Get('shares/:shareId/datasheets/:dstId/dataPack')
  @UseInterceptors(ResourceDataInterceptor)
  async getShareDataPack(
    @Headers('cookie') cookie: string,
    @Param('shareId') shareId: string,
    @Param('dstId') dstId: string,
  ): Promise<DatasheetPack | DatasheetPackResponse> {
    // check if the node has been shared
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, dstId);
    return await this.datasheetService.fetchShareDataPack(shareId, dstId, { cookie }, true);
  }

  @Get('templates/datasheets/:dstId/dataPack')
  async getTemplateDataPack(@Headers('cookie') cookie: string, @Param('dstId') dstId: string): Promise<DatasheetPack | DatasheetPackResponse> {
    const isTemplate = await this.nodeService.isTemplate(dstId);
    if (!isTemplate) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
    return await this.datasheetService.fetchTemplatePack(dstId, { cookie });
  }

  @Get('datasheets/:nodeId/users')
  async getUserList(@Param('nodeId') nodeId: string, @Query() query: { uuids: string[] }): Promise<UserInfo[]> {
    return await this.datasheetService.fetchUsers(nodeId, query.uuids);
  }

  @Get('datasheets/:dstId/meta')
  async getDataSheetMeta(@Headers('cookie') cookie: string, @Param('dstId') dstId: string): Promise<IMeta> {
    // check if the user belongs to this space
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    return await this.datasheetMetaService.getMetaDataByDstId(dstId);
  }

  // TODO: use HTTP Get method instead, the number of recordIds should be limited
  @Post('datasheets/:dstId/records')
  async getRecords(@Param('dstId') dstId: string, @Body() recordIds: string[]): Promise<RecordsMapView> {
    const revision = await this.resourceMetaService.getRevisionByDstId(dstId);
    // revision not found error
    if (revision == null) {
      throw new ServerException(DatasheetException.VERSION_ERROR);
    }
    const recordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, recordIds);
    return { revision, recordMap };
  }

  @Get('datasheets/:dstId/views/:viewId/dataPack')
  async getViewPack(@Headers('cookie') cookie: string, @Param('dstId') dstId: string, @Param('viewId') viewId: string): Promise<ViewPack> {
    // check if the user belongs to this space
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    // check if the user has the privileges of the node
    await this.nodeService.checkNodePermission(dstId, { cookie });
    return await this.datasheetService.fetchViewPack(dstId, viewId);
  }

  @Get('shares/:shareId/datasheets/:dstId/views/:viewId/dataPack')
  async getShareViewPack(@Param('shareId') shareId: string, @Param('dstId') dstId: string, @Param('viewId') viewId: string): Promise<ViewPack> {
    // check if the node has been shared
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, dstId);
    return await this.datasheetService.fetchViewPack(dstId, viewId);
  }

  //TODO: remove `datasheet/:dstId/record/:recordId/comments` path after release/0.22.0
  @Get(['datasheets/:dstId/records/:recordId/comments', 'datasheet/:dstId/record/:recordId/comments'])
  async getCommentByIds(
    @Headers('cookie') cookie: string,
    @Param('dstId') dstId: string,
    @Param('recordId') recordId: string,
    @Query('commentIds') commentIds: string,
  ): Promise<CommentReplyDto> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    const _commentIds = commentIds.split(',');
    return await this.datasheetRecordService.getCommentReplyMap(dstId, recordId, _commentIds);
  }

  @Get(['datasheets/:dstId/records/subscriptions'])
  async getSubscribedRecords(@Headers('cookie') cookie: string, @Param('dstId') dstId: string): Promise<string[]> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    await this.nodeService.checkNodePermission(dstId, { cookie });
    return await this.datasheetRecordSubscriptionService.getSubscribedRecordIds(userId, dstId);
  }

  @Post(['datasheets/:dstId/records/subscriptions'])
  async subscribeRecords(@Headers('cookie') cookie: string, @Param('dstId') dstId: string, @Body() data: { recordIds: string[] }) {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    await this.nodeService.checkNodePermission(dstId, { cookie });
    await this.datasheetRecordSubscriptionService.subscribeDatasheetRecords(userId, dstId, data.recordIds);
  }

  @Delete(['datasheets/:dstId/records/subscriptions'])
  async unsubscribeRecords(@Headers('cookie') cookie: string, @Param('dstId') dstId: string, @Body() data: { recordIds: string[] }) {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    await this.nodeService.checkNodePermission(dstId, { cookie });
    await this.datasheetRecordSubscriptionService.unsubscribeDatasheetRecords(userId, dstId, data.recordIds);
  }
}
