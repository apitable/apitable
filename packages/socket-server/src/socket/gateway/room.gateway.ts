import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { RequestTypes } from '../enum/request-types.enum';
import { HttpExceptionFilter } from '../filter/http-exception.filter';
import { GatewayConstants } from '../constants/gateway.constants';
import { Socket } from 'socket.io';
import { ExecuteTimeInterceptor } from '../interceptor/execute-time.interceptor';
import { RoomService } from 'src/socket/service/room/room.service';

/**
 * <p>
 * ROOM 长连接入口
 * </p>
 * @author Chambers
 * @date 2020/12/10
 */
@UseFilters(HttpExceptionFilter)
@WebSocketGateway(GatewayConstants.ROOM_PORT, {
  path: GatewayConstants.ROOM_PATH,
  namespace: GatewayConstants.ROOM_NAMESPACE,
  pingTimeout: GatewayConstants.PING_TIMEOUT,
  })
export class RoomGateway {
  constructor(
    private readonly roomService: RoomService,
  ) {
  }

  // 当前命名空间socket.io的Server对象,以后在controller注入访问
  @WebSocketServer() server;

  @SubscribeMessage(RequestTypes.WATCH_ROOM)
  async watchRoom(@MessageBody() message: any, @ConnectedSocket() client: Socket): Promise<any | null> {
    return await this.roomService.watchRoom(message, client, this.server);
  }

  @SubscribeMessage(RequestTypes.LEAVE_ROOM)
  async leaveRoom(@MessageBody() message: any, @ConnectedSocket() client: Socket): Promise<boolean> {
    return await this.roomService.leaveRoom(message, client);
  }

  @UseInterceptors(ExecuteTimeInterceptor)
  @SubscribeMessage(RequestTypes.CLIENT_ROOM_CHANGE)
  async roomChange(@MessageBody() message: any, @ConnectedSocket() client: Socket): Promise<any> {
    return await this.roomService.roomChange(message, client);
  }

  @SubscribeMessage(RequestTypes.ENGAGEMENT_CURSOR)
  moveCursor(@MessageBody() message: any, @ConnectedSocket() client: Socket): boolean {
    this.roomService.moveCursor(message, client);
    return true;
  }

  /**
   *
   * nest-server 的fusionApi触发
   *
   * @param message
   * @param client
   * @return
   * @author Zoe Zheng
   * @date 2020/7/4 7:03 下午
   */
  @SubscribeMessage(RequestTypes.NEST_ROOM_CHANGE)
  newChange(@MessageBody() message: any, @ConnectedSocket() client: Socket): boolean {
    this.roomService.broadcastServerChange(message.roomId, message.data, client);
    return true;
  }
}
