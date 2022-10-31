import { Module } from '@nestjs/common';
import { NodeServiceModule } from '_modules/node.service.module';
import { ChangesetService } from '../database/services/resource/changeset.service';
import { MetaService } from '../database/services/resource/meta.service';
import { ResourceService } from '../database/services/resource/resource.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetChangesetRepository } from '../database/repositories/datasheet.changeset.repository';
import { ResourceChangesetRepository } from '../database/repositories/resource.changeset.repository';
import { DatasheetServiceModule } from './datasheet.service.module';
import { WidgetServiceModule } from './widget.module';
import { AutomationService } from 'automation/services/automation.service';
import { NodeRepository } from 'database/repositories/node.repository';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from 'automation/repositories/automation.run.history.repository';
import { AutomationServiceRepository } from 'automation/repositories/automation.service.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { AutomationActionTypeRepository } from 'automation/repositories/automation.action.type.repository';

@Module({
  imports: [
  TypeOrmModule.forFeature([
    DatasheetChangesetRepository,
    ResourceChangesetRepository,
    ]),
  NodeServiceModule,
  DatasheetServiceModule,
  WidgetServiceModule,
  TypeOrmModule.forFeature([
    NodeRepository,
    AutomationTriggerRepository,
    AutomationRobotRepository,
    AutomationRunHistoryRepository,
    AutomationServiceRepository,
    AutomationTriggerTypeRepository,
    AutomationActionTypeRepository
    ]),
  ],
  providers: [ResourceService, MetaService, ChangesetService, AutomationService],
  exports: [ResourceService, MetaService, ChangesetService],
  })
export class ResourceServiceModule {
}
