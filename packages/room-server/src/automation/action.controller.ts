import { Body, Controller, Delete, Headers, Param, Patch, Post } from '@nestjs/common';
import { ActionCreateRo } from './ros/action.create.ro';
import { AutomationActionRepository } from './repositories/automation.action.repository';
import { UserService } from 'database/services/user/user.service';

@Controller('nest/v1/robots/actions')
export class RobotActionController {
  constructor(
    private readonly automationActionRepository: AutomationActionRepository,
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
  }

  @Delete(['/:actionId'])
  async deleteRobotAction(
    @Param('actionId') actionId: string,
    @Headers('cookie') cookie: string
  ) {
    const { userId } = await this.userService.getMe({ cookie });
    return this.automationActionRepository.deleteRobotActionByActionId(actionId, userId);
  }
}
