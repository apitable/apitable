import { Global, Module } from '@nestjs/common';
import { ClientStorage } from 'shared/services/socket/client.storage';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { OtModule } from '../../../datasheet/_modules/ot.module';
import { RoomResourceRelService } from './room.resource.rel.service';
import { UserServiceModule } from '../../../datasheet/_modules/user.service.module';
import { ResourceServiceModule } from '../../../datasheet/_modules/resource.service.module';
import { NodeServiceModule } from '../../../datasheet/_modules/node.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from '../../../datasheet/repositories/datasheet.repository';
import { WidgetRepository } from '../../../datasheet/repositories/widget.repository';
import { ResourceMetaRepository } from '../../../datasheet/repositories/resource.meta.repository';
import { DatasheetServiceModule } from '../../../datasheet/_modules/datasheet.service.module';

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
