import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { isProdMode } from 'app.environment';
import { TriggerTypeCreateRo } from 'model/ro/automation/trigger.type.create.ro';
import { TriggerTypeUpdateRo } from 'model/ro/automation/trigger.type.update.ro';
import { AutomationRobotRepository } from 'modules/repository/automation.robot.repository';
import { AutomationService } from 'modules/services/automation/automation.service';
import { UserService } from 'modules/services/user/user.service';

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
  // 创建 triggerType
  async createTriggerType(@Body() triggerType: TriggerTypeCreateRo, @Headers('cookie') cookie: string) {
    if (isProdMode) {
      throw new Error('生产环境不支持此接口');
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
      throw new Error('生产环境不支持此接口');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.updateTriggerType(triggerTypeId, data, user);
  }

}
