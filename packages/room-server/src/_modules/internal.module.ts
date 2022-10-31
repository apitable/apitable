import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard.modules';
import { DatabaseModule } from '../database/database.module';
import { RobotModule } from '../automation/robot.module';
import { GrpcController } from 'database/controllers/grpc.controller';
import { OtModule } from './ot.module';
import { GrpcServiceModule } from 'shared/services/grpc/grpc.service.module';
import { NodeServiceModule } from './node.service.module';
import { FormController } from 'database/controllers/form.controller';
import { FormService } from 'database/services/form/form.service';
import { UserServiceModule } from './user.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceMetaRepository } from '../database/repositories/resource.meta.repository';
import { CommandServiceModule } from './command.service.module';
import { DatasheetServiceModule } from './datasheet.service.module';
import { EventServiceModule } from './event.service.module';
import { FusionApiServiceModule } from './fusion.api.service.module';
import { MirrorController } from 'database/controllers/mirror.controller';
import { ResourceController } from 'database/controllers/resource.controller';
import { ResourceServiceModule } from './resource.service.module';
import { MirrorService } from 'database/services/mirror/mirror.service';

@Module({
  imports: [
  DatabaseModule, DashboardModule, RobotModule, OtModule, GrpcServiceModule, NodeServiceModule,
  UserServiceModule, 
  NodeServiceModule, 
  TypeOrmModule.forFeature([ResourceMetaRepository]),
  DatasheetServiceModule,
  CommandServiceModule,
  OtModule,
  FusionApiServiceModule,
  EventServiceModule,
  ResourceServiceModule,
  ],
  controllers: [GrpcController, FormController, MirrorController, ResourceController],
  providers: [FormService, MirrorService, ],
  exports: [DatabaseModule, DashboardModule, RobotModule],
  })
export class InternalModule {}
