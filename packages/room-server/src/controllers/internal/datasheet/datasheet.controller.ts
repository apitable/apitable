import { Body, Controller, Delete, Get, Headers, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { IMeta } from '@vikadata/core';
import { DatasheetException } from 'exception/datasheet.exception';
import { PermissionException } from 'exception/permission.exception';
import { ServerException } from 'exception/server.exception';
import { ResourceDataInterceptor } from 'middleware/resource.data.interceptor';
import { DatasheetPackRo } from 'model/ro/datasheet/datasheet.pack.ro';
import { DatasheetPack, RecordsMapView, UserInfo, ViewPack } from 'models';
import { DatasheetMetaService } from 'modules/services/datasheet/datasheet.meta.service';
import { DatasheetRecordService } from 'modules/services/datasheet/datasheet.record.service';
import { DatasheetService } from 'modules/services/datasheet/datasheet.service';
import { NodeService } from 'modules/services/node/node.service';
import { NodeShareSettingService } from 'modules/services/node/node.share.setting.service';
import { UserService } from 'modules/services/user/user.service';
import { NodePermissionService } from 'modules/services/node/node.permission.service';
import { CommentReplyDto } from 'model/dto/datasheet/comment.reply.dto';
import { DatasheetRecordSubscriptionService } from 'modules/services/datasheet/datasheet.record.subscription.service';
import { InjectLogger } from 'common';
import { Logger } from 'winston';

/**
 * 数表接口
 */
@Controller('nest/v1')
export class DatasheetController {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly nodeShareSettingService: NodeShareSettingService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordService: DatasheetRecordService,
    private readonly datasheetRecordSubscriptionService: DatasheetRecordSubscriptionService,
    private readonly nodePermissionService: NodePermissionService,
  ) {}

  @Get(['datasheets/:dstId/dataPack', 'datasheet/:dstId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getDataPack(@Headers('cookie') cookie: string, @Param('dstId') dstId: string, @Query() query: DatasheetPackRo,): Promise<DatasheetPack> {
    // 检查当前用户是否在当前空间
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    return await this.datasheetService.fetchDataPack(dstId, { cookie }, { recordIds: query.recordIds });
  }

  @Get(['shares/:shareId/datasheets/:dstId/dataPack', 'share/:shareId/datasheet/:dstId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getShareDataPack(
    @Headers('cookie') cookie: string, @Param('shareId') shareId: string, @Param('dstId') dstId: string
  ): Promise<DatasheetPack> {
    // 校验节点是否在分享之列
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, dstId);
    return await this.datasheetService.fetchShareDataPack(shareId, dstId, { cookie });
  }

  @Get(['templates/datasheets/:dstId/dataPack', 'template/datasheet/:dstId/dataPack'])
  async getTemplateDataPack(@Headers('cookie') cookie: string, @Param('dstId') dstId: string): Promise<DatasheetPack> {
    const isTemplate = await this.nodeService.isTemplate(dstId);
    if (!isTemplate) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
    return await this.datasheetService.fetchTemplatePack(dstId, { cookie });
  }

  @Get(['datasheets/:nodeId/users', 'datasheet/:nodeId/users'])
  async getUserList(@Param('nodeId') nodeId: string, @Query() query: { uuids: string[] }): Promise<UserInfo[]> {
    return await this.datasheetService.fetchUsers(nodeId, query.uuids);
  }

  @Get(['datasheets/:dstId/meta', 'datasheet/:dstId/meta'])
  async getDataSheetMeta(@Headers('cookie') cookie: string, @Param('dstId') dstId: string): Promise<IMeta> {
    // 检查当前用户是否在当前空间
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    return await this.datasheetMetaService.getMetaDataByDstId(dstId);
  }

  @Post(['datasheets/:dstId/records', 'datasheet/:dstId/records'])
  async getRecords(@Param('dstId') dstId: string, @Body() recordIds: string[]): Promise<RecordsMapView> {
    // recordIds可能很多，突破get请求的限制，所以用post请求
    const revision = await this.nodeService.getRevisionByDstId(dstId);
    // 版本找不到的错误
    if (revision == null) {
      throw new ServerException(DatasheetException.VERSION_ERROR);
    }
    const recordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, recordIds);
    return { revision, recordMap };
  }

  @Get(['datasheets/:dstId/views/:viewId/dataPack', 'datasheet/:dstId/view/:viewId/dataPack'])
  async getViewPack(@Headers('cookie') cookie: string,
                    @Param('dstId') dstId: string, @Param('viewId') viewId: string): Promise<ViewPack> {
    // 检查当前用户是否在当前空间
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    // 校验节点权限
    await this.nodeService.checkNodePermission(dstId, { cookie });
    return await this.datasheetService.fetchViewPack(dstId, viewId);
  }

  @Get(['shares/:shareId/datasheets/:dstId/views/:viewId/dataPack', 'share/:shareId/datasheet/:dstId/view/:viewId/dataPack'])
  async getShareViewPack(@Param('shareId') shareId: string,
                         @Param('dstId') dstId: string, @Param('viewId') viewId: string): Promise<ViewPack> {
    // 校验节点是否在分享之列
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, dstId);
    return await this.datasheetService.fetchViewPack(dstId, viewId);
  }

  @Get(['datasheets/:dstId/record/:recordId/comments', 'datasheet/:dstId/record/:recordId/comments'])
  async getCommentByIds(
    @Headers('cookie') cookie: string,
    @Param('dstId') dstId: string,
    @Param('recordId') recordId: string,
    @Query('commentIds') commentIds: string
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
  async subscribeRecords(@Headers('cookie') cookie: string, @Param('dstId') dstId: string, @Body() data: {recordIds: string[]}) {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    await this.nodeService.checkNodePermission(dstId, { cookie });
    await this.datasheetRecordSubscriptionService.subscribeDatasheetRecords(userId, dstId, data.recordIds);
  }

  @Delete(['datasheets/:dstId/records/subscriptions'])
  async unsubscribeRecords(@Headers('cookie') cookie: string, @Param('dstId') dstId: string, @Body() data: {recordIds: string[]}) {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dstId);
    await this.nodeService.checkNodePermission(dstId, { cookie });
    await this.datasheetRecordSubscriptionService.unsubscribeDatasheetRecords(userId, dstId, data.recordIds);
  }
}
