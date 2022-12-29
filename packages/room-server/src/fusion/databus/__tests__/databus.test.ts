import { DataBus } from '..';
import { CollaCommandName, ExecuteResult, IRecord, SegmentType } from '@apitable/core';
import { MockDataLoader } from './mock.data.loader';
import { MockStoreProvider } from './mock.store.provider';
import { mockGetViewInfo } from './mock.view';
import { mockRecordCellValues, mockRecordValue, mockRecordVoTransformer } from './mock.record';

const assertRecordId = (record: IRecord, newId: string): IRecord => {
  expect(record.id).toBeDefined();
  expect(record.id.slice(0, 3)).toStrictEqual('rec');

  return { ...record, id: newId };
};

describe('record operations', () => {
  describe('get records', () => {
    const db = DataBus.getDatabase();

    beforeAll(() => {
      const loader = new MockDataLoader();
      db.setDataLoader(loader);
      db.setStoreProvider(new MockStoreProvider());
    });

    it('should return correct numbers of records', async () => {
      const dst1 = await db.getDatasheet('dst1', {});
      const view1 = await dst1.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      const records = await view1.getRecords({});

      expect(records).toBeDefined();
      expect(records.length).toBe(3);
    });

    it('should return correct records', async () => {
      const dst1 = await db.getDatasheet('dst1', {});
      const view1 = await dst1.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      const records = await view1.getRecords({});

      expect(records).toBeDefined();

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
          commentCount: 0,
        },
      ]);
    });
  });

  describe('new record', () => {
    const db = DataBus.getDatabase();
    const loader = new MockDataLoader();

    beforeAll(() => {
      db.setDataLoader(loader);
      db.setStoreProvider(new MockStoreProvider());
    });

    beforeEach(() => {
      loader.reset();
    });

    it('should increment number of records', async () => {
      let dst1 = await db.getDatasheet('dst1', {});
      loader.addDatasheetEventHandlers(dst1);
      let view1 = await dst1.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      const succeeded = await view1.addRecords({
        index: 0,
        recordValues: [
          {
            fld1: [{ type: SegmentType.Text, text: 'text4' }],
            fld2: ['opt2'],
          },
        ],
      });

      expect(succeeded.result).toStrictEqual(ExecuteResult.Success);

      // TODO avoid redundant getDatasheet()
      dst1 = await db.getDatasheet('dst1', {});
      view1 = await dst1.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });

      const records = await view1.getRecords({});

      expect(records).toBeDefined();
      expect(records.length).toBe(4);
    });

    it('should be first record', async () => {
      let dst1 = await db.getDatasheet('dst1', {});
      loader.addDatasheetEventHandlers(dst1);
      let view1 = await dst1.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });
      const result = await view1.addRecords({
        index: 0,
        recordValues: [mockRecordCellValues],
      });

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {});
      view1 = await dst1.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });

      const records = await view1.getRecords({});

      expect(records).toBeDefined();
      expect(records.length).toBe(4);

      let firstRecordVo = records[0].getViewObject(mockRecordVoTransformer);
      firstRecordVo = assertRecordId(firstRecordVo, 'rec4');

      expect(firstRecordVo).toStrictEqual(mockRecordValue);
    });

    it('should be identical to addRecord via doCommand', async () => {
      let dst1 = await db.getDatasheet('dst1', {});
      loader.addDatasheetEventHandlers(dst1);
      const result = await dst1.doCommand({
        cmd: CollaCommandName.AddRecords,
        datasheetId: dst1.id,
        viewId: 'viw1',
        index: 0,
        count: 1,
        cellValues: [mockRecordCellValues],
        ignoreFieldPermission: true,
      });

      expect(result.result).toStrictEqual(ExecuteResult.Success);

      dst1 = await db.getDatasheet('dst1', {});
      const view1 = await dst1.getView({
        getViewInfo: mockGetViewInfo('dst1', 'viw1'),
      });

      const records = await view1.getRecords({});

      expect(records).toBeDefined();
      expect(records.length).toBe(4);

      let firstRecordVo = records[0].getViewObject(mockRecordVoTransformer);
      firstRecordVo = assertRecordId(firstRecordVo, 'rec4');

      expect(firstRecordVo).toStrictEqual(mockRecordValue);
    });
  });
});
