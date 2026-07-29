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
import { ExecuteFailReason, ExecuteResult, ICollaCommandExecuteSuccessResult } from 'command_manager/types';
import { OTActionName } from 'engine';
import { FieldType } from 'types';
import { ViewType } from 'modules/shared/store/constants';
import { IBaseDatasheetPack, IColumnGroup } from 'exports/store/interfaces';
import { CollaCommandManager, ICollaCommandManagerListener } from '../command_manager';
import { fulfillStore } from './mock.store';

/**
 * column(field) grouping is unrelated to `SetGroup`(row grouping by field value), do not confuse the two.
 */
function buildDatasheetPack(columnGroups?: IColumnGroup[]): IBaseDatasheetPack {
  return {
    snapshot: {
      meta: {
        fieldMap: {
          fld1: { id: 'fld1', name: 'field 1', type: FieldType.Text, property: null },
          fld2: { id: 'fld2', name: 'field 2', type: FieldType.Text, property: null },
          fld3: { id: 'fld3', name: 'field 3', type: FieldType.Text, property: null },
          fld4: { id: 'fld4', name: 'field 4 (not in view)', type: FieldType.Text, property: null },
        },
        views: [
          {
            id: 'viw1',
            type: ViewType.Grid,
            columns: [{ fieldId: 'fld1' }, { fieldId: 'fld2' }, { fieldId: 'fld3' }],
            frozenColumnCount: 1,
            name: 'view 1',
            rows: [{ recordId: 'rec1' }],
            ...(columnGroups ? { columnGroups } : {}),
          },
        ],
      },
      recordMap: {
        rec1: { id: 'rec1', data: {}, commentCount: 0 },
      },
      datasheetId: 'dstColGrp',
    } as any,
    datasheet: {
      id: 'dstColGrp',
      name: 'column groups test datasheet',
      description: '',
      parentId: '',
      icon: '',
      nodeShared: false,
      nodePermitSet: false,
      spaceId: 'spc1',
      role: {} as any,
      permissions: {} as any,
      revision: 1,
    },
  };
}

describe('SetColumnGroups command', () => {
  let commandManager: CollaCommandManager;

  const mockCommandListener: ICollaCommandManagerListener = {};

  it('should create column groups successfully', () => {
    const store = fulfillStore(buildDatasheetPack());
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.SetColumnGroups,
      viewId: 'viw1',
      data: [{ id: 'grp1', name: 'Group 1', fieldIds: ['fld1', 'fld2'] }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    expect((result as ICollaCommandExecuteSuccessResult<any>).operation!.actions).toEqual([
      {
        n: OTActionName.ObjectInsert,
        p: ['meta', 'views', 0, 'columnGroups'],
        oi: [{ id: 'grp1', name: 'Group 1', fieldIds: ['fld1', 'fld2'] }],
      },
    ]);
  });

  it('should fail when a group references a field that is not in the view', () => {
    const store = fulfillStore(buildDatasheetPack());
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.SetColumnGroups,
      viewId: 'viw1',
      data: [{ id: 'grp1', fieldIds: ['fld1', 'fld4'] }],
    });

    expect(result.result).toBe(ExecuteResult.Fail);
    expect((result as any).reason).toBe(ExecuteFailReason.ActionError);
  });

  it('should drop a field from the earlier group when it also appears in a later group', () => {
    const store = fulfillStore(buildDatasheetPack());
    commandManager = new CollaCommandManager(mockCommandListener, store);

    // fld2 shows up both in grp1 and grp2, it should only remain in grp1(the group where it first appears)
    const result = commandManager.execute({
      cmd: CollaCommandName.SetColumnGroups,
      viewId: 'viw1',
      data: [
        { id: 'grp1', fieldIds: ['fld1', 'fld2'] },
        { id: 'grp2', fieldIds: ['fld2', 'fld3'] },
      ],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    expect((result as ICollaCommandExecuteSuccessResult<any>).operation!.actions).toEqual([
      {
        n: OTActionName.ObjectInsert,
        p: ['meta', 'views', 0, 'columnGroups'],
        oi: [
          { id: 'grp1', fieldIds: ['fld1', 'fld2'] },
          { id: 'grp2', fieldIds: ['fld3'] },
        ],
      },
    ]);
  });

  it('should clear the existing column groups when data is empty', () => {
    const existingColumnGroups: IColumnGroup[] = [{ id: 'grp1', fieldIds: ['fld1', 'fld2'] }];
    const store = fulfillStore(buildDatasheetPack(existingColumnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.SetColumnGroups,
      viewId: 'viw1',
      data: undefined,
    });

    expect(result.result).toBe(ExecuteResult.Success);
    expect((result as ICollaCommandExecuteSuccessResult<any>).operation!.actions).toEqual([
      {
        n: OTActionName.ObjectDelete,
        p: ['meta', 'views', 0, 'columnGroups'],
        od: existingColumnGroups,
      },
    ]);
  });

  it('should rename a column group without changing its fields', () => {
    const existingColumnGroups: IColumnGroup[] = [
      { id: 'grp1', name: 'Group 1', fieldIds: ['fld1', 'fld2'] },
      { id: 'grp2', name: 'Group 2', fieldIds: ['fld3'] },
    ];
    const renamedColumnGroups = [
      { ...existingColumnGroups[0]!, name: 'Renamed Group' },
      existingColumnGroups[1]!,
    ];
    const store = fulfillStore(buildDatasheetPack(existingColumnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.SetColumnGroups,
      viewId: 'viw1',
      data: renamedColumnGroups,
    });

    expect(result.result).toBe(ExecuteResult.Success);
    expect((result as ICollaCommandExecuteSuccessResult<any>).operation!.actions).toEqual([
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', 0, 'columnGroups'],
        oi: renamedColumnGroups,
        od: existingColumnGroups,
      },
    ]);
  });

  it('should disband only the selected column group', () => {
    const existingColumnGroups: IColumnGroup[] = [
      { id: 'grp1', name: 'Group 1', fieldIds: ['fld1', 'fld2'] },
      { id: 'grp2', name: 'Group 2', fieldIds: ['fld3'] },
    ];
    const remainingColumnGroups = [existingColumnGroups[1]!];
    const store = fulfillStore(buildDatasheetPack(existingColumnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.SetColumnGroups,
      viewId: 'viw1',
      data: remainingColumnGroups,
    });

    expect(result.result).toBe(ExecuteResult.Success);
    expect((result as ICollaCommandExecuteSuccessResult<any>).operation!.actions).toEqual([
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', 0, 'columnGroups'],
        oi: remainingColumnGroups,
        od: existingColumnGroups,
      },
    ]);
  });
});
