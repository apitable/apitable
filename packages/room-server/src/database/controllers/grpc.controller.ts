import { ResourceIdPrefix } from '@apitable/core';
import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { NodeService } from 'database/services/node/node.service';
import { IRoomChannelMessage } from 'database/services/ot/ot.interface';
import { OtService } from 'database/services/ot/ot.service';
import { ApiResponse } from 'fusion/vos/api.response';
import { Any } from 'grpc/generated/google/protobuf/any';
import { Value } from 'grpc/generated/google/protobuf/struct';
import {
  GetActiveCollaboratorsVo,
  protobufPackage,
  UserRoomChangeRo,
  UserRoomChangeVo,
  WatchRoomRo,
  WatchRoomVo,
} from 'grpc/generated/serving/RoomServingService';
import { InjectLogger } from 'shared/common';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { GrpcExceptionFilter } from 'shared/filters/grpc.exception.filter';
import { TracingHandlerInterceptor } from 'shared/interceptor/sentry.handlers.interceptor';
import { GrpcSocketService } from 'shared/services/grpc/grpc.socket.service';
import { Logger } from 'winston';
import { ILeaveRoomRo, INodeCopyRo, INodeDeleteRo } from '../interfaces/grpc.interface';

/**
 * grpc works for internal service
 */
@UseFilters(new GrpcExceptionFilter())
@UseInterceptors(new TracingHandlerInterceptor())
@Controller(protobufPackage)
export class GrpcController {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly otService: OtService,
    private readonly nodeService: NodeService,
    private readonly grpcSocketService: GrpcSocketService,
  ) {}

  @GrpcMethod('RoomServingService', 'copyNodeEffectOt')
  async copyNodeEffectOt(data: INodeCopyRo): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.otService.copyNodeEffectOt(data);
      return ApiResponse.success(result);
    } catch (error) {
      this.logger.error('Failed to copy node', { stack: error?.stack, message: error?.message });
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RoomServingService', 'DeleteNodeEffectOt')
  async deleteNodeEffectOt(data: INodeDeleteRo): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.otService.deleteNodeEffectOt(data);
      return ApiResponse.success(result);
    } catch (error) {
      this.logger.error('Failed to delete node', { stack: error?.stack, message: error?.message });
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RoomServingService', 'watchRoom')
  async watchRoom(data: WatchRoomRo, metadata: any): Promise<WatchRoomVo> {
    try {
      const result = await this.grpcSocketService.watchRoom(data as any, data.clientId || '', data.socketIds || [], metadata);
      return ApiResponse.success(result);
    } catch (error) {
      return this.grpcSocketService.errorCatch(error, data);
    }
  }

  @GrpcMethod('RoomServingService', 'getActiveCollaborators')
  async getActiveCollaborators(data: WatchRoomRo): Promise<GetActiveCollaboratorsVo> {
    try {
      const result = await this.grpcSocketService.getActiveCollaborators(data as any, data.spaceId || '', data.socketIds || []);
      return ApiResponse.success(result);
    } catch (error) {
      return this.grpcSocketService.errorCatch(error, data);
    }
  }

  @GrpcMethod('RoomServingService', 'leaveRoom')
  async leaveRoom(data: ILeaveRoomRo): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.grpcSocketService.leaveRoom(data.clientId);
      if (result) {
        return ApiResponse.success(true);
      }
      return ApiResponse.success(false);
    } catch (error) {
      this.logger.error('leaveRoom', { stack: error?.stack, message: error?.message });
      throw new RpcException(error);
    }
  }

  @GrpcMethod('RoomServingService', 'roomChange')
  async userRoomChange(message: UserRoomChangeRo): Promise<UserRoomChangeVo> {
    try {
      let data: IRoomChannelMessage = {
        shareId: message.shareId,
        roomId: message.roomId || '',
        changesets: Value.decode(message.changesets.value).listValue,
      };
      if (message.roomId?.startsWith(ResourceIdPrefix.Mirror)) {
        const sourceDatasheetId = await this.nodeService.getMainNodeId(message.roomId);
        data = { sourceDatasheetId, sourceType: SourceTypeEnum.MIRROR, ...data };
      }
      const result = await this.grpcSocketService.roomChange(data, { cookie: message.cookie });
      const resultStream = Any.fromPartial({
        value: Value.encode(Value.wrap(result)).finish(),
      });
      return ApiResponse.success(resultStream);
    } catch (error) {
      return this.grpcSocketService.errorCatch(error, message);
    }
  }
}
