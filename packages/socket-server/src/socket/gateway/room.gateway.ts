import { UseFilters, UseInterceptors } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomService } from 'socket/service/room/room.service';
import { GatewayConstants } from '../constants/gateway.constants';
import { RequestTypes } from '../enum/request-types.enum';
import { HttpExceptionFilter } from '../filter/http-exception.filter';
import { ExecuteTimeInterceptor } from '../interceptor/execute-time.interceptor';

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

  /*
   * The Server object of the current namespace socket.io will be injected into the controller later
   */
  @WebSocketServer() server;

  @SubscribeMessage(RequestTypes.WATCH_ROOM)
  async watchRoom(@MessageBody() message: any, @ConnectedSocket() client: Socket): Promise<any | null> {
    return await this.roomService.watchRoom(message, client, this.server);
  }

  @SubscribeMessage(RequestTypes.LEAVE_ROOM)
  leaveRoom(@MessageBody() message: any, @ConnectedSocket() client: Socket): boolean {
    this.roomService.leaveRoom(message, client);
    return true;
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
   * nest-server `fusion api` triggers
   *
   * @param message
   * @param client
   */
  @SubscribeMessage(RequestTypes.NEST_ROOM_CHANGE)
  newChange(@MessageBody() message: any, @ConnectedSocket() client: Socket): boolean {
    this.roomService.broadcastServerChange(message.roomId, message.data, client);
    return true;
  }
}
