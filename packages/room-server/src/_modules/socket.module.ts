import { Global, Module } from '@nestjs/common';
import { ClientStorage } from 'shared/services/socket/client.storage';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { RoomResourceRelService } from '../shared/services/socket/room.resource.rel.service';
import { UserServiceModule } from './user.service.module';
import { ResourceServiceModule } from './resource.service.module';
import { NodeServiceModule } from './node.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from '../database/repositories/datasheet.repository';
import { WidgetRepository } from '../database/repositories/widget.repository';
import { ResourceMetaRepository } from '../database/repositories/resource.meta.repository';
import { DatasheetServiceModule } from './datasheet.service.module';
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
import { RestModule } from './rest.module';
import { CommandServiceModule } from './command.service.module';
import { DatasheetWidgetRepository } from 'database/repositories/datasheet.widget.repository';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { NodeRepository } from 'database/repositories/node.repository';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from 'automation/repositories/automation.run.history.repository';
import { AutomationServiceRepository } from 'automation/repositories/automation.service.repository';
import { AutomationActionTypeRepository } from 'automation/repositories/automation.action.type.repository';
import { WidgetService } from 'database/services/widget/widget.service';

@Global()
@Module({
  imports: [
  TypeOrmModule.forFeature([
    WidgetRepository,
    ]),
  TypeOrmModule.forFeature([DatasheetRepository, ResourceMetaRepository, WidgetRepository]),
  UserServiceModule,
  ResourceServiceModule,
  NodeServiceModule,
  DatasheetServiceModule,
  GrpcClientModule,
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
  
  ],
  providers: [RoomResourceRelService, ClientStorage,
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
  WidgetService,
  ],
  exports: [RoomResourceRelService, ClientStorage],
  })
export class SocketModule {}
