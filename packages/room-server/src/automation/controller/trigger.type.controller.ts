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

import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { isProdMode } from 'app.environment';
import { UserService } from 'user/services/user.service';
import { TriggerTypeCreateRo } from '../ros/trigger.type.create.ro';
import { TriggerTypeUpdateRo } from '../ros/trigger.type.update.ro';
import { AutomationService } from '../services/automation.service';

@Controller('nest/v1/robots/trigger-types')
export class RobotTriggerTypeController {
  constructor(
    private readonly automationService: AutomationService,
    private readonly userService: UserService,
  ) { }

  @Get(['/'])
  getTriggerTypes(@Query('lang') lang: string) {
    const language = (!lang || lang.includes('zh')) ? 'zh' : 'en';
    return this.automationService.getTriggerType(language);
  }

  @Post('/')
  async createTriggerType(@Body() triggerType: TriggerTypeCreateRo, @Headers('cookie') cookie: string) {
    if (isProdMode) {
      throw new Error('cant create trigger type in production mode');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.createTriggerType(triggerType, user);
  }

  @Patch('/:triggerTypeId')
  async updateTriggerType(
    @Param('triggerTypeId') triggerTypeId: string,
    @Body() data: TriggerTypeUpdateRo,
    @Headers('cookie') cookie: string
  ) {
    if (isProdMode) {
      throw new Error('cant update trigger type in production mode');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.updateTriggerType(triggerTypeId, data, user);
  }

}
