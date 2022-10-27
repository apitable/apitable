import { Body, Controller, Headers, Param, Patch, Post } from '@nestjs/common';
import { isProdMode } from 'app.environment';
import { AutomationServiceCreateRo } from './ros/service.create.ro';
import { AutomationServiceUpdateRo } from './ros/service.update.ro';
import { AutomationService } from './services/automation.service';
import { UserService } from 'database/services/user/user.service';

@Controller('nest/v1/robots/actions')
export class RobotServiceController {
  constructor(
    private readonly automationService: AutomationService,
    private readonly userService: UserService,
  ) { }

  @Post('service')
  async createService(@Body() service: AutomationServiceCreateRo, @Headers('cookie') cookie: string) {
    if (isProdMode) {
      throw new Error('cant create service in production mode');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.createService(service, user);
  }

  @Patch('service/:serviceId')
  async updateService(
    @Param('serviceId') serviceId: string,
    @Body() data: AutomationServiceUpdateRo,
    @Headers('cookie') cookie: string
  ) {
    if (isProdMode) {
      throw new Error('cant update service in production mode');
    }
    const user = await this.userService.getMe({ cookie });
    return this.automationService.updateService(serviceId, data, user);
  }

}
