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
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { RobotModule } from 'automation/robot.module';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { DatasheetController } from './controllers/datasheet.controller';
import { ResourceDataInterceptor } from './middleware/resource.data.interceptor';
import { DatasheetChangesetRepository } from './repositories/datasheet.changeset.repository';
import { DatasheetChangesetSourceRepository } from './repositories/datasheet.changeset.source.repository';
import { DatasheetMetaRepository } from './repositories/datasheet.meta.repository';
import { DatasheetRecordRepository } from './repositories/datasheet.record.repository';
import { DatasheetRecordSourceRepository } from './repositories/datasheet.record.source.repository';
import { DatasheetRepository } from './repositories/datasheet.repository';
import { DatasheetWidgetRepository } from './repositories/datasheet.widget.repository';
import { RecordCommentRepository } from './repositories/record.comment.repository';
import { AlarmDynamicModule } from './services/alarm/alarm.dynamic.module';
import { AttachmentService } from './attachment/services/attachment.service';
import { CommandOptionsService } from './services/command/command.options.service';
import { CommandService } from './services/command/command.service';
import { DashboardService } from './dashboard/services/dashboard.service';
import { ComputeFieldReferenceManager } from './services/datasheet/compute.field.reference.manager';
import { DatasheetChangesetService } from './services/datasheet/datasheet.changeset.service';
import { DatasheetChangesetSourceService } from './services/datasheet/datasheet.changeset.source.service';
import { DatasheetFieldHandler } from './services/datasheet/datasheet.field.handler';
import { DatasheetMetaService } from './services/datasheet/datasheet.meta.service';
import { DatasheetRecordService } from './services/datasheet/datasheet.record.service';
import { DatasheetRecordSourceService } from './services/datasheet/datasheet.record.source.service';
import { DatasheetService } from './services/datasheet/datasheet.service';
import { RecordCommentService } from './services/datasheet/record.comment.service';
import { EventService } from './services/event/event.service';
import { FormService } from './services/form/form.service';
import { MirrorService } from './services/mirror/mirror.service';
import { DashboardOtService } from './services/ot/dashboard.ot.service';
import { DatasheetOtService } from './services/ot/datasheet.ot.service';
import { FormOtService } from './services/ot/form.ot.service';
import { MirrorOtService } from './services/ot/mirror.ot.service';
import { OtService } from './services/ot/ot.service';
import { ResourceChangeHandler } from './services/ot/resource.change.handler';
import { WidgetOtService } from './services/ot/widget.ot.service';
import { SubscriptionDynamicModule } from './services/subscription/subscription.dynamic.module';
import { GrpcModule } from 'grpc/grpc.module';
import { IsNodeExistConstraint } from './validations/validation.constraint';
import { MirrorController } from './controllers/mirror.controller';
import { FormController } from './controllers/form.controller';
import { AttachmentModule } from './attachment/attachment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatasheetModule } from './datasheet/datasheet.module';
import { FormModule } from './form/form.module';
import { MirrorModule } from './mirror/mirror.module';
import { ResourceModule } from './resource/resource.module';
import { WidgetModule } from './widget/widget.module';
import { NodeModule } from './node/node.module';
import { UserModule } from './user/user.module';
import { AlarmModule } from './alarm/alarm.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AssetModule } from './asset/asset.module';
import { UnitModule } from './unit/unit.module';
import { DeveloperModule } from './developer/developer.module';

@Module({
  imports: [
    RobotModule,
    GrpcModule,
    AlarmDynamicModule.forRoot(),
    SubscriptionDynamicModule.forRoot(),
    // DatasheetServiceModule,
    TypeOrmModule.forFeature([
      DatasheetChangesetRepository,
      DatasheetChangesetSourceRepository,
      DatasheetMetaRepository,
      DatasheetRecordRepository,
      DatasheetRecordSourceRepository,
      DatasheetRepository,
      DatasheetWidgetRepository,
      RecordCommentRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      AutomationTriggerRepository,
      AutomationTriggerTypeRepository,
    ]),
    AttachmentModule,
    DashboardModule,
    DatasheetModule,
    FormModule,
    MirrorModule,
    ResourceModule,
    WidgetModule,
    NodeModule,
    UserModule,
    AlarmModule,
    SubscriptionModule,
    AssetModule,
    UnitModule,
    DeveloperModule,
  ],
  providers: [
    AttachmentService,
    CommandService,
    CommandOptionsService,
    DashboardService,
    DatasheetService,
    DatasheetMetaService,
    DatasheetRecordService,
    DatasheetRecordSourceService,
    DatasheetChangesetService,
    DatasheetChangesetSourceService,
    RecordCommentService,
    DatasheetFieldHandler,
    ComputeFieldReferenceManager,
    EventService,
    FormService,
    MirrorService,
    OtService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
    ResourceDataInterceptor,
    FusionApiTransformer,
    IsNodeExistConstraint,
  ],
  controllers: [DatasheetController, FormController, MirrorController],
  exports: [
    AssetModule,
    AttachmentModule,
    AlarmDynamicModule.forRoot(), 
    SubscriptionDynamicModule.forRoot(), 
    NodeModule,
    ResourceModule,
    DashboardModule,
    CommandService,
    CommandOptionsService,
    DashboardService,
    DatasheetService,
    DatasheetMetaService,
    DatasheetRecordService,
    DatasheetRecordSourceService,
    DatasheetChangesetService,
    DatasheetChangesetSourceService,
    RecordCommentService,
    DatasheetFieldHandler,
    ComputeFieldReferenceManager,
    EventService,
    FormService,
    MirrorService,
    OtService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
    ResourceDataInterceptor,
    IsNodeExistConstraint
  ]
})
export class DatabaseModule {}
