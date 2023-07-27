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

import { DatasheetRepository } from './datasheet.repository';
import { DatasheetEntity } from '../entities/datasheet.entity';
import { DeepPartial, getConnection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { clearDatabase } from 'shared/testing/test-util';

describe('DatasheetRepositoryTest', () => {
  let moduleFixture: TestingModule;
  let repository: DatasheetRepository;
  let entity: DatasheetEntity;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([DatasheetRepository]),
      ],
      providers: [DatasheetRepository],
    }).compile();
    // clear database
    await clearDatabase(getConnection());
    repository = moduleFixture.get<DatasheetRepository>(DatasheetRepository);
    const datasheet: DeepPartial<DatasheetEntity> = {
      dstId: 'datasheetId',
      revision: 1,
    };
    const record = repository.create(datasheet);
    entity = await repository.save(record);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should get revisions by datasheet ids', async() => {
    const revisions = await repository.selectRevisionByDstIds([entity.dstId!]);
    expect(revisions.length).toEqual(1);
    expect(revisions[0]?.resourceId).toEqual(entity.dstId);
    expect(revisions[0]?.revision).toEqual('1');
  });
});