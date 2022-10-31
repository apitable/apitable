import { Global, Module } from '@nestjs/common';
import { ClientStorage } from 'shared/services/socket/client.storage';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { OtModule } from './ot.module';
import { RoomResourceRelService } from '../shared/services/socket/room.resource.rel.service';
import { UserServiceModule } from './user.service.module';
import { ResourceServiceModule } from './resource.service.module';
import { NodeServiceModule } from './node.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from '../database/repositories/datasheet.repository';
import { WidgetRepository } from '../database/repositories/widget.repository';
import { ResourceMetaRepository } from '../database/repositories/resource.meta.repository';
import { DatasheetServiceModule } from './datasheet.service.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([DatasheetRepository, ResourceMetaRepository, WidgetRepository]),
    OtModule,
    UserServiceModule,
    ResourceServiceModule,
    NodeServiceModule,
    DatasheetServiceModule,
    GrpcClientModule
  ],
  providers: [RoomResourceRelService, ClientStorage],
  exports: [RoomResourceRelService, ClientStorage],
})
export class SocketModule {}
