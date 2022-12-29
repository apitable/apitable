import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { isProdMode } from 'app.environment';
import { TriggerTypeCreateRo } from './ros/trigger.type.create.ro';
import { TriggerTypeUpdateRo } from './ros/trigger.type.update.ro';
import { AutomationRobotRepository } from './repositories/automation.robot.repository';
import { AutomationService } from './services/automation.service';
import { UserService } from 'database/services/user/user.service';

@Controller('nest/v1/robots/trigger-types')
export class RobotTriggerTypeController {
  constructor(
    private readonly automationRobotRepository: AutomationRobotRepository,
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
