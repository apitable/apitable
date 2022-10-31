import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiUsageRepository } from '../fusion/repositories/api.usage.repository';
import { DatasheetRecordRepository } from '../database/repositories/datasheet.record.repository';
import { CommandServiceModule } from './command.service.module';
import { DatasheetServiceModule } from './datasheet.service.module';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { JavaModule } from 'shared/services/java/java.module';
import { ResourceServiceModule } from './resource.service.module';
import { UserServiceModule } from './user.service.module';
import { FusionApiFilter } from '../fusion/filter/fusion.api.filter';
import { FusionApiRecordService } from '../fusion/services/fusion.api.record.service';
import { FusionApiService } from '../fusion/services/fusion.api.service';
import { OtService } from 'database/services/ot/ot.service';
import { DatasheetOtService } from 'database/services/ot/datasheet.ot.service';
import { DashboardOtService } from 'database/services/ot/dashboard.ot.service';
import { MirrorOtService } from 'database/services/ot/mirror.ot.service';
import { FormOtService } from 'database/services/ot/form.ot.service';
import { WidgetOtService } from 'database/services/ot/widget.ot.service';
import { ResourceChangeHandler } from 'database/services/ot/resource.change.handler';
import { MirrorService } from 'database/services/mirror/mirror.service';
import { EventService } from 'database/services/event/event.service';
import { AutomationService } from 'automation/services/automation.service';
import { DashboardService } from 'database/services/dashboard/dashboard.service';
import { ResourceMetaRepository } from 'database/repositories/resource.meta.repository';
import { DatasheetWidgetRepository } from 'database/repositories/datasheet.widget.repository';
import { NodeServiceModule } from './node.service.module';
import { RestModule } from './rest.module';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { NodeRepository } from 'database/repositories/node.repository';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from 'automation/repositories/automation.run.history.repository';
import { AutomationServiceRepository } from 'automation/repositories/automation.service.repository';
import { AutomationActionTypeRepository } from 'automation/repositories/automation.action.type.repository';
import { UnitService } from 'database/services/unit/unit.service';
import { UnitMemberService } from 'database/services/unit/unit.member.service';
import { UnitTagService } from 'database/services/unit/unit.tag.service';
import { UnitTeamService } from 'database/services/unit/unit.team.service';
import { UnitRepository } from 'database/repositories/unit.repository';
import { UnitMemberRepository } from 'database/repositories/unit.member.repository';
import { UnitTagRepository } from 'database/repositories/unit.tag.repository';
import { UnitTeamRepository } from 'database/repositories/unit.team.repository';
import { UserRepository } from 'database/repositories/user.repository';
import { WidgetService } from 'database/services/widget/widget.service';
import { WidgetRepository } from 'database/repositories/widget.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DatasheetRecordRepository])],
  providers: [FusionApiRecordService],
  exports: [FusionApiRecordService],
  })
export class FusionApiRecordServiceModule {
}

@Module({
  imports: [
  TypeOrmModule.forFeature([
    WidgetRepository,
    ]),
  TypeOrmModule.forFeature([ApiUsageRepository]),
  DatasheetServiceModule,
  CommandServiceModule,
  JavaModule,
  ResourceServiceModule,
  UserServiceModule,
  FusionApiRecordServiceModule,
  
  TypeOrmModule.forFeature([ResourceMetaRepository, DatasheetWidgetRepository]),
  DatasheetServiceModule,
  NodeServiceModule,
  UserServiceModule,
  ResourceServiceModule,
  RestModule,
  GrpcClientModule,
  DatasheetServiceModule,
  CommandServiceModule,
  TypeOrmModule.forFeature([AutomationTriggerRepository, AutomationTriggerTypeRepository]),
  TypeOrmModule.forFeature([
    NodeRepository,
    AutomationTriggerRepository,
    AutomationRobotRepository,
    AutomationRunHistoryRepository,
    AutomationServiceRepository,
    AutomationTriggerTypeRepository,
    AutomationActionTypeRepository
    ]),
  TypeOrmModule.forFeature([ResourceMetaRepository]),
  NodeServiceModule,
  RestModule,
  TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
  UserServiceModule,
  ],
  providers: [FusionApiService, FusionApiFilter, FusionApiTransformer,
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
  UnitService, UnitMemberService, UnitTagService, UnitTeamService,
  WidgetService,
  ],
  exports: [FusionApiService, FusionApiFilter, FusionApiTransformer],
  })
export class FusionApiServiceModule {
}

