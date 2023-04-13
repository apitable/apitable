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

import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatasheetRecordLazyAssociationEntity } from '../entities/datasheet.record.lazy.association.entity';
import { DatasheetRecordLazyAssociationRepository } from './datasheet.record.lazy.association.repository';

describe('Datasheet Record Lazy Association Repository Test', () => {
  let module: TestingModule;
  let repository: DatasheetRecordLazyAssociationRepository;
  // arrange
  const associations: DatasheetRecordLazyAssociationEntity[] = [
    {
      id: '1',
      spaceId: 'spaceId',
      dstId: 'datasheetId',
      recordId: 'record1',
      depends: {
        field1: [
          { datasheetId: 'datasheet2', recordIds: ['record2', 'record3'] },
          { datasheetId: 'datasheet3', recordIds: ['record4', 'record5'] },
        ],
        field2: [{ datasheetId: 'datasheet4', recordIds: ['record6'] }],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      spaceId: 'spaceId',
      dstId: 'datasheetId',
      recordId: 'record2',
      depends: {
        field3: [
          { datasheetId: 'datasheet1', recordIds: ['record1', 'record2'] },
          { datasheetId: 'datasheet4', recordIds: ['record6'] },
        ],
        field4: [{ datasheetId: 'datasheet3', recordIds: ['record4'] }],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([DatasheetRecordLazyAssociationRepository]),
      ],
      providers: [DatasheetRecordLazyAssociationRepository],
    }).compile();
    repository = module.get<DatasheetRecordLazyAssociationRepository>(DatasheetRecordLazyAssociationRepository);
  });

  beforeEach(async() => {
    await repository.save(associations);
  });

  afterEach(async() => {
    const ids = associations.map((association) => association.id);
    await repository.delete(ids);
  });

  afterAll(async() => {
    await repository.manager.connection.close();
  });

  describe('selectRecordAssociations', () => {
    const spaceId = 'spaceId';
    const datasheetId = 'datasheetId';
    const recordIds = ['record1', 'record2'];

    it('should return an array of associations', async() => {
      // act
      const result = await repository.selectRecordAssociations(spaceId, datasheetId, recordIds);
      // assert
      expect(result.length).toEqual(2);
      expect(result).toEqual(associations);
    });
  });
});