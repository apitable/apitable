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

import { CollaCommandName } from 'commands/enum';
import { ExecuteFailReason, ExecuteResult, ExecuteType, ICollaCommandExecuteSuccessResult } from 'command_manager/types';
import { ErrorCode, ErrorType, FieldType, IError, ResourceType } from 'types';
import { CollaCommandManager, ICollaCommandManagerListener, IResourceOpsCollect } from '../command_manager';
import { mockDatasheetMap } from './mock.datasheets';
import { fulfillStore } from './mock.store';
import {
  mockAddOneCommentResult,
  mockResultOfAddOneDefaultRecordInDst1,
  mockAddOneRecordResult,
  mockResultOfDeleteLinkFieldInDst2,
  mockOpsCollectsOfAddOneDefaultRecordInDst1,
  mockOpsCollectsOfDeleteLinkFieldInDst2,
  mockOperationOfAddOneDefaultRecordInDst1,
} from './mock.execute.result';
import { Strings, t } from 'exports/i18n';
import { OTActionName } from 'engine';
import { ICollaCommandDef } from 'command_manager/command';

describe('execute', () => {
  let commandManager: CollaCommandManager;
  let error: IError | undefined;
  let opsCollect: IResourceOpsCollect[] | undefined;

  const mockCommandListener: ICollaCommandManagerListener = {
    handleCommandExecuted(resourceOpsCollects) {
      opsCollect = resourceOpsCollects;
    },
    handleCommandExecuteError(err) {
      error = err;
    },
  };

  beforeEach(() => {
    const store = fulfillStore(mockDatasheetMap['dst1']!);
    commandManager = new CollaCommandManager(mockCommandListener, store);
    error = undefined;
    opsCollect = undefined;
  });

  test('add one default record succeed', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 1,
    });

    expect(result.result).toBe(ExecuteResult.Success);

    const recordId = (result as ICollaCommandExecuteSuccessResult<string[]>).data![0]!;

    expect(result).toStrictEqual(mockResultOfAddOneDefaultRecordInDst1(recordId));
  });

  it('should return none if adding zero records', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 0,
    });

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.None,
    });
  });

  it('should return none if deleting zero fields', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.DeleteField,
      datasheetId: 'dst1',
      data: [],
    });

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.None,
    });
  });

  it('should fail if cellValue.length != count.length', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 1,
      cellValues: [],
    });

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.Fail,
      reason: ExecuteFailReason.ActionError,
    });
  });

  it('should return none if command name not found', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.SystemSetFieldAttr,
    } as any);

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.None,
    });
  });

  test('fullfill resourceId', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      datasheetId: 'dst1',
      viewId: 'viw1',
      index: 0,
      count: 1,
    });

    expect(result.result).toBe(ExecuteResult.Success);

    const recordId = (result as ICollaCommandExecuteSuccessResult<string[]>).data![0]!;
    expect(result).toStrictEqual(mockResultOfAddOneDefaultRecordInDst1(recordId));
  });

  test('fullfill resourceId', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      resourceId: 'dst1',
      viewId: 'viw1',
      index: 0,
      count: 1,
    });

    expect(result.result).toBe(ExecuteResult.Success);

    const recordId = (result as ICollaCommandExecuteSuccessResult<string[]>).data![0]!;
    expect(result).toStrictEqual(mockResultOfAddOneDefaultRecordInDst1(recordId));
  });

  test('handleCommandExecuteError listener', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 1,
      cellValues: [],
    });

    expect(result).toStrictEqual({
      resourceId: 'dst1',
      resourceType: ResourceType.Datasheet,
      result: ExecuteResult.Fail,
      reason: ExecuteFailReason.ActionError,
    });

    expect(error).toStrictEqual({
      type: ErrorType.CollaError,
      code: ErrorCode.CommandExecuteFailed,
      message: t(Strings.error_add_row_failed_wrong_length_of_value),
    });
  });

  test('handleCommandExecuted listener', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 1,
    });

    expect(result.result).toBe(ExecuteResult.Success);

    const recordId = (result as ICollaCommandExecuteSuccessResult<string[]>).data![0]!;

    expect(result).toStrictEqual(mockResultOfAddOneDefaultRecordInDst1(recordId));

    expect(opsCollect).toStrictEqual(mockOpsCollectsOfAddOneDefaultRecordInDst1(recordId));
  });

  it('should contain actions to modify field if adding a record with member cell', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 1,
      cellValues: [
        {
          fld2: [],
          fld3: ['100006', '100002'],
        },
      ],
    });

    expect(result.result).toBe(ExecuteResult.Success);

    const recordId = (result as ICollaCommandExecuteSuccessResult<string[]>).data![0]!;

    expect(result).toStrictEqual(
      mockAddOneRecordResult(
        'dst1',
        recordId,
        {
          fld2: [],
          fld3: ['100006', '100002'],
        },
        [
          {
            n: OTActionName.ObjectReplace,
            p: ['meta', 'fieldMap', 'fld3'],
            oi: {
              id: 'fld3',
              name: 'Field 3',
              type: FieldType.Member,
              property: {
                isMulti: true,
                shouldSendMsg: false,
                unitIds: ['100000', '100001', '100002', '100006'],
              },
            },
            od: {
              id: 'fld3',
              name: 'Field 3',
              type: FieldType.Member,
              property: {
                isMulti: true,
                shouldSendMsg: false,
                unitIds: ['100000', '100001', '100002'],
              },
            },
          },
        ],
      ),
    );
  });

  it('should contain actions to delete link field in linked datasheet if deleting a link field', () => {
    const store = fulfillStore(mockDatasheetMap['dst2']!, { dst3: mockDatasheetMap['dst3']! });
    const commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.DeleteField,
      data: [
        {
          deleteBrotherField: true,
          fieldId: 'fld2-2',
        },
      ],
    });

    expect(result.result).toBe(ExecuteResult.Success);

    expect(result).toStrictEqual(mockResultOfDeleteLinkFieldInDst2);
  });

  it('should contain actions to delete link field in linked datasheet in opsCollects if deleting a link field', () => {
    const store = fulfillStore(mockDatasheetMap['dst2']!, { dst3: mockDatasheetMap['dst3']! });
    const commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.DeleteField,
      data: [
        {
          deleteBrotherField: true,
          fieldId: 'fld2-2',
        },
      ],
    });

    expect(result.result).toBe(ExecuteResult.Success);

    expect(opsCollect).toStrictEqual(mockOpsCollectsOfDeleteLinkFieldInDst2);
  });

  test('update comment', () => {
    const result = commandManager.execute({
      cmd: CollaCommandName.UpdateComment,
      datasheetId: 'dst1',
      recordId: 'rec1',
      comments: {
        revision: 1,
        createdAt: 1000000000000,
        commentId: 'cmt1',
        unitId: '100001',
        commentMsg: {
          type: 'dummy',
          content: 'comment 1',
          html: '<span>comment&nbsp;1</span>',
          emojis: {},
        },
      },
      emojiAction: true,
    });

    expect(result.result).toBe(ExecuteResult.Success);

    expect(result).toStrictEqual(
      mockAddOneCommentResult('dst1', 'rec1', {
        revision: 1,
        createdAt: 1000000000000,
        commentId: 'cmt1',
        unitId: '100001',
        commentMsg: {
          type: 'dummy',
          content: 'comment 1',
          html: '<span>comment&nbsp;1</span>',
          emojis: {},
        },
      }),
    );
  });
});

describe('command registry', () => {
  let commandManager: CollaCommandManager;

  beforeEach(() => {
    const store = fulfillStore(mockDatasheetMap['dst1']!);
    commandManager = new CollaCommandManager({}, store);
  });

  test('register command', () => {
    commandManager.register('foo', {
      undoable: false,
      execute() {
        return null;
      },
    });

    expect(commandManager.hasCommand('foo')).toBeTruthy();
  });

  test('unregister command', () => {
    commandManager.register('foo', {
      undoable: false,
      execute() {
        return null;
      },
    });

    commandManager.unregister('foo');

    expect(commandManager.hasCommand('foo')).toBeFalsy();
  });

  test('register the same command twice', () => {
    const cmd: ICollaCommandDef = {
      undoable: false,
      execute() {
        return null;
      },
    };
    commandManager.register('foo', cmd);
    commandManager.register('foo', cmd);

    expect(commandManager.hasCommand('foo')).toBeTruthy();
  });
});

describe('_executeActions', () => {
  const store = fulfillStore(mockDatasheetMap['dst1']!);
  const commandManager = new CollaCommandManager({}, store);

  test('attempt to undo un-undoable command', () => {
    const result = commandManager._executeActions(
      CollaCommandName.DeleteComment,
      {
        resourceId: 'dst1',
        resourceType: ResourceType.Datasheet,
        result: ExecuteResult.Success,
        actions: [],
      },
      ExecuteType.Undo,
    );

    expect(result).toBeNull();
  });

  test('attempt to redo un-undoable command', () => {
    const result = commandManager._executeActions(
      CollaCommandName.DeleteComment,
      {
        resourceId: 'dst1',
        resourceType: ResourceType.Datasheet,
        result: ExecuteResult.Success,
        actions: [],
      },
      ExecuteType.Redo,
    );

    expect(result).toBeNull();
  });

  test('execute actions of redo AddRecords', () => {
    const result = commandManager._executeActions(
      CollaCommandName.AddRecords,
      {
        resourceId: 'dst1',
        resourceType: ResourceType.Datasheet,
        result: ExecuteResult.Success,
        data: ['rec1'],
        actions: mockOperationOfAddOneDefaultRecordInDst1('rec1').actions,
        linkedActions: [],
        fieldMapSnapshot: { fld2: mockDatasheetMap['dst1']!.snapshot.meta.fieldMap['fld2']! },
      },
      ExecuteType.Redo,
    );

    expect(result).toStrictEqual({ ...mockResultOfAddOneDefaultRecordInDst1('rec1'), executeType: ExecuteType.Redo });
  });
});
