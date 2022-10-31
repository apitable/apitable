import { Module } from '@nestjs/common';
import { DatasheetWidgetRepository } from '../database/repositories/datasheet.widget.repository';
import { ResourceMetaRepository } from '../database/repositories/resource.meta.repository';
import { RestModule } from './rest.module';
import { OtService } from '../database/services/ot/ot.service';
import { DatasheetServiceModule } from './datasheet.service.module';
import { NodeServiceModule } from './node.service.module';
import { UserServiceModule } from './user.service.module';
import { WidgetServiceModule } from './widget.module';
import { ResourceServiceModule } from '_modules/resource.service.module';
import { ResourceChangeHandler } from '../database/services/ot/resource.change.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetOtService } from '../database/services/ot/widget.ot.service';
import { FormOtService } from '../database/services/ot/form.ot.service';
import { DatasheetOtService } from '../database/services/ot/datasheet.ot.service';
import { DashboardOtService } from '../database/services/ot/dashboard.ot.service';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { MirrorOtService } from 'database/services/ot/mirror.ot.service';
import { MirrorService } from 'database/services/mirror/mirror.service';
import { EventService } from 'database/services/event/event.service';
import { CommandServiceModule } from './command.service.module';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { AutomationService } from 'automation/services/automation.service';
import { NodeRepository } from 'database/repositories/node.repository';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from 'automation/repositories/automation.run.history.repository';
import { AutomationServiceRepository } from 'automation/repositories/automation.service.repository';
import { AutomationActionTypeRepository } from 'automation/repositories/automation.action.type.repository';
import { DashboardService } from 'database/services/dashboard/dashboard.service';

@Module({
  imports: [
  TypeOrmModule.forFeature([ResourceMetaRepository, DatasheetWidgetRepository]),
  DatasheetServiceModule,
  NodeServiceModule,
  UserServiceModule,
  WidgetServiceModule,
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
  ],
  providers: [
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
  ],
  exports: [OtService],
  })
export class OtModule {}
