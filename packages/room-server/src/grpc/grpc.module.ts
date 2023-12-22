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

import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import { GrpcClientModule } from 'grpc/client/grpc.client.module';
import { GrpcSocketService } from 'grpc/services/grpc.socket.service';
import { NodeModule } from 'node/node.module';
import { UserModule } from 'user/user.module';
import { GrpcController } from './controllers/grpc.controller';
import { DocumentServiceDynamicModule } from 'workdoc/services/document.service.dynamic.module';

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    UserModule,
    forwardRef(() => NodeModule),
    GrpcClientModule,
    DocumentServiceDynamicModule.forRoot(),
  ],
  controllers: [GrpcController],
  providers: [
    GrpcSocketService,
  ],
  exports: [
    GrpcSocketService,
    GrpcClientModule,
  ],
})
export class GrpcModule {
}

