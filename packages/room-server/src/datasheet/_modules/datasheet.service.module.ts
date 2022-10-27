import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRecordSubscriptionEntity } from '../entities/datasheet.record.subscription.entity';
import { QueueWorkerModule } from 'shared/services/queue/queue.worker.module';
import { DatasheetChangesetRepository } from '../repositories/datasheet.changeset.repository';
import { DatasheetChangesetSourceRepository } from '../repositories/datasheet.changeset.source.repository';
import { DatasheetMetaRepository } from '../repositories/datasheet.meta.repository';
import { DatasheetRecordAlarmRepository } from '../repositories/datasheet.record.alarm.repository';
import { DatasheetRecordRepository } from '../repositories/datasheet.record.repository';
import { DatasheetRecordSourceRepository } from '../repositories/datasheet.record.source.repository';
import { DatasheetRecordSubscriptionRepository } from '../repositories/datasheet.record.subscription.repository';
import { DatasheetRepository } from '../repositories/datasheet.repository';
import { RecordCommentRepository } from '../repositories/record.comment.repository';
import { RecordCommentService } from 'datasheet/services/datasheet/record.comment.service';
import { JavaModule } from 'shared/services/java/java.module';
import { UnitServiceModule } from './unit.service.module';
import { WidgetServiceModule } from './widget.module';
import { RestModule } from '../../shared/services/rest/rest.module';
import { NodeServiceModule } from './node.service.module';
import { UserServiceModule } from './user.service.module';
import { ComputeFieldReferenceManager } from '../services/datasheet/compute.field.reference.manager';
import { DatasheetChangesetService } from '../services/datasheet/datasheet.changeset.service';
import { DatasheetChangesetSourceService } from '../services/datasheet/datasheet.changeset.source.service';
import { DatasheetFieldHandler } from '../services/datasheet/datasheet.field.handler';
import { DatasheetMetaService } from '../services/datasheet/datasheet.meta.service';
import { DatasheetRecordAlarmService } from '../services/datasheet/datasheet.record.alarm.service';
import { DatasheetRecordService } from '../services/datasheet/datasheet.record.service';
import { DatasheetRecordSourceService } from '../services/datasheet/datasheet.record.source.service';
import { DatasheetRecordSubscriptionService } from '../services/datasheet/datasheet.record.subscription.service';
import { DatasheetService } from '../services/datasheet/datasheet.service';

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
