import { Module } from '@nestjs/common';
import { DatasheetWidgetRepository } from 'modules/repository/datasheet.widget.repository';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';
import { RestModule } from 'modules/rest/rest.module';
import { OtService } from './ot.service';
import { DatasheetServiceModule } from '../services/datasheet/datasheet.service.module';
import { NodeServiceModule } from '../services/node/node.service.module';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { WidgetServiceModule } from 'modules/services/widget/widget.module';
import { ResourceServiceModule } from 'modules/services/resource/resource.service.module';
import { DashboardServiceModule } from 'modules/services/dashboard/dashboard.module';
import { ResourceChangeHandler } from './resource.change.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetOtService } from './widget.ot.service';
import { MirrorServiceModule } from 'modules/services/mirror/mirror.service.module';
import { FormOtService } from './form.ot.service';
import { EventServiceModule } from 'modules/services/event/event.service.module';
import { DatasheetOtService } from './datasheet.ot.service';
import { DashboardOtService } from './dashboard.ot.service';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { MirrorOtService } from 'modules/ot/mirror.ot.service';

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
