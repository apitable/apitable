import { UseFilters } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NodeBrowsedRo } from 'src/socket/model/ro/notification/node.browsed.ro';
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
