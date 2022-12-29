import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomGateway } from 'socket/gateway/room.gateway';
import { AuthGuard } from 'socket/guard/auth.guard';
import { HttpResponseInterceptor } from 'socket/interceptor/http.response.interceptor';
import { FieldPermissionChangeRo } from 'socket/model/ro/datasheet/datasheet.ro';
import { RoomService } from 'socket/service/room/room.service';

@Controller('datasheet')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseInterceptor)
export class DatasheetController {
  constructor(
    private readonly roomGateway: RoomGateway,
    private readonly roomService: RoomService,
  ) {}

  @Post('/field/permission/change')
  async fieldPermissionChange(@Body() message: FieldPermissionChangeRo) {
    await this.roomService.broadcastFieldPermissionChange(this.roomGateway.server, message);
  }
}
