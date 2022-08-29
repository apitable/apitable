import { Module } from '@nestjs/common';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { ChangesetService } from './changeset.service';
import { MetaService } from './meta.service';
import { ResourceService } from './resource.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetChangesetRepository } from 'modules/repository/datasheet.changeset.repository';
import { ResourceChangesetRepository } from 'modules/repository/resource.changeset.repository';
import { DatasheetServiceModule } from '../datasheet/datasheet.service.module';
import { WidgetServiceModule } from '../widget/widget.module';
import { AutomationServiceModule } from '../automation/automation.service.module';

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
