import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomGateway } from 'src/gateway/room.gateway';
import { AuthGuard } from 'src/guard/auth.guard';
import { HttpResponseInterceptor } from 'src/interceptor/http.response.interceptor';
import { NodeShareDisableRo } from 'src/model/ro/node/node.ro';
import { RoomService } from 'src/service/room/room.service';

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
