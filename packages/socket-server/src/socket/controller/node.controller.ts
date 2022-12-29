import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomGateway } from 'socket/gateway/room.gateway';
import { AuthGuard } from 'socket/guard/auth.guard';
import { HttpResponseInterceptor } from 'socket/interceptor/http.response.interceptor';
import { NodeShareDisableRo } from 'socket/model/ro/node/node.ro';
import { RoomService } from 'socket/service/room/room.service';

@Controller('node')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseInterceptor)
export class NodeController {
  constructor(private readonly roomGateway: RoomGateway, private readonly roomService: RoomService) {}

  @Post('/disableShare')
  disableNodeShare(@Body() message: NodeShareDisableRo[]) {
    this.roomService.broadcastNodeShareDisabled(this.roomGateway.server, message);
  }
}
