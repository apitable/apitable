import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { RobotCreateRo } from './ros/robot.create.ro';
import { AutomationRobotRepository } from './repositories/automation.robot.repository';
import { AutomationService } from './services/automation.service';
import { UserService } from 'datasheet/services/user/user.service';

@Controller('nest/v1/robots')
export class RobotController {
  constructor(
    private readonly automationRobotRepository: AutomationRobotRepository,
    private readonly automationService: AutomationService,
    private readonly userService: UserService,
  ) { }

  @Get(['/'])
  getRobotListByResourceId(@Query('resourceId') resourceId: string) {
    return this.automationRobotRepository.getRobotListByResourceId(resourceId);
  }

  @Post(['/'])
  async createRobot(@Body() robot: RobotCreateRo, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    await this.automationService.checkCreateRobotPermission(robot.resourceId);
    return this.automationRobotRepository.createRobot(robot, user.userId);
  }

  @Get(['/:robotId'])
  getDatePack(@Param('robotId') robotId: string,) {
    return this.automationRobotRepository.getRobotDetailById(robotId);
  }

  @Delete(['/:robotId'])
  async deleteRobot(@Param('robotId') robotId: string, @Headers('cookie') cookie: string) {
    const { userId } = await this.userService.getMe({ cookie });
    return this.automationRobotRepository.deleteRobot(robotId, userId);
  }

  @Patch(['/:robotId'])
  async updateRobot(
    @Param('robotId') robotId: string,
    @Body() robot: { name?: string, description?: string },
    @Headers('cookie') cookie: string
  ) {
    const { userId } = await this.userService.getMe({ cookie });
    const { name, description } = robot;
    if (name) {
      return this.automationRobotRepository.updateRobot(robotId, { name }, userId);
    }
    if (description) {
      return this.automationRobotRepository.updateRobot(robotId, { description }, userId);
    }
  }

  @Get('/:robotId/base-info')
  getRobotBaseInfo(@Param('robotId') robotId: string) {
    return this.automationRobotRepository.getRobotBaseInfoByIds([robotId]);
  }

  @Get(['/:robotId/trigger'])
  getRobotTrigger(@Param('robotId') robotId: string) {
    return this.automationRobotRepository.getRobotTriggerById(robotId);
  }

  @Get(['/:robotId/actions'])
  getRobotActions(@Param('robotId') robotId: string) {
    return this.automationRobotRepository.getRobotActionsById(robotId);
  }

  @Post(['/:robotId/active'])
  async activeRobot(@Param('robotId') robotId: string, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    return this.automationService.activeRobot(robotId, user);
  }

  @Post(['/:robotId/deactive'])
  async deActiveRobot(@Param('robotId') robotId: string, @Headers('cookie') cookie: string) {
    const user = await this.userService.getMe({ cookie });
    return this.automationRobotRepository.deActiveRobot(robotId, user.userId);
  }
}
