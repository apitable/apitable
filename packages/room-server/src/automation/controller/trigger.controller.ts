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
import { UserService } from 'user/services/user.service';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { TriggerCreateRo } from '../ros/trigger.create.ro';
import { TriggerEventHelper } from 'automation/events/helpers/trigger.event.helper';

@Controller(['nest/v1/robots/triggers', 'nest/v1/automation/triggers'])
export class RobotTriggerController {
  constructor(
    private readonly automationTriggerRepository: AutomationTriggerRepository,
    private readonly userService: UserService,
    private readonly triggerEventHelper: TriggerEventHelper,
  ) { }

  @Post(['/'])
  async createTrigger(@Body() trigger: TriggerCreateRo, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    let resourceId = '';
    if (trigger.input) {
      const triggerInput = this.triggerEventHelper.renderInput(trigger.input);
      resourceId = triggerInput?.datasheetId || triggerInput?.formId || '';
    }
    return this.automationTriggerRepository.createTrigger(trigger, user.userId, resourceId);
  }

  @Patch(['/:triggerId'])
  async changeTriggerTypeId(
    @Headers('cookie') cookie: string,
    @Param('triggerId') triggerId: string,
    @Body() data: { triggerTypeId?: string, input?: object }
  ) {
    const { userId } = await this.userService.getMe({ cookie });
    if (data.triggerTypeId) {
      return this.automationTriggerRepository.changeTriggerTypeId(triggerId, data.triggerTypeId, userId);
    }
    if (data.input) {
      const triggerInput = this.triggerEventHelper.renderInput(data.input);
      const resourceId = triggerInput?.datasheetId || triggerInput?.formId || '';
      return this.automationTriggerRepository.updateTriggerInput(triggerId, data.input, userId, resourceId);
    }
    return { ok: false, msg: 'nothing changed' };
  }

}
