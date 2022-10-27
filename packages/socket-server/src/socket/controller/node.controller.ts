import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomGateway } from 'src/socket/gateway/room.gateway';
import { AuthGuard } from 'src/socket/guard/auth.guard';
import { HttpResponseInterceptor } from 'src/socket/interceptor/http.response.interceptor';
import { NodeShareDisableRo } from 'src/socket/model/ro/node/node.ro';
import { RoomService } from 'src/socket/service/room/room.service';

@Controller('node')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseInterceptor)
export class NodeController {
  constructor(
    private readonly roomGateway: RoomGateway,
    private readonly roomService: RoomService,
  ) {}

  @Post('/disableShare')
  async disableNodeShare(@Body() message: NodeShareDisableRo[]) {
    await this.roomService.broadcastNodeShareDisabled(this.roomGateway.server, message);
  }
}
