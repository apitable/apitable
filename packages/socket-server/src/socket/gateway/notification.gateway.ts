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

import { UseFilters } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NodeBrowsedRo } from 'socket/model/ro/notification/node.browsed.ro';
import { GatewayConstants } from '../constants/gateway.constants';
import { NotificationTypes } from '../enum/request-types.enum';
import { HttpExceptionFilter } from '../filter/http-exception.filter';
import { AuthenticatedSocket } from '../interface/socket/authenticated-socket.interface';
import { NodeChangeRo } from '../model/ro/notification/node-change.ro';
import { NotificationRo } from '../model/ro/notification/notification.ro';
import { WatchSpaceRo } from '../model/ro/notification/watch-space.ro';
import { NotificationService } from '../service/notification/notification.service';

@WebSocketGateway(GatewayConstants.NOTIFICATION_PORT, { path: GatewayConstants.NOTIFICATION_PATH, pingTimeout: GatewayConstants.PING_TIMEOUT })
export class NotificationGateway {
  constructor(private readonly notificationService: NotificationService) {}

  /*
   * The Server object of the current namespace socket.io will be injected into the controller later
   */
  @WebSocketServer() server;

  @UseFilters(HttpExceptionFilter)
  @SubscribeMessage(NotificationTypes.NOTIFY)
  playerNotify(@MessageBody() message: NotificationRo, @ConnectedSocket() client: AuthenticatedSocket): boolean {
    if (isNil(client.auth.userId)) {
      return false;
    }
    message.event = NotificationTypes.NOTIFY;
    message.socketId = client.id;
    return this.notificationService.broadcastNotify(message, client);
  }

  @SubscribeMessage(NotificationTypes.WATCH_SPACE)
  watchSpace(@MessageBody() message: WatchSpaceRo, @ConnectedSocket() client: AuthenticatedSocket): boolean {
    return this.notificationService.watchSpace(message, client);
  }

  @SubscribeMessage(NotificationTypes.NODE_CHANGE)
  nodeChange(@MessageBody() message: NodeChangeRo, @ConnectedSocket() client: AuthenticatedSocket): boolean {
    return this.notificationService.nodeChange(message, client);
  }

  @SubscribeMessage(NotificationTypes.NODE_BROWSED)
  async nodeBrowsed(@MessageBody() message: NodeBrowsedRo, @ConnectedSocket() client: AuthenticatedSocket): Promise<boolean> {
    return await this.notificationService.nodeBrowsed(message.nodeId, client.auth.userId);
  }
}
