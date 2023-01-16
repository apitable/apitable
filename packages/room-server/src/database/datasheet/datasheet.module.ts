/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'database/command/command.module';
import { NodeModule } from 'node/node.module';
import { ResourceModule } from 'database/resource/resource.module';
import { SubscriptionDynamicModule } from 'database/subscription/subscription.dynamic.module';
import { UnitModule } from 'unit/unit.module';
import { UserModule } from 'user/user.module';
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
