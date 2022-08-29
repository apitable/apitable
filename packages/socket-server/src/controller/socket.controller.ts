import { Body, Controller, Post } from '@nestjs/common';
import { NestService } from '../service/nest/nest.service';
import { SocketRo } from '../model/ro/socket.ro';

@Controller()
export class SocketController {
  constructor(private readonly nestService: NestService) {}

  @Post('notify')
  async notify(@Body() message: SocketRo) {
    return this.nestService.handleHttpNotify(message);
  }
}
