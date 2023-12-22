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

import { ExecuteResult, ExecuteType, ICollaCommandExecuteSuccessResult } from 'command_manager';
import { ICommandExecutionSuccessResult } from '../logic';
import { ViewType } from 'modules/shared/store/constants';
import { ResourceType, SegmentType } from 'types';
import { MockDataBus, resetDataLoader } from './mock.databus';
import { mockOperationOfAddRecords } from './mock.record';
import { IOperation, OTActionName } from 'engine';
import { CollaCommandName } from 'commands/enum';

const db = MockDataBus.getDatabase();

describe('view info', () => {
  beforeAll(resetDataLoader);

  test('basic view info', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    expect(view1!.id).toStrictEqual('viw1');
    expect(view1!.type).toStrictEqual(ViewType.Grid);
    expect(view1!.name).toStrictEqual('view 1');
    expect(view1!.columns).toStrictEqual([{ fieldId: 'fld1' }, { fieldId: 'fld2' }]);
    expect(view1!.rows).toStrictEqual([{ recordId: 'rec1' }, { recordId: 'rec2' }, { recordId: 'rec3' }, { recordId: 'rec4' }, { recordId: 'rec5' }]);
  });
});

describe('getFields', () => {
  it('should not include hidden fields by default', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view2 = await dst1!.getView('viw2');
    expect(view2).toBeTruthy();

    expect(view2!.id).toStrictEqual('viw2');

    const fields = await view2!.getFields({});

    const fieldIds = fields.map(field => field.id);

    expect(fieldIds).toStrictEqual(['fld1']);
  });

  it('should include hidden fields if includeHidden is true', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view2 = await dst1!.getView('viw2');
    expect(view2).toBeTruthy();

    expect(view2!.id).toStrictEqual('viw2');

    const fields = await view2!.getFields({
      includeHidden: true,
    });

    const fieldIds = fields.map(field => field.id);

    expect(fieldIds).toStrictEqual(['fld1', 'fld2']);
  });
});

describe('getRecords', () => {
  it('should return records in order of rows in the view', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view2 = await dst1!.getView('viw2');
    expect(view2).toBeTruthy();

    const records = await view2!.getRecords({});

    const recordIds = records.map(record => record.id);

    expect(recordIds).toStrictEqual(['rec2', 'rec3', 'rec5', 'rec1', 'rec4']);
  });

  test('maxRecords limit number of records', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view2 = await dst1!.getView('viw2');
    expect(view2).toBeTruthy();

    const records = await view2!.getRecords({
      maxRecords: 3,
    });

    const recordIds = records.map(record => record.id);

    expect(recordIds).toStrictEqual(['rec2', 'rec3', 'rec5']);
  });

  test('maxRecords > total number of records', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view2 = await dst1!.getView('viw2');
    expect(view2).toBeTruthy();

    const records = await view2!.getRecords({
      maxRecords: 20,
    });

    const recordIds = records.map(record => record.id);

    expect(recordIds).toStrictEqual(['rec2', 'rec3', 'rec5', 'rec1', 'rec4']);
  });

  describe('pagination', () => {
    test('pageNum = 1, pageSize = 3', async () => {
      const dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();

      const view2 = await dst1!.getView('viw2');
      expect(view2).toBeTruthy();

      const records = await view2!.getRecords({
        pagination: {
          pageNum: 1,
          pageSize: 3,
        },
      });

      const recordIds = records.map(record => record.id);

      expect(recordIds).toStrictEqual(['rec2', 'rec3', 'rec5']);
    });

    test('pageNum = 1, pageSize = 0', async () => {
      const dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();

      const view2 = await dst1!.getView('viw2');
      expect(view2).toBeTruthy();

      const records = await view2!.getRecords({
        pagination: {
          pageNum: 1,
          pageSize: 0,
        },
      });

      const recordIds = records.map(record => record.id);

      expect(recordIds).toStrictEqual([]);
    });

    test('pageNum = 1, pageSize = 0', async () => {
      const dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();

      const view2 = await dst1!.getView('viw2');
      expect(view2).toBeTruthy();

      const records = await view2!.getRecords({
        pagination: {
          pageNum: 1,
          pageSize: 0,
        },
      });

      const recordIds = records.map(record => record.id);

      expect(recordIds).toStrictEqual([]);
    });

    test('pageNum = 2, pageSize = 2', async () => {
      const dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();

      const view2 = await dst1!.getView('viw2');
      expect(view2).toBeTruthy();

      const records = await view2!.getRecords({
        pagination: {
          pageNum: 2,
          pageSize: 2,
        },
      });

      const recordIds = records.map(record => record.id);

      expect(recordIds).toStrictEqual(['rec5', 'rec1']);
    });

    test('pageNum = 2, pageSize = 3', async () => {
      const dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();

      const view2 = await dst1!.getView('viw2');
      expect(view2).toBeTruthy();

      const records = await view2!.getRecords({
        pagination: {
          pageNum: 2,
          pageSize: 3,
        },
      });

      const recordIds = records.map(record => record.id);

      expect(recordIds).toStrictEqual(['rec1', 'rec4']);
    });

    test('pageNum = 3, pageSize = 3', async () => {
      const dst1 = await db.getDatasheet('dst1', {
        loadOptions: {},
        storeOptions: {},
      });
      expect(dst1).toBeTruthy();

      const view2 = await dst1!.getView('viw2');
      expect(view2).toBeTruthy();

      const records = await view2!.getRecords({
        pagination: {
          pageNum: 3,
          pageSize: 3,
        },
      });

      const recordIds = records.map(record => record.id);

      expect(recordIds).toStrictEqual([]);
    });
  });

  test('maxRecords = 4 and pagnation: pageNum = 2, pageSize = 3', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view2 = await dst1!.getView('viw2');
    expect(view2).toBeTruthy();

    const records = await view2!.getRecords({
      maxRecords: 4,
      pagination: {
        pageNum: 2,
        pageSize: 3,
      },
    });

    const recordIds = records.map(record => record.id);

    expect(recordIds).toStrictEqual(['rec1']);
  });
});

describe('addRecords', () => {
  beforeEach(resetDataLoader);

  test('add two records with count', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    const result = await view1!.addRecords(
      {
        index: 3,
        count: 2,
      },
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICollaCommandExecuteSuccessResult<string[]>).data).toBeTruthy();
    expect((result as ICollaCommandExecuteSuccessResult<string[]>).data!.length).toBe(2);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    const recordIds = (result as ICollaCommandExecuteSuccessResult<string[]>).data!;

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation = mockOperationOfAddRecords([
      {
        id: recordIds[0]!,
        rows: [
          { view: 0, index: 3 },
          { view: 1, index: 5 },
          { view: 2, index: 5 },
        ],
      },
      {
        id: recordIds[1]!,
        rows: [
          { view: 0, index: 4 },
          { view: 1, index: 6 },
          { view: 2, index: 6 },
        ],
      },
    ]);

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
      saveResult: [
        {
          baseRevision: 12,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
    });
  });

  test('add two records with recordValues', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    const result = await view1!.addRecords(
      {
        index: 3,
        recordValues: [
          {
            fld1: [{ type: SegmentType.Text, text: 'first' }],
            fld2: ['opt2', 'opt1'],
          },
          {
            fld1: [{ type: SegmentType.Text, text: 'second' }],
            fld2: [],
          },
        ],
      },
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICollaCommandExecuteSuccessResult<string[]>).data).toBeTruthy();
    expect((result as ICollaCommandExecuteSuccessResult<string[]>).data!.length).toBe(2);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    const recordIds = (result as ICollaCommandExecuteSuccessResult<string[]>).data!;

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation = mockOperationOfAddRecords([
      {
        id: recordIds[0]!,
        rows: [
          { view: 0, index: 3 },
          { view: 1, index: 5 },
          { view: 2, index: 5 },
        ],
        values: {
          fld1: [{ type: SegmentType.Text, text: 'first' }],
          fld2: ['opt2', 'opt1'],
        },
      },
      {
        id: recordIds[1]!,
        rows: [
          { view: 0, index: 4 },
          { view: 1, index: 6 },
          { view: 2, index: 6 },
        ],
        values: {
          fld1: [{ type: SegmentType.Text, text: 'second' }],
          fld2: [],
        },
      },
    ]);

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
      saveResult: [
        {
          baseRevision: 12,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
    });
  });
});

describe('modify view', () => {
  beforeEach(resetDataLoader);

  test('modify view name', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    const result = await view1!.modify(
      {
        key: 'name',
        value: 'VIEW_1',
      },
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      cmd: CollaCommandName.ModifyViews,
      actions: [
        {
          n: OTActionName.ObjectReplace,
          od: 'view 1',
          oi: 'VIEW_1',
          p: ['meta', 'views', 0, 'name'],
        },
      ],
    };

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
      saveResult: [
        {
          baseRevision: 12,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
    });
  });

  test('modify view columns', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    const result = await view1!.modify(
      {
        key: 'columns',
        value: [{ fieldId: 'fld2', hidden: true }],
      },
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      cmd: CollaCommandName.ModifyViews,
      actions: [
        {
          n: OTActionName.ListReplace,
          ld: { fieldId: 'fld2' },
          li: { fieldId: 'fld2', hidden: true },
          p: ['meta', 'views', 0, 'columns', 1],
        },
      ],
    };

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
      saveResult: [
        {
          baseRevision: 12,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
    });
  });
});

describe('delete view', () => {
  beforeEach(resetDataLoader);

  test('delete single view', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');
    expect(view1).toBeTruthy();

    const result = await view1!.delete({});

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      cmd: CollaCommandName.DeleteViews,
      actions: [
        {
          n: OTActionName.ListDelete,
          ld: {
            id: 'viw1',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2' }],
            frozenColumnCount: 1,
            name: 'view 1',
            rows: [{ recordId: 'rec1' }, { recordId: 'rec2' }, { recordId: 'rec3' }, { recordId: 'rec4' }, { recordId: 'rec5' }],
          },
          p: ['meta', 'views', 0],
        },
      ],
    };

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
      saveResult: [
        {
          baseRevision: 12,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'dst1',
          resourceType: 0,
        },
      ],
    });
  });
});
