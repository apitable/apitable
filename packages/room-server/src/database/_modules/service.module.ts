import { Module } from '@nestjs/common';
import { FusionApiServiceModule } from '../../fusion/fusion.api.service.module';
import { DeveloperServiceModule } from './developer.service.module';
import { DatasheetServiceModule } from './datasheet.service.module';
import { UserServiceModule } from './user.service.module';
import { NodeServiceModule } from './node.service.module';
import { FormServiceModule } from './form.service.module';
import { UnitServiceModule } from './unit.service.module';
import { ResourceServiceModule } from './resource.service.module';
import { WidgetServiceModule } from 'database/_modules/widget.module';
import { EventServiceModule } from './event.service.module';
import { MirrorServiceModule } from './mirror.service.module';

/**
 * 业务服务模块整合
 */
@Module({
  imports: [
    DatasheetServiceModule,
    FusionApiServiceModule,
    DeveloperServiceModule,
    UserServiceModule,
    NodeServiceModule,
    UnitServiceModule,
    FormServiceModule,
    ResourceServiceModule,
    WidgetServiceModule,
    MirrorServiceModule,
    EventServiceModule,
    EventServiceModule
  ],
  exports: [
    DatasheetServiceModule,
    FusionApiServiceModule,
    DeveloperServiceModule,
    UserServiceModule,
    NodeServiceModule,
    UnitServiceModule,
    FormServiceModule,
    ResourceServiceModule,
    WidgetServiceModule,
    MirrorServiceModule,
    EventServiceModule,
    MirrorServiceModule,
  ],
})
export class ServiceModule {
}
