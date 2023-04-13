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
import { DatasheetRecordEntity } from '../entities/datasheet.record.entity';
import { DatasheetRecordRepository } from './datasheet.record.repository';

describe('Datasheet Record Repository Test', () => {
  let module: TestingModule;
  let repository: DatasheetRecordRepository;
  const records: DatasheetRecordEntity[] = [
    { id: '1', recordId: 'record1', dstId: 'dst1', data: {}, revision: 1, isDeleted: false },
    { id: '2', recordId: 'record2', dstId: 'dst1', data: {}, revision: 1, isDeleted: false },
    { id: '3', recordId: 'record3', dstId: 'dst1', data: {}, revision: 1, isDeleted: false },
    { id: '4', recordId: 'record1', dstId: 'dst2', data: {}, revision: 1, isDeleted: true },
    { id: '5', recordId: 'record2', dstId: 'dst2', data: {}, revision: 1, isDeleted: true },
    { id: '6', recordId: 'record3', dstId: 'dst2', data: {}, revision: 1, isDeleted: true },
  ] as DatasheetRecordEntity[];

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([DatasheetRecordRepository]),
      ],
      providers: [DatasheetRecordRepository],
    }).compile();
    repository = module.get<DatasheetRecordRepository>(DatasheetRecordRepository);
  });

  beforeEach(async() => {
    await repository.save(records);
  });

  afterEach(async() => {
    const ids = records.map((record) => record.id);
    await repository.delete(ids);
  });

  afterAll(async() => {
    await repository.manager.connection.close();
  });

  describe('selectIdsByDstIdAndRecordIds', () => {
    it('should return matching record IDs', async() => {
  
      // call the function being tested
      const result = await repository.selectIdsByDstIdAndRecordIds('dst1', ['record1', 'record3']);
  
      // assert that the result is as expected
      expect(result?.length).toEqual(2);
    });
  
    it('should return empty array if no matching record IDs found', async() => {

      // call the function being tested
      const result = await repository.selectIdsByDstIdAndRecordIds('dst1', ['record4', 'record5']);
  
      // assert that the result is as expected
      expect(result?.length).toEqual(0);
    });
  });

  describe('selectRecordsDataByDstId', () => {
    it('should return an array of DatasheetRecordEntity objects when given a valid dstId', async() => {
      const result = await repository.selectRecordsDataByDstId('dst1');
      expect(result?.length).toBeGreaterThan(0);
    });

    it('should return empty array when given an invalid dstId', async() => {
      const dstId = 'invalidDstId';
      const result = await repository.selectRecordsDataByDstId(dstId);
      expect(result?.length).toEqual(0);
    });

    it('should return empty array if no records found for the dstId, only deleted records exist', async() => {
      // Retrieve records data by dstId
      const recordsData = await repository.selectRecordsDataByDstId('dst2');
  
      // Assert the returned data is empty
      expect(recordsData).toEqual([]);
    });
  });
  
  describe('selectRecordsDataByDstIdIgnoreDeleted method', () => {
  
    it('should return records data by dstId without filtering deleted records', async() => {
      // Retrieve records data by dstId
      const recordsData = await repository.selectRecordsDataByDstIdIgnoreDeleted('dst1');
  
      // Assert the returned data is correct
      expect(recordsData).toHaveLength(3);
    });
  
    it('should return empty array if no records found for the dstId', async() => {
      // Retrieve records data by dstId
      const recordsData = await repository.selectRecordsDataByDstIdIgnoreDeleted('dst2');
  
      // Assert the returned data is empty
      expect(recordsData?.length).toEqual(3);
    });

  });
 
});