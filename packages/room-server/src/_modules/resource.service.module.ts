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
import { AutomationServiceModule } from './automation.service.module';

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
