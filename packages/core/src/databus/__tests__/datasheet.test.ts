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

import { DatasheetEventType, IDatasheetEvent, IDatasheetEventHandler } from '../common/event';
import { mockDatasheetMap, mockOpsCollectOfAddOneDefaultRecord } from './mock.datasheets';
import { mockGetViewInfo } from './mock.view';
import { MockDataBus, resetDataLoader } from './mock.databus';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';
import { ExecuteFailReason, ExecuteResult, ICollaCommandExecuteSuccessResult } from 'command_manager';

const db = MockDataBus.getDatabase();

beforeAll(resetDataLoader);

describe('datasheet info', () => {
  test('basic datasheet info', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    expect(dst1!.id).toStrictEqual('dst1');
    expect(dst1!.type).toStrictEqual(ResourceType.Datasheet);
    expect(dst1!.revision).toStrictEqual(12);
    expect(dst1!.name).toStrictEqual('datasheet 1');
    expect(dst1!.snapshot).toStrictEqual(mockDatasheetMap['dst1']!.snapshot);
  });
});

describe('get view', () => {
  it('should return View for existing view', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView({
      getViewInfo: mockGetViewInfo('dst1', 'viw1'),
    });

    expect(view1).toBeTruthy();
    expect(view1!.id).toStrictEqual('viw1');
  });

  it('should return null if view does not exist', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    const view1 = await dst1!.getView({
      getViewInfo: mockGetViewInfo('dst1', 'viw100'),
    });

    expect(view1).toBeNull();
  });
});

describe('doCommand', () => {
  beforeEach(resetDataLoader);

  it('should return success if command execution succeeded', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
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

  it('should fail if count != cellValues.length when adding records', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
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

  it('should return none when adding zero records', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
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

describe('event handlers', () => {
  beforeEach(resetDataLoader);

  test('add an event listener', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    const result = dst1!.addEventHandler({
      type: DatasheetEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    });

    expect(result).toBeTruthy();
  });

  test('add the same event listener twice', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    const listener = {
      type: DatasheetEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    };

    dst1!.addEventHandler(listener);
    const result = dst1!.addEventHandler(listener);

    expect(result).toBeFalsy();
  });

  test('remove an event listener', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    const listener = {
      type: DatasheetEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    };

    dst1!.addEventHandler(listener);

    const result = dst1!.removeEventHandler(listener);

    expect(result).toBeTruthy();
  });

  test('remove the same event listener twice', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    const listener = {
      type: DatasheetEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    };

    dst1!.addEventHandler(listener);

    dst1!.removeEventHandler(listener);
    const result = dst1!.removeEventHandler(listener);

    expect(result).toBeFalsy();
  });

  test('remove a non-existent event listener', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    const listener = {
      type: DatasheetEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    };

    const result = dst1!.removeEventHandler(listener);

    expect(result).toBeFalsy();
  });

  describe('fire event', () => {
    test('fire an event with one event listeners', async() => {
      const dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      let result: any;
      dst1!.addEventHandler({
        type: DatasheetEventType.CommandExecuted,
        handle(event) {
          result = event;
          return Promise.resolve();
        },
      });

      const event: IDatasheetEvent = {
        type: DatasheetEventType.CommandExecuted,
        resourceOpCollections: [],
      };

      await dst1!.fireEvent(event);

      expect(result).toStrictEqual(event);
    });

    test('fire an event with two event listeners', async() => {
      const dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      let result1: any;
      let result2: any;
      dst1!.addEventHandler({
        type: DatasheetEventType.CommandExecuted,
        handle(event) {
          result1 = event;
          return Promise.resolve();
        },
      });
      dst1!.addEventHandler({
        type: DatasheetEventType.CommandExecuted,
        handle(event) {
          result2 = event;
          return Promise.resolve();
        },
      });

      const event: IDatasheetEvent = {
        type: DatasheetEventType.CommandExecuted,
        resourceOpCollections: [],
      };

      await dst1!.fireEvent(event);

      expect(result1).toStrictEqual(event);
      expect(result2).toStrictEqual(event);
    });

    it('should not be invoked after being removed', async() => {
      const dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      let result: any = undefined;
      const handler: IDatasheetEventHandler & { type: DatasheetEventType } = {
        type: DatasheetEventType.CommandExecuted,
        handle(event) {
          result = event;
          return Promise.resolve();
        },
      };
      dst1!.addEventHandler(handler);

      dst1!.removeEventHandler(handler);

      const event: IDatasheetEvent = {
        type: DatasheetEventType.CommandExecuted,
        resourceOpCollections: [],
      };

      await dst1!.fireEvent(event);

      expect(result).toBeUndefined();
    });

    it('should not be invoked after the kind of handlers is removed', async() => {
      const dst1 = await db.getDatasheet('dst1', {});
      expect(dst1).toBeTruthy();
      let result: any = undefined;
      dst1!.addEventHandler({
        type: DatasheetEventType.CommandExecuted,
        handle(event) {
          result = event;
          return Promise.resolve();
        },
      });

      dst1!.removeEventHandlers(DatasheetEventType.CommandExecuted);

      const event: IDatasheetEvent = {
        type: DatasheetEventType.CommandExecuted,
        resourceOpCollections: [],
      };

      await dst1!.fireEvent(event);

      expect(result).toBeUndefined();
    });
  });

  it('should receive success event if doCommand succeeded', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();
    let event: any = undefined;
    dst1!.addEventHandler({
      type: DatasheetEventType.CommandExecuted,
      handle(e) {
        event = e;
        return Promise.resolve();
      },
    });

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

    const recordId = (result as ICollaCommandExecuteSuccessResult<string[]>).data![0]!;

    expect(event).toBeTruthy();

    expect(event).toStrictEqual({
      type: DatasheetEventType.CommandExecuted,
      resourceOpCollections: mockOpsCollectOfAddOneDefaultRecord(recordId),
    });
  });

  it('should not receive event if doCommand returns none', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();
    let event: any = undefined;
    dst1!.addEventHandler({
      type: DatasheetEventType.CommandExecuted,
      handle(e) {
        event = e;
        return Promise.resolve();
      },
    });

    const result = await dst1!.doCommand(
      {
        cmd: CollaCommandName.AddRecords,
        viewId: 'viw1',
        index: 3,
        count: 0,
      },
      {},
    );

    expect(result.result).toStrictEqual(ExecuteResult.None);

    expect(event).toBeUndefined();
  });
});
