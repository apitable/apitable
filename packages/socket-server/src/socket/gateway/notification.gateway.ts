import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { NodeBrowsedRo } from 'src/socket/model/ro/notification/node.browsed.ro';
import { NotificationTypes } from '../enum/request-types.enum';
import { NotificationRo } from '../model/ro/notification/notification.ro';
import { NotificationService } from '../service/notification/notification.service';
import { HttpExceptionFilter } from '../filter/http-exception.filter';
import { GatewayConstants } from '../constants/gateway.constants';
import { AuthenticatedSocket } from '../interface/socket/authenticated-socket.interface';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { WatchSpaceRo } from '../model/ro/notification/watch-space.ro';
import { NodeChangeRo } from '../model/ro/notification/node-change.ro';

/**
 * <p>
 * 通知路由
 * </p>
 * @author Zoe Zheng
 * @date 2020/5/9 2:48 下午
 */
@WebSocketGateway(GatewayConstants.NOTIFICATION_PORT, { path: GatewayConstants.NOTIFICATION_PATH, pingTimeout: GatewayConstants.PING_TIMEOUT })
export class NotificationGateway {
  constructor(private readonly notificationService: NotificationService) {}

  // 当前命名空间socket.io的Server对象,以后在controller注入访问
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

  /**
   * 监听空间站内消息
   *
   * @param message
   * @param client
   * @return  Promise<boolean>
   * @author Zoe Zheng
   * @date 2020/7/6 4:24 下午
   */
  @SubscribeMessage(NotificationTypes.WATCH_SPACE)
  watchSpace(@MessageBody() message: WatchSpaceRo, @ConnectedSocket() client: AuthenticatedSocket): boolean {
    return this.notificationService.watchSpace(message, client);
  }

  /**
   * 节点发生变化通知
   *
   * @param message
   * @param client
   * @return
   * @author Zoe Zheng
   * @date 2020/7/7 10:19 上午
   */
  @SubscribeMessage(NotificationTypes.NODE_CHANGE)
  nodeChange(@MessageBody() message: NodeChangeRo, @ConnectedSocket() client: AuthenticatedSocket): boolean {
    return this.notificationService.nodeChange(message, client);
  }

  @SubscribeMessage(NotificationTypes.NODE_BROWSED)
  async nodeBrowsed(@MessageBody() message: NodeBrowsedRo, @ConnectedSocket() client: AuthenticatedSocket): Promise<boolean> {
    return await this.notificationService.nodeBrowsed(message.nodeId, client.auth.userId);
  }
}
