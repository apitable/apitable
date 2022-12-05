import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationActionTypeRepository } from 'automation/repositories/automation.action.type.repository';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from 'automation/repositories/automation.run.history.repository';
import { AutomationServiceRepository } from 'automation/repositories/automation.service.repository';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { AutomationService } from 'automation/services/automation.service';
import { AssetRepository } from 'database/repositories/asset.repository';
import { DatasheetChangesetRepository } from 'database/repositories/datasheet.changeset.repository';
import { DatasheetChangesetSourceRepository } from 'database/repositories/datasheet.changeset.source.repository';
import { DatasheetMetaRepository } from 'database/repositories/datasheet.meta.repository';
import { DatasheetRecordRepository } from 'database/repositories/datasheet.record.repository';
import { DatasheetRecordSourceRepository } from 'database/repositories/datasheet.record.source.repository';
import { DatasheetRecordSubscriptionRepository } from 'database/repositories/datasheet.record.subscription.repository';
import { DatasheetRepository } from 'database/repositories/datasheet.repository';
import { DatasheetWidgetRepository } from 'database/repositories/datasheet.widget.repository';
import { NodeDescRepository } from 'database/repositories/node.desc.repository';
import { NodeRelRepository } from 'database/repositories/node.rel.repository';
import { NodeRepository } from 'database/repositories/node.repository';
import { NodeShareSettingRepository } from 'database/repositories/node.share.setting.repository';
import { RecordCommentRepository } from 'database/repositories/record.comment.repository';
import { ResourceMetaRepository } from 'database/repositories/resource.meta.repository';
import { UnitMemberRepository } from 'database/repositories/unit.member.repository';
import { UnitRepository } from 'database/repositories/unit.repository';
import { UnitTagRepository } from 'database/repositories/unit.tag.repository';
import { UnitTeamRepository } from 'database/repositories/unit.team.repository';
import { UserRepository } from 'database/repositories/user.repository';
import { WidgetRepository } from 'database/repositories/widget.repository';
import { AlarmDynamicModule } from 'database/services/alarm/alarm.dynamic.module';
import { AttachmentService } from 'database/services/attachment/attachment.service';
import { DashboardService } from 'database/services/dashboard/dashboard.service';
import { ComputeFieldReferenceManager } from 'database/services/datasheet/compute.field.reference.manager';
import { DatasheetChangesetService } from 'database/services/datasheet/datasheet.changeset.service';
import { DatasheetChangesetSourceService } from 'database/services/datasheet/datasheet.changeset.source.service';
import { DatasheetFieldHandler } from 'database/services/datasheet/datasheet.field.handler';
import { DatasheetMetaService } from 'database/services/datasheet/datasheet.meta.service';
import { DatasheetRecordService } from 'database/services/datasheet/datasheet.record.service';
import { DatasheetRecordSourceService } from 'database/services/datasheet/datasheet.record.source.service';
import { DatasheetRecordSubscriptionService } from 'database/services/datasheet/datasheet.record.subscription.service';
import { DatasheetService } from 'database/services/datasheet/datasheet.service';
import { RecordCommentService } from 'database/services/datasheet/record.comment.service';
import { EventService } from 'database/services/event/event.service';
import { MirrorService } from 'database/services/mirror/mirror.service';
import { NodeDescriptionService } from 'database/services/node/node.description.service';
import { NodePermissionService } from 'database/services/node/node.permission.service';
import { NodeService } from 'database/services/node/node.service';
import { NodeShareSettingService } from 'database/services/node/node.share.setting.service';
import { DashboardOtService } from 'database/services/ot/dashboard.ot.service';
import { DatasheetOtService } from 'database/services/ot/datasheet.ot.service';
import { FormOtService } from 'database/services/ot/form.ot.service';
import { MirrorOtService } from 'database/services/ot/mirror.ot.service';
import { OtService } from 'database/services/ot/ot.service';
import { ResourceChangeHandler } from 'database/services/ot/resource.change.handler';
import { WidgetOtService } from 'database/services/ot/widget.ot.service';
import { UnitMemberService } from 'database/services/unit/unit.member.service';
import { UnitService } from 'database/services/unit/unit.service';
import { UnitTagService } from 'database/services/unit/unit.tag.service';
import { UnitTeamService } from 'database/services/unit/unit.team.service';
import { UserService } from 'database/services/user/user.service';
import { WidgetService } from 'database/services/widget/widget.service';
import { QueueWorkerModule } from 'enterprise/queue/queue.worker.module';
import { FusionApiFilter } from 'fusion/filter/fusion.api.filter';
import { ApiUsageRepository } from 'fusion/repositories/api.usage.repository';
import { DataBusService } from 'fusion/services/databus/databus.service';
import { FusionApiRecordService } from 'fusion/services/fusion.api.record.service';
import { FusionApiService } from 'fusion/services/fusion.api.service';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { GrpcClientModule } from 'grpc/client/grpc.client.module';
import { GlobalModule } from './global.module';
import { LoggerModule } from './logger/winston.module';
import { HttpConfigService } from './services/config/http.config.service';
import { LoggerConfigService } from './services/config/logger.config.service';
import { ZipkinConfigService } from './services/config/zipkin.config.service';
import { JavaModule } from './services/java/java.module';
import { ZipkinModule } from './services/zipkin/zipkin.module';

@Module({
  imports: [
    GlobalModule,
    AlarmDynamicModule.forRoot(),
    TypeOrmModule.forFeature([AssetRepository]),
    JavaModule,
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    // Zipkin configuration
    ZipkinModule.forRootAsync({
      useClass: ZipkinConfigService,
    }),
    // Logger configuration
    LoggerModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
    TypeOrmModule.forFeature([UserRepository, WidgetRepository]),
    TypeOrmModule.forFeature([ApiUsageRepository]),
    TypeOrmModule.forFeature([DatasheetRecordRepository]),
    TypeOrmModule.forFeature([ResourceMetaRepository, DatasheetWidgetRepository]),
    GrpcClientModule,
    TypeOrmModule.forFeature([AutomationTriggerRepository, AutomationTriggerTypeRepository]),
    TypeOrmModule.forFeature([
      NodeRepository,
      AutomationTriggerRepository,
      AutomationRobotRepository,
      AutomationRunHistoryRepository,
      AutomationServiceRepository,
      AutomationTriggerTypeRepository,
      AutomationActionTypeRepository,
    ]),
    TypeOrmModule.forFeature([ResourceMetaRepository]),
    TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
    TypeOrmModule.forFeature([
      NodeRepository,
      NodeRelRepository,
      NodeDescRepository,
      NodeShareSettingRepository,
      DatasheetRepository,
      ResourceMetaRepository,
    ]),
    TypeOrmModule.forFeature([
      DatasheetRecordRepository,
      DatasheetRecordSourceRepository,
      DatasheetRecordSubscriptionRepository,
      DatasheetRepository,
      DatasheetMetaRepository,
      RecordCommentRepository,
      DatasheetChangesetRepository,
      DatasheetChangesetSourceRepository,
    ]),
    // UserServiceModule,
    QueueWorkerModule,
  ],
  controllers: [],
  providers: [
    AttachmentService,
    UserService,
    FusionApiRecordService,
    FusionApiService,
    FusionApiFilter,
    FusionApiTransformer,
    DataBusService,
    OtService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
    MirrorService,
    EventService,
    AutomationService,
    DashboardService,
    UnitService,
    UnitMemberService,
    UnitTagService,
    UnitTeamService,
    WidgetService,
    NodeService,
    NodePermissionService,
    NodeShareSettingService,
    NodeDescriptionService,
    DatasheetService,
    DatasheetMetaService,
    DatasheetRecordService,
    RecordCommentService,
    DatasheetRecordSourceService,
    DatasheetRecordSubscriptionService,
    DatasheetFieldHandler,
    ComputeFieldReferenceManager,
    DatasheetChangesetService,
    DatasheetChangesetSourceService,
  ],
  exports: [
    AttachmentService,
    UserService,
    FusionApiService,
    FusionApiFilter,
    FusionApiTransformer,
    DataBusService,
    DatasheetService,
    DatasheetMetaService,
    DatasheetRecordService,
    RecordCommentService,
    DatasheetRecordSourceService,
    DatasheetRecordSubscriptionService,
    DatasheetFieldHandler,
    ComputeFieldReferenceManager,
    DatasheetChangesetService,
    DatasheetChangesetSourceService,
  ],
})
export class SharedModule {}
