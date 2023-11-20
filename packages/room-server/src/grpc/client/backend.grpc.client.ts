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
import { BasicResult } from 'grpc/generated/common/Core';
import { ApiServingService, DocumentOperateRo, NodeBrowsingRo } from 'grpc/generated/serving/BackendServingService';
import { lastValueFrom } from 'rxjs';
import { BACKEND_GRPC_CLIENT } from 'shared/common';

export class BackendGrpcClient implements OnModuleInit {
  private backendService!: ApiServingService;

  constructor(
    // @ts-ignore
    @Inject(BACKEND_GRPC_CLIENT) private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): any {
    this.backendService = this.client.getService<ApiServingService>('ApiServingService');
  }

  async recordNodeBrowsing(message: NodeBrowsingRo): Promise<BasicResult> {
    return await lastValueFrom(this.backendService.recordNodeBrowsing(message));
  }

  async documentOperate(message: DocumentOperateRo): Promise<BasicResult> {
    return await lastValueFrom(this.backendService.documentOperate(message));
  }
}
