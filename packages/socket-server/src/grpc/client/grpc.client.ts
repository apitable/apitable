import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { VikaGrpcClientProxy } from 'grpc/client/vika.grpc.client.proxy';
import { BasicResult } from 'grpc/generated/common/Core';
import { GatewayConstants } from 'socket/constants/gateway.constants';
import { TRACE_ID } from 'socket/constants/socket-constants';
import { Any } from '../generated/google/protobuf/any';
import { Value } from '../generated/google/protobuf/struct';
import { ApiServingService, NodeBrowsingRo } from '../generated/serving/BackendServingService';
import { LeaveRoomRo, RoomServingService, UserRoomChangeRo, WatchRoomRo } from '../generated/serving/RoomServingService';

@Injectable()
export class GrpcClient implements OnModuleInit {
  // backend-server grpc service
  private backendService: ApiServingService;
  // room-server grpc service
  private roomService: RoomServingService;

  private readonly logger = new Logger(GrpcClient.name);

  constructor(
    @Inject(GatewayConstants.BACKEND_SERVICE) private readonly backendClient: ClientGrpcProxy,
    @Inject(GatewayConstants.ROOM_SERVICE) private readonly roomClient: VikaGrpcClientProxy,
  ) {}

  async onModuleInit() {
    this.backendService = await this.backendClient.getService<ApiServingService>('ApiServingService');
    this.roomService = await this.roomClient.getService<RoomServingService>('RoomServingService');
  }

  async recordNodeBrowsing(message: NodeBrowsingRo): Promise<BasicResult> {
    return await lastValueFrom(this.backendService.recordNodeBrowsing(message));
  }

  async watchRoom(message: WatchRoomRo, metadata: any): Promise<any | null> {
    this.logger.log({
      action: 'WatchRoom',
      traceId: String(metadata.get(TRACE_ID)),
      message: `WatchRoom socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.watchRoom(message, metadata));
  }

  async getActiveCollaborators(message: WatchRoomRo, metadata: any): Promise<any | null> {
    this.logger.log({
      action: 'GetActiveCollaborators',
      traceId: String(metadata.get(TRACE_ID)),
      message: `GetActiveCollaborators socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.getActiveCollaborators(message, metadata));
  }

  async leaveRoom(message: LeaveRoomRo, metadata: any): Promise<BasicResult> {
    this.logger.log({
      action: 'LeaveRoom',
      traceId: String(metadata.get(TRACE_ID)),
      message: `LeaveRoom socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.leaveRoom(message, metadata));
  }

  async roomChange(message: UserRoomChangeRo, metadata: any): Promise<any> {
    this.logger.log({
      action: 'RoomChange',
      traceId: String(metadata.get(TRACE_ID)),
      message: `RoomChange socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    if (!message.changesets?.value) {
      message.changesets = Any.fromPartial({
        value: Value.encode(Value.wrap(message.changesets)).finish(),
      });
    }
    return await lastValueFrom(this.roomService.roomChange(message, metadata));
  }
}
