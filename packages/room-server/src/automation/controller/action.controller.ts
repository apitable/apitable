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

import { Body, Controller, Delete, Headers, Param, Patch, Post } from '@nestjs/common';
import { RobotActionService } from '../services/robot.action.service';
import { UserService } from 'user/services/user.service';
import { AutomationActionRepository } from '../repositories/automation.action.repository';
import { ActionCreateRo } from '../ros/action.create.ro';

@Controller('nest/v1/robots/actions')
export class RobotActionController {
  constructor(
    private readonly automationActionRepository: AutomationActionRepository,
    private readonly automationActionService: RobotActionService,
    private readonly userService: UserService,
  ) { }

  @Post(['/'])
  async createAction(@Body() action: ActionCreateRo, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    return this.automationActionRepository.createAction(action, user.userId);
  }

  @Patch(['/:actionId'])
  async changeActionTypeId(
    @Param('actionId') actionId: string,
    @Body() data: { actionTypeId?: string, input?: object },
    @Headers('cookie') cookie: string
  ) {
    const user = await this.userService.getMe({ cookie });
    if (data.actionTypeId) {
      return this.automationActionRepository.changeActionTypeId(actionId, data.actionTypeId, user.userId);
    }
    if (data.input) {
      return this.automationActionRepository.updateActionInput(actionId, data.input, user.userId);
    }
    return { ok: false, msg: 'nothing changed' };
  }

  @Delete(['/:actionId'])
  async deleteRobotAction(
    @Param('actionId') actionId: string,
    @Headers('cookie') cookie: string
  ) {
    const { userId } = await this.userService.getMe({ cookie });
    return this.automationActionService.deleteRobotActionByActionId(userId, actionId);
  }
}
