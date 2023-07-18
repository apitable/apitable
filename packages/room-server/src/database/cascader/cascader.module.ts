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
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { NodeModule } from 'node/node.module';
import { CascaderController } from './controllers/cascader.controller';
import { UserModule } from 'user/user.module';
import { DatasheetCascaderFieldRepository } from './repositories/datasheet.cascader.field.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetFieldCascaderService } from './services/datasheet.field.cascader.service';
import { DatasheetFieldCascaderSnapshotService } from './services/datasheet.field.cascader.snapshot.service';
import { CommandModule } from 'database/command/command.module';
import { CascaderDatabusService } from './services/cascader.databus.service';
import { UnitModule } from 'unit/unit.module';

@Module({
  imports: [
    UserModule,
    UnitModule,
    DatasheetModule,
    forwardRef(() => NodeModule),
    CommandModule,
    TypeOrmModule.forFeature([DatasheetCascaderFieldRepository]),
  ],
  controllers: [CascaderController],
  providers: [DatasheetFieldCascaderService, DatasheetFieldCascaderSnapshotService, CascaderDatabusService],
})
export class CascaderModule {}
