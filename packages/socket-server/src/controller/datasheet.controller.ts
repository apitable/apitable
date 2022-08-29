import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomGateway } from 'src/gateway/room.gateway';
import { AuthGuard } from 'src/guard/auth.guard';
import { HttpResponseInterceptor } from 'src/interceptor/http.response.interceptor';
import { FieldPermissionChangeRo } from 'src/model/ro/datasheet/datasheet.ro';
import { RoomService } from 'src/service/room/room.service';

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
