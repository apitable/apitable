import { Body, Controller, Headers, Param, Patch, Post } from '@nestjs/common';
import { TriggerCreateRo } from './ros/trigger.create.ro';
import { AutomationTriggerRepository } from './repositories/automation.trigger.repository';
import { UserService } from 'datasheet/services/user/user.service';

@Controller('nest/v1/robots/triggers')
export class RobotTriggerController {
  constructor(
    private readonly automationTriggerRepository: AutomationTriggerRepository,
    private readonly userService: UserService,
  ) { }

  @Post(['/'])
  async createTrigger(@Body() trigger: TriggerCreateRo, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    return this.automationTriggerRepository.createTrigger(trigger, user.userId);
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
      return this.automationTriggerRepository.updateTriggerInput(triggerId, data.input, userId);
    }
  }

}
