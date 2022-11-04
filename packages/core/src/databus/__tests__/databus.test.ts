import { DataBus, DatasheetEventType, IDatasheetDataChangeEvent, Datasheet } from '../';
import { IReduxState, Reducers } from '../../store';
import { CollaCommandName } from '../../commands';
import { SegmentType } from '../../types';
import { createStore, applyMiddleware } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { MockDataLoader } from './mock.data.loader';
import { mockCommandHandler } from './mock.command.handler';


describe('record operations', () => {
  describe('get records', () => {
    const mockStore = createStore<IReduxState, any, unknown, unknown>(
      Reducers.rootReducers,
      applyMiddleware(thunkMiddleware, batchDispatchMiddleware),
    );

    beforeAll(() => {
      const loader = new MockDataLoader();
      DataBus.setDataLoader(loader);
      DataBus.setCommandHandler(mockCommandHandler(loader));
    });

    it('should return correct numbers of records', async () => {
      const db = await DataBus.getDatabase({});
      const dst1 = await db.getDatasheet('dst1', {
        store: mockStore,
      });
      const records = await dst1.getRecords('viw1');

      expect(records).toBeDefined();
      expect(records.length).toBe(3);
    });

    it('should return correct records', async () => {
      const db = await DataBus.getDatabase({});
      const dst1 = await db.getDatasheet('dst1', {
        store: mockStore,
      });
      const records = await dst1.getRecords('viw1');

      expect(records).toBeDefined();

      const recordJsons = await Promise.all(records.map(record => record.getDataSource()));

      expect(recordJsons).toStrictEqual([
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
    const mockStore = createStore<IReduxState, any, unknown, unknown>(
      Reducers.rootReducers,
      applyMiddleware(thunkMiddleware, batchDispatchMiddleware),
    );

    const addEventHandlers = (dst: Datasheet) => {
      dst.addEventHandler({
        type: DatasheetEventType.DataChange,
        async handle(_event: IDatasheetDataChangeEvent): Promise<void> {
          // TODO handle datasheet command
        },
      });
    };

    beforeEach(() => {
      const loader = new MockDataLoader();
      DataBus.setDataLoader(loader);
      DataBus.setCommandHandler(mockCommandHandler(loader));
    });

    it('should increment number of records', async () => {
      const db = await DataBus.getDatabase({});
      const dst1 = await db.getDatasheet('dst1', {
        store: mockStore,
      });
      addEventHandlers(dst1);
      const succeeded = await dst1.addRecord({
        viewId: 'viw1',
        cellValues: {
          fld1: [{ type: SegmentType.Text, text: 'text4' }],
          fld2: ['opt2'],
        },
      });

      expect(succeeded).toBeTruthy();

      const records = await dst1.getRecords('viw1');

      expect(records).toBeDefined();
      expect(records.length).toBe(4);
    });

    it('should be last record', async () => {
      const db = await DataBus.getDatabase({});
      const dst1 = await db.getDatasheet('dst1', {
        store: mockStore,
      });
      addEventHandlers(dst1);
      const succeeded = await dst1.addRecord({
        viewId: 'viw1',
        cellValues: {
          fld1: [{ type: SegmentType.Text, text: 'text4' }],
          fld2: ['opt2'],
        },
      });

      expect(succeeded).toBeTruthy();

      const records = await dst1.getRecords('viw1');

      expect(records).toBeDefined();
      expect(records.length).toBe(4);
      expect(records[records.length - 1].getDataSource()).toStrictEqual({
        id: 'rec4', // TODO who is responsible for generating this id?
        data: {
          fld1: [{ type: SegmentType.Text, text: 'text4' }],
          fld2: ['opt2'],
        },
        commentCount: 0,
      });
    });

    it('should be identical to addRecord via doComman', async () => {
      const db = await DataBus.getDatabase({});
      const dst1 = await db.getDatasheet('dst1', {
        store: mockStore,
      });
      await dst1.doCommand({
        cmd: CollaCommandName.AddRecords,
        datasheetId: dst1.id,
        viewId: 'viw1',
        index: 0,
        count: 1,
        cellValues: [
          {
            fld1: [{ type: SegmentType.Text, text: 'text4' }],
            fld2: ['opt2'],
          },
        ],
        ignoreFieldPermission: true,
      });

      const records = await dst1.getRecords('viw1');

      expect(records).toBeDefined();
      expect(records.length).toBe(4);
      expect(records[records.length - 1].getDataSource()).toStrictEqual({
        id: 'rec4', // TODO who is responsible for generating this id?
        data: {
          fld1: [{ type: SegmentType.Text, text: 'text4' }],
          fld2: ['opt2'],
        },
        commentCount: 0,
      });
    });
  });
});
