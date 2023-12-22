import { ExecuteResult, ExecuteType, ICollaCommandExecuteSuccessResult } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { ICommandExecutionSuccessResult } from 'databus/logic';
import { IOperation, OTActionName } from 'engine';
import { ResourceType } from 'types';
import { mockWidgetMap } from './mock.dashboards';
import { MockDataBus, resetDataLoader } from './mock.databus';

const db = MockDataBus.getDatabase();

describe('dashboard info', () => {
  beforeAll(resetDataLoader);

  test('basic dashboard info', async() => {
    const dsb1 = await db.getDashboard('dsb1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dsb1).toBeTruthy();

    expect(dsb1!.id).toStrictEqual('dsb1');
    expect(dsb1!.type).toStrictEqual(ResourceType.Dashboard);
    expect(dsb1!.name).toStrictEqual('Dashboard 1');
    expect(dsb1!.revision).toStrictEqual(177);
    expect(Object.keys(dsb1!.widgetMap)).toStrictEqual(['wdt1', 'wdt2']);
  });
});

describe('getFields', () => {
  it('should not include hidden fields by default', async() => {
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

  it('should include hidden fields if includeHidden is true', async() => {
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

describe('add widget', () => {
  beforeEach(resetDataLoader);

  test('add single widget to empty dashboard', async() => {
    const dsb1 = await db.getDashboard('dsb1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dsb1).toBeTruthy();

    const result = await dsb1!.addWidgets(['wdt3'], {});

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      cmd: CollaCommandName.AddWidgetToDashboard,
      actions: [
        {
          n: OTActionName.ObjectInsert,
          p: ['widgetInstallations', 'layout'],
          oi: [
            {
              id: 'wdt3',
              widthInColumns: 3,
              heightInRoes: 6,
              row: Number.MAX_SAFE_INTEGER,
              column: 0,
            },
          ],
        },
      ],
    };

    expect(result).toStrictEqual({
      resourceId: 'dsb1',
      resourceType: ResourceType.Dashboard,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'dsb1',
          resourceType: ResourceType.Dashboard,
        },
      ],
      saveResult: [
        {
          baseRevision: 177,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'dsb1',
          resourceType: ResourceType.Dashboard,
        },
      ],
    });
  });

  test('add single widget to non-empty dashboard', async() => {
    const dsb2 = await db.getDashboard('dsb2', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dsb2).toBeTruthy();

    const result = await dsb2!.addWidgets(['wdt3'], {});

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      cmd: CollaCommandName.AddWidgetToDashboard,
      actions: [
        {
          n: OTActionName.ListInsert,
          p: ['widgetInstallations', 'layout', 2],
          li: {
            id: 'wdt3',
            widthInColumns: 3,
            heightInRoes: 6,
            row: Number.MAX_SAFE_INTEGER,
            column: 6,
          },
        },
      ],
    };

    expect(result).toStrictEqual({
      resourceId: 'dsb2',
      resourceType: ResourceType.Dashboard,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'dsb2',
          resourceType: ResourceType.Dashboard,
        },
      ],
      saveResult: [
        {
          baseRevision: 80,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'dsb2',
          resourceType: ResourceType.Dashboard,
        },
      ],
    });
  });
});

describe('delete widget', () => {
  beforeEach(resetDataLoader);

  test('delete single widget', async() => {
    const dsb2 = await db.getDashboard('dsb2', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dsb2).toBeTruthy();

    const result = await dsb2!.deleteWidget('wdt2', {});

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      cmd: CollaCommandName.DeleteDashboardWidget,
      actions: [
        {
          n: OTActionName.ListDelete,
          p: ['widgetInstallations', 'layout', 0],
          ld: {
            id: 'wdt2',
            widthInColumns: 3,
            heightInRoes: 3,
            row: 0,
            column: 0,
          },
        },
      ],
    };

    expect(result).toStrictEqual({
      resourceId: 'dsb2',
      resourceType: ResourceType.Dashboard,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'dsb2',
          resourceType: ResourceType.Dashboard,
        },
      ],
      saveResult: [
        {
          baseRevision: 80,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'dsb2',
          resourceType: ResourceType.Dashboard,
        },
      ],
    });
  });

  test('delete non-existent widget', async() => {
    const dsb2 = await db.getDashboard('dsb2', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dsb2).toBeTruthy();

    const result = await dsb2!.deleteWidget('wdt10', {});

    expect(result.result).toStrictEqual(ExecuteResult.None);
  });
});

describe('set widget dependency datasheet', () => {
  beforeEach(resetDataLoader);

  test('set single widget', async() => {
    const dsb2 = await db.getDashboard('dsb2', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dsb2).toBeTruthy();

    dsb2!.setWidgetInstalled(mockWidgetMap['wdt1']!);

    const result = await dsb2!.setWidgetDependencyDatasheet({ widgetId: 'wdt1', dstId: 'dst1' }, {});

    expect(result.result).toStrictEqual(ExecuteResult.Success);

    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult).toBeTruthy();
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult.length).toBe(1);
    expect((result as ICommandExecutionSuccessResult<string[]>).saveResult[0].messageId).toBeTruthy();

    delete (result as ICollaCommandExecuteSuccessResult<any>).data;
    (result as ICommandExecutionSuccessResult<any>).saveResult[0].messageId = 'msg1';

    const operation: IOperation = {
      cmd: CollaCommandName.SetWidgetDepDstId,
      actions: [
        {
          n: OTActionName.ObjectReplace,
          od: undefined,
          oi: 'dst1',
          p: ['datasheetId'],
        }
      ],
    };

    expect(result).toStrictEqual({
      resourceId: 'wdt1',
      resourceType: ResourceType.Widget,
      result: ExecuteResult.Success,
      operation,
      linkedActions: [],
      executeType: ExecuteType.Execute,
      resourceOpsCollects: [
        {
          operations: [operation],
          resourceId: 'wdt1',
          resourceType: ResourceType.Widget,
        },
      ],
      saveResult: [
        {
          baseRevision: undefined,
          messageId: 'msg1',
          operations: [operation],
          resourceId: 'wdt1',
          resourceType: ResourceType.Widget,
        },
      ],
    });
  });
});
