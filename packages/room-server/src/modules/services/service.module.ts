import { Module } from '@nestjs/common';
import { FusionApiServiceModule } from '../../fusion/fusion.api.service.module';
import { DeveloperServiceModule } from './developer/developer.service.module';
import { DatasheetServiceModule } from './datasheet/datasheet.service.module';
import { UserServiceModule } from './user/user.service.module';
import { NodeServiceModule } from './node/node.service.module';
import { FormServiceModule } from './form/form.service.module';
import { UnitServiceModule } from './unit/unit.service.module';
import { ResourceServiceModule } from './resource/resource.service.module';
import { WidgetServiceModule } from 'modules/services/widget/widget.module';
import { EventServiceModule } from './event/event.service.module';
import { MirrorServiceModule } from './mirror/mirror.service.module';

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
