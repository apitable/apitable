import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomGateway } from 'src/socket/gateway/room.gateway';
import { AuthGuard } from 'src/socket/guard/auth.guard';
import { HttpResponseInterceptor } from 'src/socket/interceptor/http.response.interceptor';
import { FieldPermissionChangeRo } from 'src/socket/model/ro/datasheet/datasheet.ro';
import { RoomService } from 'src/socket/service/room/room.service';

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
