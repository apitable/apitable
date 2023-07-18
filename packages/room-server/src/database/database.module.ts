/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Module } from '@nestjs/common';
import { AlarmDynamicModule } from './alarm/alarm.dynamic.module';
import { SubscriptionDynamicModule } from './subscription/subscription.dynamic.module';
import { AttachmentModule } from './attachment/attachment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatasheetModule } from './datasheet/datasheet.module';
import { FormModule } from './form/form.module';
import { MirrorModule } from './mirror/mirror.module';
import { ResourceModule } from './resource/resource.module';
import { WidgetModule } from './widget/widget.module';
import { AssetModule } from './asset/asset.module';
import { OtModule } from './ot/ot.module';
import { CommandModule } from './command/command.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CascaderModule } from './cascader/cascader.module';
import { TimeMachineDynamicModule } from './time_machine/time.machine.dynamic.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AssetModule,
    AttachmentModule,
    AlarmDynamicModule.forRoot(),
    SubscriptionDynamicModule.forRoot(),
    DashboardModule,
    DatasheetModule,
    FormModule,
    MirrorModule,
    TimeMachineDynamicModule.forRoot(),
    ResourceModule,
    WidgetModule,
    OtModule,
    CommandModule,
    CascaderModule,
  ],
  providers: [],
  exports: [
    AssetModule,
    AttachmentModule,
    AlarmDynamicModule.forRoot(), 
    SubscriptionDynamicModule.forRoot(), 
    DashboardModule,
    DatasheetModule,
    FormModule,
    TimeMachineDynamicModule.forRoot(),
    MirrorModule,
    ResourceModule,
    WidgetModule,
    OtModule,
    CommandModule,
    CascaderModule,
  ]
})
export class DatabaseModule {}
