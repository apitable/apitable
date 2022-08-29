import { Global, Module } from '@nestjs/common';
import { ClientStorage } from 'modules/socket/client.storage';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { OtModule } from '../ot/ot.module';
import { RoomResourceRelService } from './room.resource.rel.service';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { ResourceServiceModule } from 'modules/services/resource/resource.service.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from 'modules/repository/datasheet.repository';
import { WidgetRepository } from 'modules/repository/widget.repository';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';

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
