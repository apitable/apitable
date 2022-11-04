import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BasicResult, ServerRoomChangeRo } from 'grpc/generated/common/Core';
import { Value } from 'grpc/generated/google/protobuf/struct';
import { protobufPackage } from 'grpc/generated/serving/SocketServingService';
import { GrpcExceptionFilter } from 'socket/filter/grpc.exception.filter';
import { RoomGateway } from 'socket/gateway/room.gateway';
import { RoomService } from 'socket/service/room/room.service';

@UseFilters(new GrpcExceptionFilter())
@Controller(protobufPackage)
export class SocketGrpcController {
  constructor(private readonly roomGateway: RoomGateway, private readonly roomService: RoomService) {}

  @GrpcMethod('SocketService', 'serverRoomChange')
  serverRoomChange(message: ServerRoomChangeRo): BasicResult {
    this.roomService.broadcastServerChange(message.roomId, Value.decode(message.data.value).listValue, this.roomGateway.server);
    return {
      success: true,
      message: 'true',
      code: 200,
    };
  }
}
