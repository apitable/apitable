import { Module } from '@nestjs/common';
import { DatasheetWidgetRepository } from '../database/repositories/datasheet.widget.repository';
import { ResourceMetaRepository } from '../database/repositories/resource.meta.repository';
import { RestModule } from './rest.module';
import { OtService } from '../database/services/ot/ot.service';
import { DatasheetServiceModule } from './datasheet.service.module';
import { NodeServiceModule } from './node.service.module';
import { UserServiceModule } from './user.service.module';
import { WidgetServiceModule } from './widget.module';
import { ResourceServiceModule } from '_modules/resource.service.module';
import { DashboardServiceModule } from './dashboard.module';
import { ResourceChangeHandler } from '../database/services/ot/resource.change.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetOtService } from '../database/services/ot/widget.ot.service';
import { FormOtService } from '../database/services/ot/form.ot.service';
import { EventServiceModule } from './event.service.module';
import { DatasheetOtService } from '../database/services/ot/datasheet.ot.service';
import { DashboardOtService } from '../database/services/ot/dashboard.ot.service';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { MirrorOtService } from 'database/services/ot/mirror.ot.service';
import { MirrorService } from 'database/services/mirror/mirror.service';

@Module({
  imports: [
  TypeOrmModule.forFeature([ResourceMetaRepository, DatasheetWidgetRepository]),
  DatasheetServiceModule,
  NodeServiceModule,
  UserServiceModule,
  WidgetServiceModule,
  ResourceServiceModule,
  DashboardServiceModule,
  EventServiceModule,
  RestModule,
  GrpcClientModule,
  ],
  providers: [
  OtService,
  DatasheetOtService,
  DashboardOtService,
  MirrorOtService,
  FormOtService,
  WidgetOtService,
  ResourceChangeHandler,
  MirrorService,
  ],
  exports: [OtService],
  })
export class OtModule {}
