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

import { CollaCommandName } from 'commands';
import { ExecuteResult } from 'command_manager';
import { IRecord } from 'exports/store';
import { SegmentType } from 'types';
import { MockDataBus, mockDatasheetGenerate, resetDataLoader } from './mock.databus.generate';
import { mapToArray } from './mock.datasheets.generate';
import { mockRecordVoTransformer } from './mock.record';
import { mockGetViewInfo } from './mock.view';

const assertRecordId = (record: IRecord, newId: string): IRecord => {
  expect(record.id).toBeTruthy();
  expect(record.id.slice(0, 3)).toStrictEqual('rec');

  return { ...record, id: newId };
};

const assertRecordIds = (records: IRecord[], genId: (i: number) => string): IRecord[] => {
  return records.map((record, i) => assertRecordId(record, genId(i)));
};

const db = MockDataBus.getDatabase();

describe('record operations', () => {
  describe('get records', () => {
    beforeAll(resetDataLoader);

    it('should return correct numbers of records', async() => {
      const dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      const view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();
      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(mockDatasheetGenerate.sample.length);
    });

    it('should return correct records', async() => {
      const dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      const view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();
      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();

      const recordVos = records.map(record => record.getViewObject(mockRecordVoTransformer));

      expect(recordVos).toStrictEqual(mapToArray(mockDatasheetGenerate.recordMap()));
    });
  });

  describe('add records', () => {
    beforeEach(resetDataLoader);

    it('should increment number of records after adding a record', async() => {
      let dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
        
      const succeeded = await view1!.addRecords(
        {
          index: 0,
          recordValues: [
            {
              fld1: [{ type: SegmentType.Text, text: 'text4' }],
              fld2: ['opt2'],
            },
          ],
        },
        {},
      );

      expect(succeeded.result).toStrictEqual(ExecuteResult.Success);

      // TODO avoid redundant getDatasheet()
      dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(mockDatasheetGenerate.sample.length+1);
    });

    test('add a record before first record', async() => {
      let dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      
      let view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();

      const { recordValues, textFieldId, optionsFiledId } = mockDatasheetGenerate.createRecord();
    
      const result = await view1!.addRecords(
        {
          index: 0,
          recordValues: [recordValues],
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();
      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(mockDatasheetGenerate.sample.length+1);

      let firstRecordVo = records[0]!.getViewObject(mockRecordVoTransformer);
      firstRecordVo = assertRecordId(firstRecordVo, 'rec4');

      expect(firstRecordVo.id).toEqual('rec4');
      expect(Object.keys(firstRecordVo.data)).toEqual(expect.arrayContaining([textFieldId, optionsFiledId]));
      expect(firstRecordVo.data[textFieldId]).toStrictEqual(recordValues[textFieldId]);
      expect(firstRecordVo.data[optionsFiledId]).toStrictEqual(recordValues[optionsFiledId]);
    });

    test('add a record in middle', async() => {
      let dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();

      const { recordValues, textFieldId, optionsFiledId } = mockDatasheetGenerate.createRecord();
      
      const result = await view1!.addRecords(
        {
          index: 1,
          recordValues: [recordValues],
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(mockDatasheetGenerate.sample.length+1);

      let recordVo = records[1]!.getViewObject(mockRecordVoTransformer);
      recordVo = assertRecordId(recordVo, 'rec4');

      expect(recordVo.id).toEqual('rec4');
      expect(Object.keys(recordVo.data)).toEqual(expect.arrayContaining([textFieldId, optionsFiledId]));
      expect(recordVo.data[textFieldId]).toStrictEqual(recordValues[textFieldId]);
      expect(recordVo.data[optionsFiledId]).toStrictEqual(recordValues[optionsFiledId]);
    });

    test('add multiple records', async() => {
      let dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();
      const { recordValues, optionsFiledId, textFieldId } = mockDatasheetGenerate.createRecord();
      const result = await view1!.addRecords(
        {
          index: 1,
          recordValues: [recordValues, recordValues, recordValues],
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(mockDatasheetGenerate.sample.length + 3);

      let recordVos = records.slice(1, 4).map(record => record.getViewObject(mockRecordVoTransformer));
      recordVos = assertRecordIds(recordVos, i => `rec${i + 4}`);

      recordVos.forEach((record, i)=>{
        expect(record.id).toEqual(`rec${i+4}`);
        expect(Object.keys(record.data)).toEqual(expect.arrayContaining([textFieldId, optionsFiledId]));
        expect(record.data[textFieldId]).toStrictEqual(recordValues[textFieldId]);
        expect(record.data[optionsFiledId]).toStrictEqual(recordValues[optionsFiledId]);
      });
      
    });

    test('add multiple records by count', async() => {
      let dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();
      const result = await view1!.addRecords(
        {
          index: 1,
          count: 10,
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(mockDatasheetGenerate.sample.length+10);

      const recordVos = records.slice(1, 11).map(record => assertRecordId(record.getViewObject(mockRecordVoTransformer), 'rec4'));

      const defaultFieldData = mapToArray(mockDatasheetGenerate.fieldMap())
        .filter(item => item!.property && item!.property.defaultValue)!;

      const defaultDatas:Record<string, unknown> = {};
      defaultFieldData.forEach(item=>{
        defaultDatas[item!.id] = item!.property.defaultValue;
      });

      // if has defaultValue, record need has defaultValue
      recordVos.forEach(record=>{
        expect(record.id).toStrictEqual('rec4'); 
        expect(record.data).toStrictEqual(defaultDatas); 
      });

    });

    it('should be identical to addRecords via doCommand', async() => {
      let dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();

      const { recordValues, optionsFiledId, textFieldId } = mockDatasheetGenerate.createRecord();

      const result = await dst1!.doCommand(
        {
          cmd: CollaCommandName.AddRecords,
          datasheetId: dst1!.id,
          viewId: 'viw1',
          index: 0,
          count: 1,
          cellValues: [recordValues],
          ignoreFieldPermission: true,
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      const view1 = await dst1!.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(mockDatasheetGenerate.sample.length+1);

      let firstRecordVo = records[0]!.getViewObject(mockRecordVoTransformer);
      firstRecordVo = assertRecordId(firstRecordVo, 'rec4');

      expect(firstRecordVo.id).toEqual('rec4');
      expect(Object.keys(firstRecordVo.data)).toEqual(expect.arrayContaining([textFieldId, optionsFiledId]));
      expect(firstRecordVo.data[textFieldId]).toStrictEqual(recordValues[textFieldId]);
      expect(firstRecordVo.data[optionsFiledId]).toStrictEqual(recordValues[optionsFiledId]);
    });
  });
});
