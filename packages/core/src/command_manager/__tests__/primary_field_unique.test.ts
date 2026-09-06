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
import { ExecuteResult } from 'command_manager/types';
import { FieldType, IError, SegmentType } from 'types';
import { CollaCommandManager, ICollaCommandManagerListener, IResourceOpsCollect } from '../command_manager';
import { mockDatasheetMap } from './mock.datasheets';
import { fulfillStore } from './mock.store';

/**
 * Demo-scope verification: exercises the REAL SetRecords/AddRecords command execute() paths
 * (packages/core/src/commands/datasheet/{set_records,add_records}.ts) through the actual
 * CollaCommandManager pipeline and real redux reducers - not a reimplementation of the check.
 * `dst1`'s primary field (fld1) is cloned and upgraded from FieldType.Text to FieldType.SingleText
 * with property.unique = true, since the demo scope only covers SingleText.
 *
 * Note: in this minimal fixture, a bare SetRecords write that reaches the underlying
 * DatasheetActions.setRecord2Action diff step returns ExecuteResult.None rather than Success, even
 * with zero modification to the fixture (verified independently) - this is a pre-existing quirk of
 * this specific mock store/permission setup, unrelated to this change. So "positive" (not-rejected)
 * assertions here check `!== Fail` rather than asserting a hard `Success`, except where AddRecords
 * is used (which does reach real Success in this fixture, per the existing passing tests in
 * command_manager.test.ts) - AddRecords assertions do check for hard Success.
 */
describe('primary field unique value validation (demo scope, SingleText only)', () => {
  let commandManager: CollaCommandManager;
  let error: IError | undefined;
  let opsCollect: IResourceOpsCollect[] | undefined;

  function buildStore(unique: boolean) {
    const pack = JSON.parse(JSON.stringify(mockDatasheetMap['dst1']));
    pack.snapshot.meta.fieldMap.fld1.type = FieldType.SingleText;
    pack.snapshot.meta.fieldMap.fld1.property = { unique };
    return fulfillStore(pack);
  }

  const mockCommandListener: ICollaCommandManagerListener = {
    handleCommandExecuted(resourceOpsCollects) {
      opsCollect = resourceOpsCollects;
    },
    handleCommandExecuteError(err) {
      error = err;
    },
  };

  beforeEach(() => {
    error = undefined;
    opsCollect = undefined;
  });

  it('rejects SetRecords when the new primary-field value duplicates another existing record (unique=true)', () => {
    commandManager = new CollaCommandManager(mockCommandListener, buildStore(true));
    // rec2 currently holds 'text 2'; try to overwrite rec3 (currently 'text 3') with 'text 2', a value rec2 already has.
    const result = commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      data: [
        {
          recordId: 'rec3',
          fieldId: 'fld1',
          value: [{ type: SegmentType.Text, text: 'text 2' }],
        },
      ],
    });

    expect(result.result).toBe(ExecuteResult.Fail);
    expect(opsCollect).toBeUndefined();
    expect(error?.message).toContain('不允许重复');
  });

  it('does not reject SetRecords with a genuinely unique value (unique=true)', () => {
    commandManager = new CollaCommandManager(mockCommandListener, buildStore(true));
    const result = commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      data: [
        {
          recordId: 'rec3',
          fieldId: 'fld1',
          value: [{ type: SegmentType.Text, text: 'text 3 - unique value' }],
        },
      ],
    });

    // this fixture returns None (not Success) for any bare SetRecords diff regardless of this
    // feature (verified via an unmodified-fixture baseline) - what this test actually proves is
    // that a non-duplicate value is NOT rejected by the unique check.
    expect(result.result).not.toBe(ExecuteResult.Fail);
    expect(error).toBeUndefined();
  });

  it('allows setting a record back to its own current value (exclude-self)', () => {
    commandManager = new CollaCommandManager(mockCommandListener, buildStore(true));
    const result = commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      data: [
        {
          recordId: 'rec3',
          fieldId: 'fld1',
          value: [{ type: SegmentType.Text, text: 'text 3' }],
        },
      ],
    });
    expect(result.result).not.toBe(ExecuteResult.Fail);
  });

  it('does NOT reject a SetRecords duplicate when unique=false (control case - proves the switch actually gates the behavior)', () => {
    commandManager = new CollaCommandManager(mockCommandListener, buildStore(false));
    const result = commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      data: [
        {
          recordId: 'rec3',
          fieldId: 'fld1',
          value: [{ type: SegmentType.Text, text: 'text 2' }], // duplicates rec2, but unique is off
        },
      ],
    });

    expect(result.result).not.toBe(ExecuteResult.Fail);
    expect(error).toBeUndefined();
  });

  it('rejects AddRecords when the new record duplicates an existing primary-field value (unique=true)', () => {
    commandManager = new CollaCommandManager(mockCommandListener, buildStore(true));
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 1,
      cellValues: [{ fld1: [{ type: SegmentType.Text, text: 'text 1' }] }], // rec1 already holds 'text 1'
    });

    expect(result.result).toBe(ExecuteResult.Fail);
  });

  it('allows AddRecords with a genuinely unique new value (unique=true)', () => {
    commandManager = new CollaCommandManager(mockCommandListener, buildStore(true));
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 1,
      cellValues: [{ fld1: [{ type: SegmentType.Text, text: 'a brand new unique value' }] }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    expect(error).toBeUndefined();
  });

  it('rejects two duplicate values added within the same AddRecords batch', () => {
    commandManager = new CollaCommandManager(mockCommandListener, buildStore(true));
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 2,
      cellValues: [
        { fld1: [{ type: SegmentType.Text, text: 'brand new value' }] },
        { fld1: [{ type: SegmentType.Text, text: 'brand new value' }] },
      ],
    });

    expect(result.result).toBe(ExecuteResult.Fail);
  });

  it('does NOT reject an AddRecords duplicate when unique=false (control case)', () => {
    commandManager = new CollaCommandManager(mockCommandListener, buildStore(false));
    const result = commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      viewId: 'viw1',
      index: 0,
      count: 1,
      cellValues: [{ fld1: [{ type: SegmentType.Text, text: 'text 1' }] }], // duplicates rec1, but unique is off
    });

    expect(result.result).toBe(ExecuteResult.Success);
  });
});
