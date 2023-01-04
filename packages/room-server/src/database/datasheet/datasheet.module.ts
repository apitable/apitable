import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'database/command/command.module';
import { NodeModule } from 'database/node/node.module';
import { ResourceModule } from 'database/resource/resource.module';
import { SubscriptionDynamicModule } from 'database/subscription/subscription.dynamic.module';
import { UnitModule } from 'database/unit/unit.module';
import { UserModule } from 'database/user/user.module';
import { DatasheetController } from './controllers/datasheet.controller';
import { DatasheetChangesetRepository } from './repositories/datasheet.changeset.repository';
import { DatasheetChangesetSourceRepository } from './repositories/datasheet.changeset.source.repository';
import { DatasheetMetaRepository } from './repositories/datasheet.meta.repository';
import { DatasheetRecordRepository } from './repositories/datasheet.record.repository';
import { DatasheetRecordSourceRepository } from './repositories/datasheet.record.source.repository';
import { DatasheetRepository } from './repositories/datasheet.repository';
import { DatasheetWidgetRepository } from './repositories/datasheet.widget.repository';
import { RecordCommentRepository } from './repositories/record.comment.repository';
import { ComputeFieldReferenceManager } from './services/compute.field.reference.manager';
import { DatasheetChangesetService } from './services/datasheet.changeset.service';
import { DatasheetChangesetSourceService } from './services/datasheet.changeset.source.service';
import { DatasheetFieldHandler } from './services/datasheet.field.handler';
import { DatasheetMetaService } from './services/datasheet.meta.service';
import { DatasheetRecordService } from './services/datasheet.record.service';
import { DatasheetRecordSourceService } from './services/datasheet.record.source.service';
import { DatasheetService } from './services/datasheet.service';
import { RecordCommentService } from './services/record.comment.service';

@Module({
  imports: [
    forwardRef(()=>ResourceModule),
    NodeModule,
    UnitModule,
    UserModule,
    CommandModule,
    SubscriptionDynamicModule.forRoot(),
    TypeOrmModule.forFeature([
      DatasheetChangesetRepository,
      DatasheetChangesetSourceRepository,
      DatasheetMetaRepository,
      DatasheetRecordRepository,
      DatasheetRecordSourceRepository,
      DatasheetRepository,
      DatasheetWidgetRepository,
      RecordCommentRepository,
    ]),
  ],
  providers: [
    DatasheetService,
    DatasheetMetaService,
    DatasheetRecordService,
    DatasheetRecordSourceService,
    DatasheetChangesetService,
    DatasheetChangesetSourceService,
    RecordCommentService,
    DatasheetFieldHandler,
    ComputeFieldReferenceManager
  ],
  controllers: [DatasheetController],
  exports: [
    DatasheetService,
    DatasheetMetaService,
    DatasheetRecordService,
    DatasheetRecordSourceService,
    DatasheetChangesetService,
    DatasheetChangesetSourceService,
    RecordCommentService,
    DatasheetFieldHandler,
    ComputeFieldReferenceManager
  ],
})
export class DatasheetModule {}
