import { Controller, Headers, Get, Param, UseInterceptors, Query, Body, Post, Delete } from '@nestjs/common';
import { ResourceDataInterceptor } from 'shared/middleware/resource.data.interceptor';
import { DatasheetPack, MirrorInfo } from '../interfaces';
import { DatasheetRecordSubscriptionService } from 'database/services/datasheet/datasheet.record.subscription.service';
import { MirrorService } from 'database/services/mirror/mirror.service';
import { NodeService } from 'database/services/node/node.service';
import { NodeShareSettingService } from 'database/services/node/node.share.setting.service';
import { UserService } from 'database/services/user/user.service';
import { DatasheetPackRo } from '../ros/datasheet.pack.ro';

/**
 * mirror interface
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
    const isTemplate = await this.nodeService.isTemplate(mirrorId);
    if (!isTemplate) {
      // if it is not a template, check if it belongs to this space
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
    // check if the node has been shared
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, mirrorId);
    return await this.mirrorService.getMirrorInfo(mirrorId, { cookie }, { internal: false, main: true, shareId });
  }

  @Get(['mirrors/:mirrorId/dataPack', 'mirror/:mirrorId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getDataPack(@Headers('cookie') cookie: string, @Param('mirrorId') mirrorId: string,
                    @Query() query: DatasheetPackRo,): Promise<DatasheetPack> {
    const isTemplate = await this.nodeService.isTemplate(mirrorId);
    if (!isTemplate) {
      // if it is not a template, check if it belongs to this space
      const { userId } = await this.userService.getMe({ cookie });
      await this.nodeService.checkUserForNode(userId, mirrorId);
    }
    // check the user has the privileges of the node
    await this.nodeService.checkNodePermission(mirrorId, { cookie });
    return await this.mirrorService.fetchDataPack(mirrorId, { cookie }, { internal: !isTemplate, recordIds: query.recordIds });
  }

  @Get(['shares/:shareId/mirrors/:mirrorId/dataPack', 'share/:shareId/mirror/:mirrorId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getShareDataPack(
    @Headers('cookie') cookie: string, @Param('shareId') shareId: string, @Param('mirrorId') mirrorId: string
  ): Promise<DatasheetPack> {
    // check if the node has been shared
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, mirrorId);
    return await this.mirrorService.fetchDataPack(mirrorId, { cookie }, { internal: false, main: true, shareId });
  }

  @Get(['mirrors/:mirrorId/records/subscriptions'])
  async getSubscribedRecords(@Headers('cookie') cookie: string, @Param('mirrorId') mirrorId: string): Promise<string[]> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, mirrorId);
    await this.nodeService.checkNodePermission(mirrorId, { cookie });
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(mirrorId);
    // TODO: filter records that are not in the mirror
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
    // TODO: filter records that are not in the mirror
    await this.datasheetRecordSubscriptionService.unsubscribeDatasheetRecords(userId, nodeRelInfo.datasheetId, data.recordIds);
  }
}
