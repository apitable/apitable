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

import { mockRecordValues, mockRecords, mockDefaultRecord, mockRecordVoTransformer } from './mock.record';
import { MockDataBus, resetDataLoader } from './mock.databus';
import { IRecord } from 'exports/store/interfaces';
import { SegmentType } from 'types';
import { ExecuteResult } from 'command_manager';
import { CollaCommandName } from 'commands/enum';

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

    it('should return correct numbers of records', async () => {
      const dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      const view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();
      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(5);
    });

    it('should return correct records', async () => {
      const dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      const view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();
      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();

      const recordVos = records.map(record => record.getViewObject(mockRecordVoTransformer));

      expect(recordVos).toStrictEqual([
        {
          id: 'rec1',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 1' }],
            fld2: ['opt2', 'opt1'],
          },
          commentCount: 0,
        },
        {
          id: 'rec2',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 2' }],
            fld2: ['opt1'],
          },
          commentCount: 0,
        },
        {
          id: 'rec3',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 3' }],
            fld2: [],
          },
          commentCount: 1,
          comments: [
            {
              commentId: 'cmt1001',
              commentMsg: {
                content: 'foo',
                html: 'foo',
                type: 'dfs',
              },
              createdAt: 1669886283547,
              revision: 7,
              unitId: '100004',
            },
          ],
        },
        {
          id: 'rec4',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 4' }],
            fld2: ['opt3', 'opt2', 'opt1'],
          },
          commentCount: 0,
        },
        {
          id: 'rec5',
          data: {
            fld1: [{ type: SegmentType.Text, text: 'text 5' }],
            fld2: ['opt3'],
          },
          commentCount: 0,
        },
      ]);
    });
  });

  describe('add records', () => {
    beforeEach(resetDataLoader);

    it('should increment number of records after adding a record', async () => {
      let dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView('viw1');
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
      dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(6);
    });

    test('add a record before first record', async () => {
      let dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();
      const result = await view1!.addRecords(
        {
          index: 0,
          recordValues: [mockRecordValues[0]!],
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView('viw1');

      expect(view1).toBeTruthy();
      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(6);

      let firstRecordVo = records[0]!.getViewObject(mockRecordVoTransformer);
      firstRecordVo = assertRecordId(firstRecordVo, 'rec4');

      expect(firstRecordVo).toStrictEqual(mockRecords[0]);
    });

    test('add a record in middle', async () => {
      let dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();
      const result = await view1!.addRecords(
        {
          index: 1,
          recordValues: [mockRecordValues[0]!],
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(6);

      let recordVo = records[1]!.getViewObject(mockRecordVoTransformer);
      recordVo = assertRecordId(recordVo, 'rec4');

      expect(recordVo).toStrictEqual(mockRecords[0]);
    });

    test('add multiple records', async () => {
      let dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();
      const result = await view1!.addRecords(
        {
          index: 1,
          recordValues: mockRecordValues,
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(8);

      let recordVos = records.slice(1, 4).map(record => record.getViewObject(mockRecordVoTransformer));
      recordVos = assertRecordIds(recordVos, i => `rec${i + 4}`);

      expect(recordVos).toStrictEqual(mockRecords);
    });

    test('add multiple records by count', async () => {
      let dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      let view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();
      const result = await view1!.addRecords(
        {
          index: 1,
          count: 3,
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(8);

      const recordVos = records.slice(1, 4).map(record => record.getViewObject(mockRecordVoTransformer));
      let recordVo = assertRecordId(recordVos[0]!, 'rec4');
      expect(recordVo).toStrictEqual(mockDefaultRecord);

      recordVo = assertRecordId(recordVos[1]!, 'rec4');
      expect(recordVo).toStrictEqual(mockDefaultRecord);

      recordVo = assertRecordId(recordVos[2]!, 'rec4');
      expect(recordVo).toStrictEqual(mockDefaultRecord);
    });

    it('should be identical to addRecords via doCommand', async () => {
      let dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      const result = await dst1!.doCommand(
        {
          cmd: CollaCommandName.AddRecords,
          datasheetId: dst1!.id,
          viewId: 'viw1',
          index: 0,
          count: 1,
          cellValues: [mockRecordValues[0]!],
          ignoreFieldPermission: true,
        },
        {},
      );

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();
      const view1 = await dst1!.getView('viw1');
      expect(view1).toBeTruthy();

      const records = await view1!.getRecords({});

      expect(records).toBeTruthy();
      expect(records.length).toBe(6);

      let firstRecordVo = records[0]!.getViewObject(mockRecordVoTransformer);
      firstRecordVo = assertRecordId(firstRecordVo, 'rec4');

      expect(firstRecordVo).toStrictEqual(mockRecords[0]);
    });
  });
});
