import { Module } from '@nestjs/common';
import { NodeServiceModule } from 'datasheet/_modules/node.service.module';
import { ChangesetService } from '../services/resource/changeset.service';
import { MetaService } from '../services/resource/meta.service';
import { ResourceService } from '../services/resource/resource.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetChangesetRepository } from '../repositories/datasheet.changeset.repository';
import { ResourceChangesetRepository } from '../repositories/resource.changeset.repository';
import { DatasheetServiceModule } from './datasheet.service.module';
import { WidgetServiceModule } from './widget.module';
import { AutomationServiceModule } from '../../automation/services/automation.service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DatasheetChangesetRepository,
      ResourceChangesetRepository,
    ]),
    NodeServiceModule,
    DatasheetServiceModule,
    WidgetServiceModule,
    AutomationServiceModule,
  ],
  providers: [ResourceService, MetaService, ChangesetService],
  exports: [ResourceService, MetaService, ChangesetService],
})
export class ResourceServiceModule {
}
