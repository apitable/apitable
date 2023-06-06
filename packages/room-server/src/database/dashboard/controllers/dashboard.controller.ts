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

import { Controller, Get, Headers, Param, UseInterceptors } from '@nestjs/common';
import { DashboardService } from 'database/dashboard/services/dashboard.service';
import { UserService } from 'user/services/user.service';
import { PermissionException, ServerException } from 'shared/exception';
import { ResourceDataInterceptor } from 'database/resource/middleware/resource.data.interceptor';
import { NodeService } from 'node/services/node.service';
import { NodeShareSettingService } from 'node/services/node.share.setting.service';

/**
 * Dashboard Controller
 */
@Controller('nest/v1')
export class DashboardController {
  constructor(
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly dashboardService: DashboardService,
    private readonly nodeShareSettingService: NodeShareSettingService,
  ) { }

  @Get('dashboards/:dashboardId/dataPack')
  @UseInterceptors(ResourceDataInterceptor)
  async getDatePack(@Headers('cookie') cookie: string,
                    @Headers('token') token: string,
                    @Param('dashboardId') dashboardId: string,
  ) {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, dashboardId);
    return await this.dashboardService.fetchDashboardPack(dashboardId, { token, cookie });
  }

  @Get('shares/:shareId/dashboards/:dashboardId/dataPck')
  @UseInterceptors(ResourceDataInterceptor)
  async getShareDashboardPack(
    @Headers('cookie') cookie: string,
    @Headers('token') token: string,
    @Param('shareId') shareId: string,
    @Param('dashboardId') dashboardId: string,
  ) {
    // check if the node has been shared
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, dashboardId);
    return await this.dashboardService.fetchShareDashboardPack(shareId, dashboardId, { token, cookie });
  }

  @Get('templates/:templateId/dashboards/:dashboardId/dataPck')
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
