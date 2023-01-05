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

import { Body, Controller, Headers, Param, Patch, Post } from '@nestjs/common';
import { isProdMode } from 'app.environment';
import { AutomationServiceCreateRo } from '../ros/service.create.ro';
import { AutomationServiceUpdateRo } from '../ros/service.update.ro';
import { AutomationService } from '../services/automation.service';
import { UserService } from 'user/services/user.service';

@Controller('nest/v1/robots/actions')
export class RobotServiceController {
  constructor(
    private readonly automationService: AutomationService,
    private readonly userService: UserService,
  ) { }

  @Post('service')
  async createService(@Body() service: AutomationServiceCreateRo, @Headers('cookie') cookie: string) {
    if (isProdMode) {
      throw new Error('cant create service in production mode');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.createService(service, user);
  }

  @Patch('service/:serviceId')
  async updateService(
    @Param('serviceId') serviceId: string,
    @Body() data: AutomationServiceUpdateRo,
    @Headers('cookie') cookie: string
  ) {
    if (isProdMode) {
      throw new Error('cant update service in production mode');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.updateService(serviceId, data, user);
  }

}
