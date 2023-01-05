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
import { AttachmentController } from './controllers/attachment.controller';
import { DatasheetController } from './controllers/datasheet.controller';
import { ResourceDataInterceptor } from './middleware/resource.data.interceptor';
import { AssetRepository } from './repositories/asset.repository';
import { DatasheetChangesetRepository } from './repositories/datasheet.changeset.repository';
import { DatasheetChangesetSourceRepository } from './repositories/datasheet.changeset.source.repository';
import { DatasheetMetaRepository } from './repositories/datasheet.meta.repository';
import { DatasheetRecordRepository } from './repositories/datasheet.record.repository';
import { DatasheetRecordSourceRepository } from './repositories/datasheet.record.source.repository';
import { DatasheetRepository } from './repositories/datasheet.repository';
import { DatasheetWidgetRepository } from './repositories/datasheet.widget.repository';
import { DeveloperRepository } from './repositories/developer.repository';
import { NodeDescRepository } from './repositories/node.desc.repository';
import { NodeRelRepository } from './repositories/node.rel.repository';
import { NodeRepository } from './repositories/node.repository';
import { NodeShareSettingRepository } from './repositories/node.share.setting.repository';
import { RecordCommentRepository } from './repositories/record.comment.repository';
import { ResourceMetaRepository } from './repositories/resource.meta.repository';
import { UnitMemberRepository } from './repositories/unit.member.repository';
import { UnitRepository } from './repositories/unit.repository';
import { UnitTagRepository } from './repositories/unit.tag.repository';
import { UnitTeamRepository } from './repositories/unit.team.repository';
import { UserRepository } from './repositories/user.repository';
import { WidgetRepository } from './repositories/widget.repository';
import { AlarmDynamicModule } from './services/alarm/alarm.dynamic.module';
import { AttachmentService } from './services/attachment/attachment.service';
import { CommandOptionsService } from './services/command/command.options.service';
import { CommandService } from './services/command/command.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { ComputeFieldReferenceManager } from './services/datasheet/compute.field.reference.manager';
import { DatasheetChangesetService } from './services/datasheet/datasheet.changeset.service';
import { DatasheetChangesetSourceService } from './services/datasheet/datasheet.changeset.source.service';
import { DatasheetFieldHandler } from './services/datasheet/datasheet.field.handler';
import { DatasheetMetaService } from './services/datasheet/datasheet.meta.service';
import { DatasheetRecordService } from './services/datasheet/datasheet.record.service';
import { DatasheetRecordSourceService } from './services/datasheet/datasheet.record.source.service';
import { DatasheetService } from './services/datasheet/datasheet.service';
import { RecordCommentService } from './services/datasheet/record.comment.service';
import { DeveloperService } from './services/developer/developer.service';
import { FormService } from './services/form/form.service';
import { MirrorService } from './services/mirror/mirror.service';
import { NodeDescriptionService } from './services/node/node.description.service';
import { NodePermissionService } from './services/node/node.permission.service';
import { NodeService } from './services/node/node.service';
import { NodeShareSettingService } from './services/node/node.share.setting.service';
import { DashboardOtService } from './services/ot/dashboard.ot.service';
import { DatasheetOtService } from './services/ot/datasheet.ot.service';
import { FormOtService } from './services/ot/form.ot.service';
import { MirrorOtService } from './services/ot/mirror.ot.service';
import { OtService } from './services/ot/ot.service';
import { ResourceChangeHandler } from './services/ot/resource.change.handler';
import { WidgetOtService } from './services/ot/widget.ot.service';
import { ChangesetService } from './services/resource/changeset.service';
import { MetaService } from './services/resource/meta.service';
import { ResourceService } from './services/resource/resource.service';
import { RoomResourceRelService } from './services/resource/room.resource.rel.service';
import { SubscriptionDynamicModule } from './services/subscription/subscription.dynamic.module';
import { UnitMemberService } from './services/unit/unit.member.service';
import { UnitService } from './services/unit/unit.service';
import { UnitTagService } from './services/unit/unit.tag.service';
import { UnitTeamService } from './services/unit/unit.team.service';
import { UserService } from './services/user/user.service';
import { WidgetService } from './services/widget/widget.service';
import { GrpcModule } from 'grpc/grpc.module';
import { ResourceChangesetRepository } from './repositories/resource.changeset.repository';
import { IsNodeExistConstraint } from './validations/validation.constraint';
import { MirrorController } from './controllers/mirror.controller';
import { ResourceController } from './controllers/resource.controller';
import { FormController } from './controllers/form.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { RobotEventService } from "./services/robot/robot.event.service";
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RobotModule,
    GrpcModule,
    AlarmDynamicModule.forRoot(),
    SubscriptionDynamicModule.forRoot(),
    // DatasheetServiceModule,
    TypeOrmModule.forFeature([
      AssetRepository,
      DatasheetChangesetRepository,
      DatasheetChangesetSourceRepository,
      DatasheetMetaRepository,
      DatasheetRecordRepository,
      DatasheetRecordSourceRepository,
      DatasheetRepository,
      DatasheetWidgetRepository,
      RecordCommentRepository,
      ResourceMetaRepository,
      WidgetRepository,
      UserRepository,
      NodeRepository,
      NodeRelRepository,
      NodeDescRepository,
      NodeShareSettingRepository,
      UnitRepository,
      UnitMemberRepository, 
      UnitTagRepository, 
      UnitTeamRepository,
      DeveloperRepository,
      ResourceChangesetRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      AutomationTriggerRepository,
      AutomationTriggerTypeRepository,
    ]),
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
    DeveloperService,
    FormService,
    MirrorService,
    OtService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
    UserService,
    ResourceService,
    MetaService,
    ChangesetService,
    NodeService, 
    NodePermissionService, 
    NodeShareSettingService, 
    NodeDescriptionService, 
    UnitService, 
    UnitMemberService, 
    UnitTagService, 
    UnitTeamService,
    WidgetService,
    ResourceDataInterceptor,
    RoomResourceRelService,
    FusionApiTransformer,
    IsNodeExistConstraint,
    RobotEventService,
  ],
  controllers: [DatasheetController, AttachmentController, DashboardController, FormController, MirrorController, ResourceController],
  exports: [
    AlarmDynamicModule.forRoot(), 
    SubscriptionDynamicModule.forRoot(), 
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
    DeveloperService,
    FormService,
    MirrorService,
    OtService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
    UserService,
    ResourceService,
    MetaService,
    ChangesetService,
    NodeService, 
    NodePermissionService, 
    NodeShareSettingService, 
    NodeDescriptionService, 
    UnitService, 
    UnitMemberService, 
    UnitTagService, 
    UnitTeamService,
    WidgetService,
    ResourceDataInterceptor,
    RoomResourceRelService,
    IsNodeExistConstraint
  ]
})
export class DatabaseModule {}
