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

import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Any } from 'grpc/generated/google/protobuf/any';
import { Value } from 'grpc/generated/google/protobuf/struct';
import { SocketService } from 'grpc/generated/serving/SocketServingService';
import { lastValueFrom } from 'rxjs';
import { InjectLogger, SOCKET_GRPC_CLIENT } from 'shared/common';
import { IClientRoomChangeResult } from 'shared/services/socket/socket.interface';
import { Logger } from 'winston';

export class SocketGrpcClient implements OnModuleInit {
  private socketClient!: SocketService;

  constructor(
    // @ts-ignore
    @InjectLogger() private readonly logger: Logger,
    // @ts-ignore
    @Inject(SOCKET_GRPC_CLIENT) private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): any {
    this.socketClient = this.client.getService<SocketService>('SocketService');
  }

  /**
   * room change notification, only works for Fusion API
   * @param roomId
   * @param changesets
   */
  async nestRoomChange(roomId: string, changesets: IClientRoomChangeResult[]) {
    try {
      const data = Any.fromPartial({
        value: Value.encode(Value.wrap(changesets)).finish(),
      });
      await lastValueFrom(this.socketClient.serverRoomChange({ roomId, data }));
    } catch (e) {
      this.logger.error('Failed to notify room', { e });
    }
  }
}
