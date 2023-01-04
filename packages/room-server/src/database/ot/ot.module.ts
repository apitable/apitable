import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmDynamicModule } from 'database/alarm/alarm.dynamic.module';
import { DashboardModule } from 'database/dashboard/dashboard.module';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { DatasheetWidgetRepository } from 'database/datasheet/repositories/datasheet.widget.repository';
import { EventModule } from 'database/event/event.module';
import { FormModule } from 'database/form/form.module';
import { MirrorModule } from 'database/mirror/mirror.module';
import { NodeModule } from 'database/node/node.module';
import { ResourceModule } from 'database/resource/resource.module';
import { SubscriptionDynamicModule } from 'database/subscription/subscription.dynamic.module';
import { UserModule } from 'database/user/user.module';
import { WidgetModule } from 'database/widget/widget.module';
import { GrpcModule } from 'grpc/grpc.module';
import { DashboardOtService } from './services/dashboard.ot.service';
import { DatasheetOtService } from './services/datasheet.ot.service';
import { FormOtService } from './services/form.ot.service';
import { MirrorOtService } from './services/mirror.ot.service';
import { OtService } from './services/ot.service';
import { ResourceChangeHandler } from './services/resource.change.handler';
import { WidgetOtService } from './services/widget.ot.service';

@Module({
  imports: [
    GrpcModule,
    NodeModule, 
    DatasheetModule, 
    ResourceModule, 
    WidgetModule, 
    forwardRef(()=>FormModule), 
    MirrorModule, 
    EventModule,
    DashboardModule, 
    UserModule,
    AlarmDynamicModule.forRoot(),
    SubscriptionDynamicModule.forRoot(),
    TypeOrmModule.forFeature([
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      DatasheetWidgetRepository,
    ]),
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
  exports: [
    OtService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
  ]
})
export class OtModule {}
