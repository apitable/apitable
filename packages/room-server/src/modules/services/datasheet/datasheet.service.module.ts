import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRecordSubscriptionEntity } from 'entities/datasheet.record.subscription.entity';
import { QueueWorkerModule } from 'modules/queue/queue.worker.module';
import { DatasheetChangesetRepository } from 'modules/repository/datasheet.changeset.repository';
import { DatasheetChangesetSourceRepository } from 'modules/repository/datasheet.changeset.source.repository';
import { DatasheetMetaRepository } from 'modules/repository/datasheet.meta.repository';
import { DatasheetRecordAlarmRepository } from 'modules/repository/datasheet.record.alarm.repository';
import { DatasheetRecordRepository } from 'modules/repository/datasheet.record.repository';
import { DatasheetRecordSourceRepository } from 'modules/repository/datasheet.record.source.repository';
import { DatasheetRecordSubscriptionRepository } from 'modules/repository/datasheet.record.subscription.repository';
import { DatasheetRepository } from 'modules/repository/datasheet.repository';
import { RecordCommentRepository } from 'modules/repository/record.comment.repository';
import { RecordCommentService } from 'modules/services/datasheet/record.comment.service';
import { JavaModule } from 'modules/services/java/java.module';
import { UnitServiceModule } from 'modules/services/unit/unit.service.module';
import { WidgetServiceModule } from 'modules/services/widget/widget.module';
import { RestModule } from '../../rest/rest.module';
import { NodeServiceModule } from '../node/node.service.module';
import { UserServiceModule } from '../user/user.service.module';
import { ComputeFieldReferenceManager } from './compute.field.reference.manager';
import { DatasheetChangesetService } from './datasheet.changeset.service';
import { DatasheetChangesetSourceService } from './datasheet.changeset.source.service';
import { DatasheetFieldHandler } from './datasheet.field.handler';
import { DatasheetMetaService } from './datasheet.meta.service';
import { DatasheetRecordAlarmService } from './datasheet.record.alarm.service';
import { DatasheetRecordService } from './datasheet.record.service';
import { DatasheetRecordSourceService } from './datasheet.record.source.service';
import { DatasheetRecordSubscriptionService } from './datasheet.record.subscription.service';
import { DatasheetService } from './datasheet.service';

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
