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
import { Test, TestingModule } from '@nestjs/testing';
import { DatasheetRecordLazyAssociationService } from './datasheet.record.lazy.association.service';
import { DatasheetRecordLazyAssociationRepository } from '../repositories/datasheet.record.lazy.association.repository';
import { DatasheetRecordLazyAssociationEntity } from '../entities/datasheet.record.lazy.association.entity';
import { IRecordMap } from '@apitable/core';

describe('Record Lazy Association Service Test', () => {
  let module: TestingModule;
  let service: DatasheetRecordLazyAssociationService;
  // let repository: DatasheetRecordLazyAssociationRepository;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      providers: [
        DatasheetRecordLazyAssociationService,
        DatasheetRecordLazyAssociationRepository,
      ]
    }).compile();
    service = module.get<DatasheetRecordLazyAssociationService>(DatasheetRecordLazyAssociationService);
    // repository = module.get<DatasheetRecordLazyAssociationRepository>(DatasheetRecordLazyAssociationRepository);
  });

  beforeEach(() => {
  });

  describe('diffRecordAssociations', () => {
    const association1 = {
      id: '1',
      spaceId: 'space1',
      dstId: 'dst1',
      recordId: 'record1',
      depends: { field1: [{ datasheetId: '1', recordIds: ['value1', 'value2'] }, { datasheetId: '2', recordIds: ['value1', 'value2'] }] }
    } as DatasheetRecordLazyAssociationEntity;
    const association2 = {
      id: '2',
      spaceId: 'space2',
      dstId: 'dst2',
      recordId: 'record2',
      depends: { field1: [{ datasheetId: '3', recordIds: ['value1', 'value2'] }, { datasheetId: '4', recordIds: ['value1', 'value2'] }] }
    } as DatasheetRecordLazyAssociationEntity;
    const existingAssociation1 = {
      id: '3',
      spaceId: 'space1',
      dstId: 'dst3',
      recordId: 'record3',
      depends: { field1: [{ datasheetId: '1', recordIds: ['value1', 'value2'] }, { datasheetId: '2', recordIds: ['value1', 'value2'] }] }
    } as DatasheetRecordLazyAssociationEntity;
    const existingAssociation2 = {
      id: '4',
      spaceId: 'space2',
      dstId: 'dst4',
      recordId: 'record4',
      depends: { field1: [{ datasheetId: '3', recordIds: ['value1', 'value2'] }, { datasheetId: '4', recordIds: ['value1', 'value2'] }] }
    } as DatasheetRecordLazyAssociationEntity;
    const associations = [association1, association2];
    const existingAssociations = [existingAssociation1, existingAssociation2];
    
    it('should return new associations', () => {
      const result = service.diffRecordAssociations(associations, existingAssociations);
      expect(result.associationsAdded).toEqual([association1, association2]);
      expect(result.associationsUpdated).toEqual([]);
    });
    
    it('should return updated associations', () => {
      const updatedAssociation1 = {
        id: '3',
        spaceId: 'space1',
        dstId: 'dst3',
        recordId: 'record3',
        depends: { field1: [{ datasheetId: '3', recordIds: ['value1', 'value2'] }, { datasheetId: '4', recordIds: ['value1', 'value2'] }] }
      } as DatasheetRecordLazyAssociationEntity;
      const updatedExistingAssociations = [updatedAssociation1, existingAssociation2];
      const result = service.diffRecordAssociations(updatedExistingAssociations, existingAssociations);
      expect(result.associationsAdded).toEqual([]);
      expect(result.associationsUpdated).toEqual([updatedAssociation1]);
    });
    
    it('should return empty array', () => {
      const result = service.diffRecordAssociations(existingAssociations, existingAssociations);
      expect(result.associationsAdded).toEqual([]);
      expect(result.associationsUpdated).toEqual([]);
    });
  });

  describe('fillInRelatedRecordAssociations', () => {
    process.env.RECORD_LAZY_ASSOCIATION_MODE = 'true';
    const spaceId = 'spaceId';
    const datasheetId = 'datasheetId';
    const fieldIdToLinkDstIdMap = new Map<string, string>([
      ['field1', 'datasheet2'],
      ['field2', 'datasheet3'],
      ['field3', 'datasheet4'],
    ]);
    const recordMap: IRecordMap = {
      record1: {
        id: 'record1',
        data: { field1: ['record2', 'record3'], field2: ['record4'] },
        commentCount: 0,
        createdAt: 0,
        updatedAt: 0,
      },
      record2: {
        id: 'record2',
        data: { field3: ['record5'], field4: ['record6'] },
        commentCount: 0,
        createdAt: 0,
        updatedAt: 0,
      },
      record3: {
        id: 'record3',
        data: {},
        commentCount: 0,
        createdAt: 0,
        updatedAt: 0,
      },
      record4: {
        id: 'record4',
        data: { field1: [], field2: [] },
        commentCount: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    };
    const mainDatasheet = true;

    it('should fill in the current record lazy associations for the main datasheet', () => {

      const currentRecordLazyAssociations: DatasheetRecordLazyAssociationEntity[] = [];

      service.fillInRelatedRecordAssociations(spaceId, datasheetId, currentRecordLazyAssociations, fieldIdToLinkDstIdMap, recordMap, mainDatasheet);

      expect(currentRecordLazyAssociations).toEqual([
        {
          spaceId,
          dstId: datasheetId,
          recordId: 'record1',
          depends: {
            field1: [{ datasheetId: 'datasheet2', recordIds: ['record2', 'record3'] }],
            field2: [{ datasheetId: 'datasheet3', recordIds: ['record4'] }],
          },
        },
        {
          spaceId,
          dstId: datasheetId,
          recordId: 'record2',
          depends: {
            field3: [{ datasheetId: 'datasheet4', recordIds: ['record5'] }],
          },
        },
      ]);
    });

    it('should fill in the current record lazy associations for a related datasheet example 1', () => {
      const currentRecordLazyAssociations: DatasheetRecordLazyAssociationEntity[] = [];
      currentRecordLazyAssociations.push({
        spaceId,
        dstId: 'datasheet2',
        recordId: 'record2',
        depends: {
          field3: [{ datasheetId: datasheetId, recordIds: ['record1'] }],
          field4: [{ datasheetId: 'datasheet4', recordIds: ['record6'] }],
        },
        id: ''
      });

      currentRecordLazyAssociations.push({
        spaceId,
        dstId: 'datasheet2',
        recordId: 'record3',
        depends: {},
        id: ''
      });
  
      service.fillInRelatedRecordAssociations(spaceId, 'datasheet2', currentRecordLazyAssociations, fieldIdToLinkDstIdMap, recordMap, false);
  
      expect(currentRecordLazyAssociations).toEqual([
        {
          spaceId,
          dstId: 'datasheet2',
          recordId: 'record2',
          depends: {
            field3: [{ datasheetId: datasheetId, recordIds: ['record1'] }
              , { datasheetId: 'datasheet2', recordIds: ['record2', 'record3'] }
              , { datasheetId: 'datasheet3', recordIds: ['record4'] }
              , { datasheetId: 'datasheet4', recordIds: ['record5'] }],
            field4: [{ datasheetId: 'datasheet4', recordIds: ['record6'] }],
          },
          id: '',
        },
        {
          spaceId,
          dstId: 'datasheet2',
          recordId: 'record3',
          depends: {},
          id: '',
        },
      ]);
    });

  });
  
  describe('getDepends', () => {
    it('should return the correct record dependencies', () => {
      const recordData = { field1: ['record2', 'record3'], field2: [], field3: ['record4'] };
      const fieldIdToLinkDstIdMap = new Map<string, string>([
        ['field1', 'datasheet2'],
        ['field2', 'datasheet3'],
        ['field3', 'datasheet4'],
      ]);
  
      const depends = service.getDepends(recordData, fieldIdToLinkDstIdMap);
  
      expect(depends).toEqual({
        field1: [{ datasheetId: 'datasheet2', recordIds: ['record2', 'record3'] }],
        field3: [{ datasheetId: 'datasheet4', recordIds: ['record4'] }],
      });
    });
  
    it('should return an empty object if there are no record dependencies', () => {
      const recordData = { field1: [], field2: [], field3: [] };
      const fieldIdToLinkDstIdMap = new Map<string, string>([
        ['field1', 'datasheet2'],
        ['field2', 'datasheet3'],
        ['field3', 'datasheet4'],
      ]);
  
      const depends = service.getDepends(recordData, fieldIdToLinkDstIdMap);
  
      expect(depends).toEqual({});
    });
  });

});