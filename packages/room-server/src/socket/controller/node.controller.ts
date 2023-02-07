/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomGateway } from 'socket/gateway/room.gateway';
import { AuthGuard } from 'socket/guard/auth.guard';
import { HttpResponseInterceptor } from 'socket/interceptor/http.response.interceptor';
import { NodeShareDisableRo } from 'socket/ros/node/node.ro';
import { RoomService } from 'socket/services/room/room.service';

@Controller(['node', 'socket/node'])
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseInterceptor)
export class NodeController {
  constructor(
    private readonly roomGateway: RoomGateway,
    private readonly roomService: RoomService
  ) {}

  @Post('/disableShare')
  disableNodeShare(@Body() message: NodeShareDisableRo[]) {
    this.roomService.broadcastNodeShareDisabled(this.roomGateway.server, message);
  }
}
