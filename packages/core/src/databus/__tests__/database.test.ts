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

import { fulfillDatasheetStore } from './mock.store.provider';
import { MockDataBus, resetDataLoader } from './mock.databus';
import { ResourceType } from 'types';
import { CommandExecutionResultType, ResourceEventType, IResourceEvent, IResourceEventHandler } from 'databus/common/event';
import { ExecuteResult, ICollaCommandExecuteSuccessResult } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { mockOpsCollectOfAddOneDefaultRecord } from './mock.datasheets';
import { updateRevision } from 'modules/database/store/actions/resource';

const db = MockDataBus.getDatabase();

describe('store provider', () => {
  it('should use custom store if createStore is given', async () => {
    const dst = await db.getDatasheet('dst1', {
      createStore(datasheetPack) {
        const store = fulfillDatasheetStore(datasheetPack);
        store.dispatch(updateRevision(12408, 'dst1', ResourceType.Datasheet));
        return Promise.resolve(store);
      },
      loadOptions: {},
    });

    expect(dst).toBeTruthy();
    expect(dst!.revision).toStrictEqual(12408);
  });
});

describe('getDatasheet', () => {
  it('should return non-null if datasheet exists', async () => {
    const dst = await db.getDatasheet('dst1', { loadOptions: {}, storeOptions: {} });
    expect(dst).toBeTruthy();
  });

  it('should return null if datasheet does not exist', async () => {
    const dst = await db.getDatasheet('dst7', { loadOptions: {}, storeOptions: {} });
    expect(dst).toBeNull();
  });
});

describe('getDashboard', () => {
  it('should return non-null if dashboard exists', async () => {
    const dst = await db.getDashboard('dsb1', { loadOptions: {}, storeOptions: {} });
    expect(dst).toBeTruthy();
  });

  it('should return null if dashboard does not exist', async () => {
    const dst = await db.getDashboard('dsb7', { loadOptions: {}, storeOptions: {} });
    expect(dst).toBeNull();
  });
});

describe('event handlers', () => {
  beforeEach(resetDataLoader);

  test('add an event listener', () => {
    const result = db.addEventHandler({
      type: ResourceEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    });

    expect(result).toBeTruthy();
  });

  test('add the same event listener twice', () => {
    const listener = {
      type: ResourceEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    };

    db.addEventHandler(listener);
    const result = db.addEventHandler(listener);

    expect(result).toBeFalsy();
  });

  test('remove an event listener', () => {
    const listener = {
      type: ResourceEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    };

    db.addEventHandler(listener);

    const result = db.removeEventHandler(listener);

    expect(result).toBeTruthy();
  });

  test('remove the same event listener twice', () => {
    const listener = {
      type: ResourceEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    };

    db.addEventHandler(listener);

    db.removeEventHandler(listener);
    const result = db.removeEventHandler(listener);

    expect(result).toBeFalsy();
  });

  test('remove a non-existent event listener', () => {
    const listener = {
      type: ResourceEventType.CommandExecuted,
      handle: () => Promise.resolve(),
    };

    const result = db.removeEventHandler(listener);

    expect(result).toBeFalsy();
  });

  describe('fire event', () => {
    test('fire an event with one event listeners', async () => {
      let result: any;
      db.addEventHandler({
        type: ResourceEventType.CommandExecuted,
        handle(event) {
          result = event;
          return Promise.resolve();
        },
      });

      const event: IResourceEvent = {
        type: ResourceEventType.CommandExecuted,
        execResult: CommandExecutionResultType.Success,
        resourceOpCollections: [],
      };

      await db.fireEvent(event);

      expect(result).toStrictEqual(event);
    });

    test('fire an event with two event listeners', async () => {
      let result1: any;
      let result2: any;
      db.addEventHandler({
        type: ResourceEventType.CommandExecuted,
        handle(event) {
          result1 = event;
          return Promise.resolve();
        },
      });
      db.addEventHandler({
        type: ResourceEventType.CommandExecuted,
        handle(event) {
          result2 = event;
          return Promise.resolve();
        },
      });

      const event: IResourceEvent = {
        type: ResourceEventType.CommandExecuted,
        execResult: CommandExecutionResultType.Success,
        resourceOpCollections: [],
      };

      await db.fireEvent(event);

      expect(result1).toStrictEqual(event);
      expect(result2).toStrictEqual(event);
    });

    it('should not be invoked after being removed', async () => {
      let result: any = undefined;
      const handler: IResourceEventHandler & { type: ResourceEventType } = {
        type: ResourceEventType.CommandExecuted,
        handle(event) {
          result = event;
          return Promise.resolve();
        },
      };
      db.addEventHandler(handler);

      db.removeEventHandler(handler);

      const event: IResourceEvent = {
        type: ResourceEventType.CommandExecuted,
        execResult: CommandExecutionResultType.Success,
        resourceOpCollections: [],
      };

      await db.fireEvent(event);

      expect(result).toBeUndefined();
    });

    it('should not be invoked after the kind of handlers is removed', async () => {
      let result: any = undefined;
      db.addEventHandler({
        type: ResourceEventType.CommandExecuted,
        handle(event) {
          result = event;
          return Promise.resolve();
        },
      });

      db.removeEventHandlers(ResourceEventType.CommandExecuted);

      const event: IResourceEvent = {
        type: ResourceEventType.CommandExecuted,
        execResult: CommandExecutionResultType.Success,
        resourceOpCollections: [],
      };

      await db.fireEvent(event);

      expect(result).toBeUndefined();
    });
  });

  it('should receive success event if doCommand succeeded', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();
    let event: any = undefined;
    db.addEventHandler({
      type: ResourceEventType.CommandExecuted,
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
      type: ResourceEventType.CommandExecuted,
      execResult: CommandExecutionResultType.Success,
      resourceOpCollections: mockOpsCollectOfAddOneDefaultRecord(recordId),
    });
  });

  it('should not receive event if doCommand returns none', async () => {
    const dst1 = await db.getDatasheet('dst1', {
      loadOptions: {},
      storeOptions: {},
    });
    expect(dst1).toBeTruthy();
    let event: any = undefined;
    db.addEventHandler({
      type: ResourceEventType.CommandExecuted,
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