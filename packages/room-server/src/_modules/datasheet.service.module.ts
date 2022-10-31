import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRecordSubscriptionEntity } from '../database/entities/datasheet.record.subscription.entity';
import { QueueWorkerModule } from './queue.worker.module';
import { DatasheetChangesetRepository } from '../database/repositories/datasheet.changeset.repository';
import { DatasheetChangesetSourceRepository } from '../database/repositories/datasheet.changeset.source.repository';
import { DatasheetMetaRepository } from '../database/repositories/datasheet.meta.repository';
import { DatasheetRecordAlarmRepository } from '../database/repositories/datasheet.record.alarm.repository';
import { DatasheetRecordRepository } from '../database/repositories/datasheet.record.repository';
import { DatasheetRecordSourceRepository } from '../database/repositories/datasheet.record.source.repository';
import { DatasheetRecordSubscriptionRepository } from '../database/repositories/datasheet.record.subscription.repository';
import { DatasheetRepository } from '../database/repositories/datasheet.repository';
import { RecordCommentRepository } from '../database/repositories/record.comment.repository';
import { RecordCommentService } from 'database/services/datasheet/record.comment.service';
import { JavaModule } from 'shared/services/java/java.module';
import { UnitServiceModule } from './unit.service.module';
import { WidgetServiceModule } from './widget.module';
import { RestModule } from './rest.module';
import { NodeServiceModule } from './node.service.module';
import { UserServiceModule } from './user.service.module';
import { ComputeFieldReferenceManager } from '../database/services/datasheet/compute.field.reference.manager';
import { DatasheetChangesetService } from '../database/services/datasheet/datasheet.changeset.service';
import { DatasheetChangesetSourceService } from '../database/services/datasheet/datasheet.changeset.source.service';
import { DatasheetFieldHandler } from '../database/services/datasheet/datasheet.field.handler';
import { DatasheetMetaService } from '../database/services/datasheet/datasheet.meta.service';
import { DatasheetRecordAlarmService } from '../database/services/datasheet/datasheet.record.alarm.service';
import { DatasheetRecordService } from '../database/services/datasheet/datasheet.record.service';
import { DatasheetRecordSourceService } from '../database/services/datasheet/datasheet.record.source.service';
import { DatasheetRecordSubscriptionService } from '../database/services/datasheet/datasheet.record.subscription.service';
import { DatasheetService } from '../database/services/datasheet/datasheet.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DatasheetRecordRepository,
      DatasheetRecordSourceRepository,
      DatasheetRecordSubscriptionRepository,
      DatasheetRepository,
      DatasheetMetaRepository,
      RecordCommentRepository,
      DatasheetChangesetRepository,
      DatasheetChangesetSourceRepository,
      DatasheetRecordAlarmRepository,
    ]),
    forwardRef(() => NodeServiceModule),
    UnitServiceModule,
    UserServiceModule,
    JavaModule,
    WidgetServiceModule,
    RestModule,
    QueueWorkerModule,
  ],
  providers: [
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
    DatasheetRecordAlarmService,
  ],
  exports: [
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
    DatasheetRecordAlarmService,
  ],
})
export class DatasheetServiceModule {}
