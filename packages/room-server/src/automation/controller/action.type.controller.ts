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
import { ActionTypeCreateRo } from '../ros/action.type.create.ro';
import { TriggerTypeUpdateRo } from '../ros/trigger.type.update.ro';
import { UserService } from 'user/services/user.service';
import { RobotActionTypeBaseService } from '../services/robot.action.type.base.service';

@Controller('nest/v1/robots/action-types')
export class RobotActionTypeController {
  constructor(
    private readonly robotActionTypeService: RobotActionTypeBaseService,
    private readonly userService: UserService,
  ) { }

  @Get(['/'])
  getActionTypes(@Query('lang') lang: string | string[]) {
    const language = (!lang || lang.includes('zh')) ? 'zh' : 'en';
    return this.robotActionTypeService.getActionType(language);
  }

  @Post('/')
  async createActionType(@Body() actionType: ActionTypeCreateRo, @Headers('cookie') cookie: string) {
    if (isProdMode) {
      throw new Error('cannot create action type in production mode');
    }
    const user = await this.userService.getMe({ cookie });
    return this.robotActionTypeService.createActionType(actionType, user);
  }

  @Patch('/:actionTypeId')
  async updateActionType(
    @Param('actionTypeId') actionTypeId: string,
    @Body() data: TriggerTypeUpdateRo,
    @Headers('cookie') cookie: string
  ) {
    if (isProdMode) {
      throw new Error('cannot update action type in production mode');
    }
    const user = await this.userService.getMe({ cookie });
    return this.robotActionTypeService.updateActionType(actionTypeId, data, user);
  }
}
