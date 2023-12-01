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

import { mockDatasheetMap } from './mock.datasheets';
import { MockDataBus, resetDataLoader } from './mock.databus';
import { DateFormat, FieldType, ResourceType, SegmentType, TimeFormat } from 'types';
import { CollaCommandName } from 'commands/enum';
import { ExecuteFailReason, ExecuteResult, ExecuteType, ICollaCommandExecuteSuccessResult } from 'command_manager';
import { ICommandExecutionSuccessResult } from 'databus/logic';
import { mockOperationOfAddRecords } from './mock.record';
import { IOperation, OTActionName } from 'engine';
import { IGanttViewStyle, IViewProperty } from 'exports/store/interfaces';
import { ViewType } from 'modules/shared/store/constants';
const db = MockDataBus.getDatabase();

beforeAll(resetDataLoader);

describe('datasheet info', () => {
  test('basic datasheet info', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    expect(dst1!.id).toStrictEqual('dst1');
    expect(dst1!.type).toStrictEqual(ResourceType.Datasheet);
    expect(dst1!.revision).toStrictEqual(12);
    expect(dst1!.name).toStrictEqual('datasheet 1');
    expect(dst1!.snapshot).toStrictEqual(mockDatasheetMap['dst1']!.snapshot);
  });
});

describe('get view', () => {
  it('should return View for existing view', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw1');

    expect(view1).toBeTruthy();
    expect(view1!.id).toStrictEqual('viw1');
  });

  it('should return null if view does not exist', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView('viw100');

    expect(view1).toBeNull();
  });
});

describe('doCommand', () => {
  beforeEach(resetDataLoader);

  it('should return success if command execution succeeded', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.doCommand(
      {
        cmd: CollaCommandName.AddRecords,
        viewId: 'viw1',
        index: 3,
        count: 1,
      },
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);
  });

  it('should fail if count != cellValues.length when adding records', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.doCommand(
      {
        cmd: CollaCommandName.AddRecords,
        viewId: 'viw1',
        index: 3,
        count: 1,
        cellValues: [],
      },
      {},
    );

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.Fail,
      reason: ExecuteFailReason.ActionError,
    });
  });

  it('should return none when adding zero records', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.doCommand(
      {
        cmd: CollaCommandName.AddRecords,
        viewId: 'viw1',
        index: 3,
        count: 0,
      },
      {},
    );

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.None,
    });
  });
});

describe('addRecords', () => {
  beforeEach(resetDataLoader);

  test('add two records with count in viw1', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.addRecords(
      {
        viewId: 'viw1',
        index: 3,
        count: 2,
      },
      {},
    );

    // TODO these assertions are almost identical to those in view.test, refactor them out.
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

    const result = await dst1!.addRecords(
      {
        viewId: 'viw1',
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

    // TODO these assertions are almost identical to those in view.test, refactor them out.
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

describe('updateRecords', () => {
  beforeEach(resetDataLoader);

  test('update rec2:fld2', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.updateRecords(
      [
        {
          recordId: 'rec2',
          fieldId: 'fld2',
          value: ['opt3', 'opt2'],
        },
      ],
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<void>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<void>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<void>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          n: OTActionName.ObjectReplace,
          od: ['opt1'],
          oi: ['opt3', 'opt2'],
          p: ['recordMap', 'rec2', 'data', 'fld2'],
        },
      ],
      cmd: CollaCommandName.SetRecords,
      fieldTypeMap: {
        fld2: 4,
      },
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

describe('deleteRecords', () => {
  beforeEach(resetDataLoader);

  test('delete rec2', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.deleteRecords(['rec2'], {});

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<void>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<void>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<void>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          ld: {
            recordId: 'rec2',
          },
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 0, 'rows', 1],
        },
        {
          ld: {
            recordId: 'rec2',
          },
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 1, 'rows', 0],
        },
        {
          ld: {
            recordId: 'rec2',
          },
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 2, 'rows', 2],
        },
        {
          n: OTActionName.ObjectDelete,
          od: {
            commentCount: 0,
            data: {
              fld1: [
                {
                  text: 'text 2',
                  type: 1,
                },
              ],
              fld2: ['opt1'],
            },
            id: 'rec2',
          },
          p: ['recordMap', 'rec2'],
        },
      ],
      cmd: CollaCommandName.DeleteRecords,
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

describe('addFields', () => {
  beforeEach(resetDataLoader);

  test('add a datetime field', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.addFields(
      [
        {
          index: 2,
          data: {
            name: 'field 3',
            type: FieldType.DateTime,
            property: {
              dateFormat: DateFormat['YYYY-MM'],
              timeFormat: TimeFormat['HH:mm'],
              includeTime: false,
              autoFill: false,
            },
          },
        },
      ],
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICollaCommandExecuteSuccessResult<string>).data).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<any>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<any>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId).toBeTruthy();

    const fieldId = (result as ICollaCommandExecuteSuccessResult<string>).data!;

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          li: {
            fieldId,
            hidden: false,
          },
          n: OTActionName.ListInsert,
          p: ['meta', 'views', 0, 'columns', 2],
        },
        {
          li: {
            fieldId,
            hidden: true,
          },
          n: OTActionName.ListInsert,
          p: ['meta', 'views', 1, 'columns', 2],
        },
        {
          li: {
            fieldId,
            hidden: false,
          },
          n: OTActionName.ListInsert,
          p: ['meta', 'views', 2, 'columns', 2],
        },
        {
          n: OTActionName.ObjectInsert,
          oi: {
            id: fieldId,
            name: 'field 3',
            property: {
              autoFill: false,
              dateFormat: 3,
              includeTime: false,
              timeFormat: 0,
            },
            type: 5,
          },
          p: ['meta', 'fieldMap', fieldId],
        },
      ],
      cmd: CollaCommandName.AddFields,
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

describe('deleteFields', () => {
  beforeEach(resetDataLoader);

  test('delete fld2', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.deleteFields(
      [
        {
          fieldId: 'fld2',
        },
      ],
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<void>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<void>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<void>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          n: OTActionName.ObjectDelete,
          od: ['opt2', 'opt1'],
          p: ['recordMap', 'rec1', 'data', 'fld2'],
        },
        {
          n: OTActionName.ObjectDelete,
          od: ['opt1'],
          p: ['recordMap', 'rec2', 'data', 'fld2'],
        },
        {
          n: OTActionName.ObjectDelete,
          od: [],
          p: ['recordMap', 'rec3', 'data', 'fld2'],
        },
        {
          n: OTActionName.ObjectDelete,
          od: ['opt3', 'opt2', 'opt1'],
          p: ['recordMap', 'rec4', 'data', 'fld2'],
        },
        {
          n: OTActionName.ObjectDelete,
          od: ['opt3'],
          p: ['recordMap', 'rec5', 'data', 'fld2'],
        },
        {
          ld: {
            fieldId: 'fld2',
          },
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 0, 'columns', 1],
        },
        {
          ld: {
            fieldId: 'fld2',
            hidden: true,
          },
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 1, 'columns', 1],
        },
        {
          ld: { fieldId: 'fld2' },
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 2, 'columns', 1],
        },
        {
          n: OTActionName.ObjectDelete,
          od: {
            id: 'fld2',
            name: 'field 2',
            property: {
              defaultValue: ['opt2', 'opt1'],
              options: [
                {
                  color: 0,
                  id: 'opt1',
                  name: 'option 1',
                },
                {
                  color: 1,
                  id: 'opt2',
                  name: 'option 2',
                },
                {
                  color: 2,
                  id: 'opt3',
                  name: 'option 3',
                },
              ],
            },
            type: 4,
          },
          p: ['meta', 'fieldMap', 'fld2'],
        },
      ],
      cmd: CollaCommandName.DeleteField,
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

describe('updateField', () => {
  beforeEach(resetDataLoader);

  test('delete fld2', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.updateField(
      {
        id: 'fld2',
        name: 'FIELD 2',
        type: FieldType.MultiSelect,
        property: {
          options: [
            { id: 'opt1', name: 'OPTION 1', color: 3 },
            { id: 'opt2', name: 'option 2', color: 6 },
            { id: 'opt3', name: 'option 3', color: 4 },
          ],
          defaultValue: ['opt1'],
        },
      },
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<void>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<void>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<void>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          n: OTActionName.ObjectReplace,
          od: {
            id: 'fld2',
            name: 'field 2',
            property: {
              defaultValue: ['opt2', 'opt1'],
              options: [
                {
                  color: 0,
                  id: 'opt1',
                  name: 'option 1',
                },
                {
                  color: 1,
                  id: 'opt2',
                  name: 'option 2',
                },
                {
                  color: 2,
                  id: 'opt3',
                  name: 'option 3',
                },
              ],
            },
            type: 4,
          },
          oi: {
            id: 'fld2',
            name: 'FIELD 2',
            property: {
              defaultValue: ['opt1'],
              options: [
                {
                  color: 3,
                  id: 'opt1',
                  name: 'OPTION 1',
                },
                {
                  color: 6,
                  id: 'opt2',
                  name: 'option 2',
                },
                {
                  color: 4,
                  id: 'opt3',
                  name: 'option 3',
                },
              ],
            },
            type: 4,
          },
          p: ['meta', 'fieldMap', 'fld2'],
        },
      ],
      cmd: CollaCommandName.SetFieldAttr,
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

describe('addViews', () => {
  beforeEach(resetDataLoader);

  test('add a grid view', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.addViews(
      [
        {
          view: {
            id: 'viw12',
            name: 'New View Gantt 12',
            type: ViewType.Gantt,
            style: {} as IGanttViewStyle,
            rows: [],
            columns: [],
            frozenColumnCount: 1,
          },
        },
      ],
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<void>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<void>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<void>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          li: {
            id: 'viw12',
            name: 'New View Gantt 12',
            type: ViewType.Gantt,
            style: {} as IGanttViewStyle,
            rows: [],
            columns: [],
            frozenColumnCount: 1,
          } as IViewProperty,
          n: OTActionName.ListInsert,
          p: ['meta', 'views', 3],
        },
      ],
      cmd: CollaCommandName.AddViews,
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
          resourceType: ResourceType.Datasheet,
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

  test('add a gantt view in middle', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.addViews(
      [
        {
          startIndex: 1,
          view: {
            id: 'viw11',
            name: 'New View 111',
            type: ViewType.Grid,
            rows: [],
            columns: [],
            frozenColumnCount: 1,
          },
        },
      ],
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<void>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<void>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<void>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          li: {
            id: 'viw11',
            name: 'New View 111',
            type: ViewType.Grid,
            rows: [],
            columns: [],
            frozenColumnCount: 1,
          } as IViewProperty,
          n: OTActionName.ListInsert,
          p: ['meta', 'views', 1],
        },
      ],
      cmd: CollaCommandName.AddViews,
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
          resourceType: ResourceType.Datasheet,
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

describe('deleteViews', () => {
  beforeEach(resetDataLoader);

  test('delete single view', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.deleteViews(['viw2'], {});

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<void>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<void>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<void>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          ld: {
            id: 'viw2',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2', hidden: true }],
            frozenColumnCount: 1,
            name: 'view 2',
            rows: [{ recordId: 'rec2' }, { recordId: 'rec3' }, { recordId: 'rec5' }, { recordId: 'rec1' }, { recordId: 'rec4' }],
          } as IViewProperty,
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 1],
        },
      ],
      cmd: CollaCommandName.DeleteViews,
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
          resourceType: ResourceType.Datasheet,
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

  test('delete multiple views', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();

    const result = await dst1!.deleteViews(['viw2', 'viw3'], {});

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<void>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<void>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<void>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      actions: [
        {
          ld: {
            id: 'viw2',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2', hidden: true }],
            frozenColumnCount: 1,
            name: 'view 2',
            rows: [{ recordId: 'rec2' }, { recordId: 'rec3' }, { recordId: 'rec5' }, { recordId: 'rec1' }, { recordId: 'rec4' }],
          } as IViewProperty,
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 1],
        },
        {
          ld: {
            id: 'viw3',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2' }],
            frozenColumnCount: 1,
            name: 'view 3',
            rows: [{ recordId: 'rec3' }, { recordId: 'rec1' }, { recordId: 'rec2' }, { recordId: 'rec6' }, { recordId: 'rec4' }],
          },
          n: OTActionName.ListDelete,
          p: ['meta', 'views', 1],
        },
      ],
      cmd: CollaCommandName.DeleteViews,
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
          resourceType: ResourceType.Datasheet,
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
