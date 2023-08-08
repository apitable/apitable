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

import { DeepPartial, getConnection } from 'typeorm';
import { WidgetRepository } from './widget.repository';
import { WidgetEntity } from '../entities/widget.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { clearDatabase } from 'shared/testing/test-util';

describe('DatasheetRepositoryTest', () => {
  let moduleFixture: TestingModule;
  let repository: WidgetRepository;
  let entity: WidgetEntity;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([WidgetRepository]),
      ],
    }).compile();

    // clear database
    await clearDatabase(getConnection());
    repository = moduleFixture.get<WidgetRepository>(WidgetRepository);
    const widgetEntity: DeepPartial<WidgetEntity> = {
      widgetId: 'widgetId',
      revision: 1,
    };
    const record = repository.create(widgetEntity);
    entity = await repository.save(record);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });
  
  it('should get revisions by widget ids', async() => {
    const resourceRevisions = await repository.getRevisionByWdtIds([entity.widgetId]);
    expect(resourceRevisions.length).toEqual(1);
    expect(resourceRevisions[0]?.resourceId).toEqual(entity.widgetId);
    expect(resourceRevisions[0]?.revision).toEqual('1');
  });
});