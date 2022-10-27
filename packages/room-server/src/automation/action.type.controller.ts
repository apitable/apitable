import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { isProdMode } from 'app.environment';
import { ActionTypeCreateRo } from './ros/action.type.create.ro';
import { TriggerTypeUpdateRo } from './ros/trigger.type.update.ro';
import { AutomationRobotRepository } from './repositories/automation.robot.repository';
import { AutomationService } from './services/automation.service';
import { UserService } from 'datasheet/services/user/user.service';

@Controller('nest/v1/robots/action-types')
export class RobotActionTypeController {
  constructor(
    private readonly automationRobotRepository: AutomationRobotRepository,
    private readonly automationService: AutomationService,
    private readonly userService: UserService,
  ) { }

  @Get(['/'])
  getActionTypes(@Query('lang') lang: string) {
    const language = (!lang || lang.includes('zh')) ? 'zh' : 'en';
    return this.automationService.getActionType(language);
  }

  @Post('/')
  // 创建 actionType
  async createActionType(@Body() actionType: ActionTypeCreateRo, @Headers('cookie') cookie: string) {
    if (isProdMode) {
      throw new Error('生产环境不支持此接口');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.createActionType(actionType, user);
  }

  @Patch('/:actionTypeId')
  async updateActionType(
    @Param('actionTypeId') actionTypeId: string,
    @Body() data: TriggerTypeUpdateRo,
    @Headers('cookie') cookie: string
  ) {
    if (isProdMode) {
      throw new Error('生产环境不支持此接口');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.updateActionType(actionTypeId, data, user);
  }
}
