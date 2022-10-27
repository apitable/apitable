import { Module } from '@nestjs/common';
import { DatasheetWidgetRepository } from '../repositories/datasheet.widget.repository';
import { ResourceMetaRepository } from '../repositories/resource.meta.repository';
import { RestModule } from 'shared/services/rest/rest.module';
import { OtService } from '../services/ot/ot.service';
import { DatasheetServiceModule } from './datasheet.service.module';
import { NodeServiceModule } from './node.service.module';
import { UserServiceModule } from './user.service.module';
import { WidgetServiceModule } from './widget.module';
import { ResourceServiceModule } from 'database/_modules/resource.service.module';
import { DashboardServiceModule } from './dashboard.module';
import { ResourceChangeHandler } from '../services/ot/resource.change.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetOtService } from '../services/ot/widget.ot.service';
import { MirrorServiceModule } from './mirror.service.module';
import { FormOtService } from '../services/ot/form.ot.service';
import { EventServiceModule } from './event.service.module';
import { DatasheetOtService } from '../services/ot/datasheet.ot.service';
import { DashboardOtService } from '../services/ot/dashboard.ot.service';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { MirrorOtService } from 'database/services/ot/mirror.ot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceMetaRepository, DatasheetWidgetRepository]),
    DatasheetServiceModule,
    NodeServiceModule,
    UserServiceModule,
    WidgetServiceModule,
    ResourceServiceModule,
    DashboardServiceModule,
    MirrorServiceModule,
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
  ],
  exports: [OtService],
})
export class OtModule {}
