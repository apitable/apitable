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

describe('Test', () => {
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
      dstId: 'dst1',
      recordId: 'record1',
      depends: { field1: [{ datasheetId: '1', recordIds: ['value1', 'value2'] }, { datasheetId: '2', recordIds: ['value1', 'value2'] }] }
    } as DatasheetRecordLazyAssociationEntity;
    const existingAssociation2 = {
      id: '4',
      spaceId: 'space2',
      dstId: 'dst2',
      recordId: 'record2',
      depends: { field1: [{ datasheetId: '3', recordIds: ['value1', 'value2'] }, { datasheetId: '4', recordIds: ['value1', 'value2'] }] }
    } as DatasheetRecordLazyAssociationEntity;
    const associations = [association1, association2];
    const existingAssociations = [existingAssociation1, existingAssociation2];
    
    it('should add new associations', () => {
      const result = service.diffRecordAssociations(associations, existingAssociations);
      expect(result.associationsAdded).toEqual([association1, association2]);
      expect(result.associationsUpdated).toEqual([]);
    });
    
    it('should update existing associations', () => {
      const updatedAssociation1 = {
        id: '3',
        spaceId: 'space1',
        dstId: 'dst1',
        recordId: 'record1',
        depends: { field1: [{ datasheetId: '3', recordIds: ['value1', 'value2'] }, { datasheetId: '4', recordIds: ['value1', 'value2'] }] }
      } as DatasheetRecordLazyAssociationEntity;
      const updatedExistingAssociations = [updatedAssociation1, existingAssociation2];
      const result = service.diffRecordAssociations(associations, updatedExistingAssociations);
      expect(result.associationsAdded).toEqual([]);
      expect(result.associationsUpdated).toEqual([updatedAssociation1]);
    });
    
    it('should not update existing associations if depends are the same', () => {
      const result = service.diffRecordAssociations(associations, existingAssociations);
      expect(result.associationsAdded).toEqual([]);
      expect(result.associationsUpdated).toEqual([]);
    });
  });

});