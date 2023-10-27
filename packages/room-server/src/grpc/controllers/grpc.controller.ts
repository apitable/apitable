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

import { ResourceIdPrefix } from '@apitable/core';
import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ILeaveRoomRo, INodeCopyRo, INodeDeleteRo } from 'database/interfaces/grpc.interface';
import { IRoomChannelMessage } from 'database/ot/interfaces/ot.interface';
import { OtService } from 'database/ot/services/ot.service';
import { ApiResponse } from 'fusion/vos/api.response';
import { Any } from 'grpc/generated/google/protobuf/any';
import { Value } from 'grpc/generated/google/protobuf/struct';
import {
  DocumentAssetStatisticResult, DocumentAssetStatisticRo,
  GetActiveCollaboratorsVo, protobufPackage, UserRoomChangeRo, UserRoomChangeVo, WatchRoomRo, WatchRoomVo,
} from 'grpc/generated/serving/RoomServingService';
import { GrpcSocketService } from 'grpc/services/grpc.socket.service';
import { NodeService } from 'node/services/node.service';
import { InjectLogger } from 'shared/common';
import { SpanAddTag } from 'shared/decorator/tracing.extend.decorator';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { GrpcExceptionFilter } from 'shared/filters/grpc.exception.filter';
import { Logger } from 'winston';
import { DocumentBaseService } from 'workdoc/services/document.base.service';

/**
 * grpc works for internal service
 */
@UseFilters(new GrpcExceptionFilter())
@Controller(protobufPackage)
export class GrpcController {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly otService: OtService,
    private readonly nodeService: NodeService,
    private readonly grpcSocketService: GrpcSocketService,
    private readonly documentBaseService: DocumentBaseService,
  ) {}

  @GrpcMethod('RoomServingService', 'documentAssetStatistic')
  async documentAssetStatistic(ro: DocumentAssetStatisticRo): Promise<DocumentAssetStatisticResult> {
    const data = await this.documentBaseService.documentAssetStatistic(ro);
    return ApiResponse.success(data);
  }

  @GrpcMethod('RoomServingService', 'copyNodeEffectOt')
  async copyNodeEffectOt(data: INodeCopyRo): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.otService.copyNodeEffectOt(data);
      return ApiResponse.success(result);
    } catch (error) {
      this.throwRpcException('Failed to copy node', error as Error);
    }
  }

  @GrpcMethod('RoomServingService', 'DeleteNodeEffectOt')
  async deleteNodeEffectOt(data: INodeDeleteRo): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.otService.deleteNodeEffectOt(data);
      return ApiResponse.success(result);
    } catch (error) {
      this.throwRpcException('Failed to delete node', error as Error);
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
      const result = await this.grpcSocketService.getActiveCollaborators(data.spaceId || '', data.socketIds || []);
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
      this.throwRpcException('leaveRoom', error as Error);
    }
  }

  @GrpcMethod('RoomServingService', 'roomChange')
  @SpanAddTag([
    (args: any[]) => args[1].toJSON(),
  ])
  async userRoomChange(message: UserRoomChangeRo): Promise<UserRoomChangeVo> {
    try {
      let data: IRoomChannelMessage = {
        shareId: message.shareId,
        roomId: message.roomId || '',
        changesets: Value.decode(message.changesets!.value).listValue!,
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

  private throwRpcException(message: string, error: Error): never {
    this.logger.error(message, { stack: error?.stack, message: error?.message });
    throw new RpcException(error);
  }
}
