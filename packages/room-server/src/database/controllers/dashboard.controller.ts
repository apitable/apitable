import { Controller, Get, Headers, Param, UseInterceptors } from '@nestjs/common';
import { PermissionException } from '../../shared/exception/permission.exception';
import { ServerException } from '../../shared/exception/server.exception';
import { ResourceDataInterceptor } from 'shared/middleware/resource.data.interceptor';
import { DashboardService } from 'database/services/dashboard/dashboard.service';
import { NodeService } from 'database/services/node/node.service';
import { NodeShareSettingService } from 'database/services/node/node.share.setting.service';
import { UserService } from 'database/services/user/user.service';

/**
 * 仪表盘 Controller
 */
@Controller('nest/v1')
export class DashboardController {
  constructor(
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly dashboardService: DashboardService,
    private readonly nodeShareSettingService: NodeShareSettingService,
  ) { }

  @Get(['dashboards/:dashboardId/dataPack', 'dashboard/:dashboardId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getDatePack(@Headers('cookie') cookie: string,
                    @Headers('token') token: string,
                    @Param('dashboardId') dashboardId: string,
  ) {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dashboardId);
    return await this.dashboardService.fetchDashboardPack(dashboardId, { token, cookie });
  }

  @Get(['shares/:shareId/dashboards/:dashboardId/dataPck', 'share/:shareId/dashboard/:dashboardId/dataPck'])
  @UseInterceptors(ResourceDataInterceptor)
  async getShareDashboardPack(
    @Headers('cookie') cookie: string,
    @Headers('token') token: string,
    @Param('shareId') shareId: string,
    @Param('dashboardId') dashboardId: string,
  ) {
    // 校验节点是否在分享之列
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, dashboardId);
    return await this.dashboardService.fetchShareDashboardPack(shareId, dashboardId, { token, cookie });
  }

  @Get(['templates/:templateId/dashboards/:dashboardId/dataPck', 'template/:templateId/dashboard/:dashboardId/dataPck'])
  async getTemplateDashboardPack(
    @Headers('cookie') cookie: string,
    @Headers('token') token: string,
    @Param('templateId') templateId: string,
    @Param('dashboardId') dashboardId: string,
  ) {
    const isTemplate = await this.nodeService.isTemplate(dashboardId);
    if (!isTemplate) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
    return await this.dashboardService.fetchTemplateDashboardPack(templateId, dashboardId, { token, cookie });
  }

}
