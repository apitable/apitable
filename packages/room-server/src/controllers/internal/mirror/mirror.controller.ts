import { Controller, Headers, Get, Param, UseInterceptors, Query, Body, Post, Delete } from '@nestjs/common';
import { ResourceDataInterceptor } from 'middleware/resource.data.interceptor';
import { DatasheetPack, MirrorInfo } from 'models';
import { DatasheetRecordSubscriptionService } from 'modules/services/datasheet/datasheet.record.subscription.service';
import { MirrorService } from 'modules/services/mirror/mirror.service';
import { NodeService } from 'modules/services/node/node.service';
import { NodeShareSettingService } from 'modules/services/node/node.share.setting.service';
import { UserService } from 'modules/services/user/user.service';
import { DatasheetPackRo } from '../../../model/ro/datasheet/datasheet.pack.ro';

/**
 * mirror 接口
 */
@Controller('nest/v1')
export class MirrorController {
  constructor(
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly nodeShareSettingService: NodeShareSettingService,
    private readonly mirrorService: MirrorService,
    private readonly datasheetRecordSubscriptionService: DatasheetRecordSubscriptionService,
  ) { }

  @Get(['mirrors/:mirrorId/info', 'mirror/:mirrorId/info'])
  @UseInterceptors(ResourceDataInterceptor)
  async getMirrorInfo(@Headers('cookie') cookie: string, @Param('mirrorId') mirrorId: string): Promise<MirrorInfo> {
    // 查询节点是否属于模板
    const isTemplate = await this.nodeService.isTemplate(mirrorId);
    if (!isTemplate) {
      // 非模板。检查当前用户是否在当前空间
      const { userId } = await this.userService.getMe({ cookie });
      await this.nodeService.checkUserForNode(userId, mirrorId);
    }
    return await this.mirrorService.getMirrorInfo(mirrorId, { cookie }, { internal: !isTemplate, main: true, notDst: true });
  }

  @Get(['shares/:shareId/mirrors/:mirrorId/info', 'share/:shareId/mirror/:mirrorId/info'])
  @UseInterceptors(ResourceDataInterceptor)
  async getShareMirrorInfo(
    @Headers('cookie') cookie: string, @Param('shareId') shareId: string, @Param('mirrorId') mirrorId: string
  ): Promise<MirrorInfo> {
    // 校验节点是否在分享之列
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, mirrorId);
    return await this.mirrorService.getMirrorInfo(mirrorId, { cookie }, { internal: false, main: true, shareId });
  }

  @Get(['mirrors/:mirrorId/dataPack', 'mirror/:mirrorId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getDataPack(@Headers('cookie') cookie: string, @Param('mirrorId') mirrorId: string,
                    @Query() query: DatasheetPackRo,): Promise<DatasheetPack> {
    // 查询节点是否属于模板
    const isTemplate = await this.nodeService.isTemplate(mirrorId);
    if (!isTemplate) {
      // 非模板。检查当前用户是否在当前空间
      const { userId } = await this.userService.getMe({ cookie });
      await this.nodeService.checkUserForNode(userId, mirrorId);
    }
    // 校验节点权限
    await this.nodeService.checkNodePermission(mirrorId, { cookie });
    return await this.mirrorService.fetchDataPack(mirrorId, { cookie }, { internal: !isTemplate, recordIds: query.recordIds });
  }

  @Get(['shares/:shareId/mirrors/:mirrorId/dataPack', 'share/:shareId/mirror/:mirrorId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getShareDataPack(
    @Headers('cookie') cookie: string, @Param('shareId') shareId: string, @Param('mirrorId') mirrorId: string
  ): Promise<DatasheetPack> {
    // 校验节点是否在分享之列
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, mirrorId);
    return await this.mirrorService.fetchDataPack(mirrorId, { cookie }, { internal: false, main: true, shareId });
  }

  @Get(['mirrors/:mirrorId/records/subscriptions'])
  async getSubscribedRecords(@Headers('cookie') cookie: string, @Param('mirrorId') mirrorId: string): Promise<string[]> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, mirrorId);
    await this.nodeService.checkNodePermission(mirrorId, { cookie });
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(mirrorId);
    // 是否需要 apply 镜像过滤条件将镜像外的 record ids 剔除? 影响性能
    return await this.datasheetRecordSubscriptionService.getSubscribedRecordIds(userId, nodeRelInfo.datasheetId);
  }

  @Post(['mirrors/:mirrorId/records/subscriptions'])
  async subscribeRecords(@Headers('cookie') cookie: string, @Param('mirrorId') mirrorId: string, @Body() data: {recordIds: string[]}) {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, mirrorId);
    await this.nodeService.checkNodePermission(mirrorId, { cookie });
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(mirrorId);
    await this.datasheetRecordSubscriptionService.subscribeDatasheetRecords(userId, nodeRelInfo.datasheetId, data.recordIds, mirrorId);
  }

  @Delete(['mirrors/:mirrorId/records/subscriptions'])
  async unsubscribeRecords(@Headers('cookie') cookie: string, @Param('mirrorId') mirrorId: string, @Body() data: {recordIds: string[]}) {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, mirrorId);
    await this.nodeService.checkNodePermission(mirrorId, { cookie });
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(mirrorId);
    // 是否需要 apply 镜像过滤条件将镜像外的 record ids 剔除? 影响性能
    await this.datasheetRecordSubscriptionService.unsubscribeDatasheetRecords(userId, nodeRelInfo.datasheetId, data.recordIds);
  }
}
