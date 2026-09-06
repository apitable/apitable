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
import { ExecuteResult, ICollaCommandExecuteSuccessResult } from 'command_manager/types';
import { OTActionName } from 'engine';
import { FieldType } from 'types';
import { DropDirectionType, ViewType } from 'modules/shared/store/constants';
import { IBaseDatasheetPack, IColumnGroup } from 'exports/store/interfaces';
import { CollaCommandManager, ICollaCommandManagerListener } from '../command_manager';
import { fulfillStore } from './mock.store';

/**
 * Column order used by every test below (index in parens):
 *   fld1(0) fld2(1) fld3(2) fld4(3) fld5(4) fld6(5)
 * frozenColumnCount = 1, so fld1 is frozen and (per existing `moveColumn` rules) can neither be
 * dragged nor be the drop target for index 0 — this keeps every drag in these tests well away
 * from the "first column" special cases that are unrelated to column(field) grouping.
 */
function buildDatasheetPack(columnGroups?: IColumnGroup[]): IBaseDatasheetPack {
  return {
    snapshot: {
      meta: {
        fieldMap: {
          fld1: { id: 'fld1', name: 'field 1', type: FieldType.Text, property: null },
          fld2: { id: 'fld2', name: 'field 2', type: FieldType.Text, property: null },
          fld3: { id: 'fld3', name: 'field 3', type: FieldType.Text, property: null },
          fld4: { id: 'fld4', name: 'field 4', type: FieldType.Text, property: null },
          fld5: { id: 'fld5', name: 'field 5', type: FieldType.Text, property: null },
          fld6: { id: 'fld6', name: 'field 6', type: FieldType.Text, property: null },
        },
        views: [
          {
            id: 'viw1',
            type: ViewType.Grid,
            columns: [
              { fieldId: 'fld1' },
              { fieldId: 'fld2' },
              { fieldId: 'fld3' },
              { fieldId: 'fld4' },
              { fieldId: 'fld5' },
              { fieldId: 'fld6' },
            ],
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
      datasheetId: 'dstMoveCol',
    } as any,
    datasheet: {
      id: 'dstMoveCol',
      name: 'move column test datasheet',
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

describe('MoveColumn command — column(field) group interaction', () => {
  let commandManager: CollaCommandManager;

  const mockCommandListener: ICollaCommandManagerListener = {};

  it('reordering within the same group does not touch columnGroups', () => {
    const columnGroups: IColumnGroup[] = [
      { id: 'grp1', fieldIds: ['fld2', 'fld3'] },
      { id: 'grp2', fieldIds: ['fld5', 'fld6'] },
    ];
    const store = fulfillStore(buildDatasheetPack(columnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    // swap fld2 and fld3 (both in grp1) — drop fld2 right after fld3
    const result = commandManager.execute({
      cmd: CollaCommandName.MoveColumn,
      viewId: 'viw1',
      data: [{ fieldId: 'fld2', overTargetId: 'fld3', direction: DropDirectionType.AFTER }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    const actions = (result as ICollaCommandExecuteSuccessResult<any>).operation!.actions;
    // only the column ListMove action is produced, no columnGroups action at all
    expect(actions).toEqual([
      {
        n: OTActionName.ListMove,
        p: ['meta', 'views', 0, 'columns', 1],
        lm: 2,
      },
    ]);
  });

  it('adds an ungrouped field when it is dragged between two fields in the same group', () => {
    const columnGroups: IColumnGroup[] = [
      { id: 'grp1', fieldIds: ['fld2', 'fld3'] },
      { id: 'grp2', fieldIds: ['fld5', 'fld6'] },
    ];
    const store = fulfillStore(buildDatasheetPack(columnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.MoveColumn,
      viewId: 'viw1',
      data: [{ fieldId: 'fld4', overTargetId: 'fld3', direction: DropDirectionType.BEFORE }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    const actions = (result as ICollaCommandExecuteSuccessResult<any>).operation!.actions;
    expect(actions).toEqual([
      {
        n: OTActionName.ListMove,
        p: ['meta', 'views', 0, 'columns', 3],
        lm: 2,
      },
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', 0, 'columnGroups'],
        oi: [
          { id: 'grp1', fieldIds: ['fld2', 'fld4', 'fld3'] },
          { id: 'grp2', fieldIds: ['fld5', 'fld6'] },
        ],
        od: columnGroups,
      },
    ]);
  });

  it('dragging a field out of its group boundary auto-evicts it while at least two members remain', () => {
    const columnGroups: IColumnGroup[] = [
      { id: 'grp1', fieldIds: ['fld2', 'fld3', 'fld4'] },
      { id: 'grp2', fieldIds: ['fld5', 'fld6'] },
    ];
    const store = fulfillStore(buildDatasheetPack(columnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    // Drop fld4 outside both groups. Being adjacent to grp2's outer edge does not add it to grp2.
    const result = commandManager.execute({
      cmd: CollaCommandName.MoveColumn,
      viewId: 'viw1',
      data: [{ fieldId: 'fld4', overTargetId: 'fld6', direction: DropDirectionType.AFTER }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    const actions = (result as ICollaCommandExecuteSuccessResult<any>).operation!.actions;
    expect(actions).toEqual([
      {
        n: OTActionName.ListMove,
        p: ['meta', 'views', 0, 'columns', 3],
        lm: 5,
      },
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', 0, 'columnGroups'],
        oi: [
          { id: 'grp1', fieldIds: ['fld2', 'fld3'] },
          { id: 'grp2', fieldIds: ['fld5', 'fld6'] },
        ],
        od: columnGroups,
      },
    ]);
  });

  it('dissolves a group when dragging a field out leaves only one member', () => {
    const columnGroups: IColumnGroup[] = [{ id: 'grp1', fieldIds: ['fld2', 'fld3'] }];
    const store = fulfillStore(buildDatasheetPack(columnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.MoveColumn,
      viewId: 'viw1',
      data: [{ fieldId: 'fld3', overTargetId: 'fld4', direction: DropDirectionType.AFTER }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    const actions = (result as ICollaCommandExecuteSuccessResult<any>).operation!.actions;
    expect(actions).toEqual([
      {
        n: OTActionName.ListMove,
        p: ['meta', 'views', 0, 'columns', 2],
        lm: 3,
      },
      {
        n: OTActionName.ObjectDelete,
        p: ['meta', 'views', 0, 'columnGroups'],
        od: columnGroups,
      },
    ]);
  });

  it('moves a field from its source group into the destination group', () => {
    const columnGroups: IColumnGroup[] = [
      { id: 'grp1', fieldIds: ['fld2', 'fld3'] },
      { id: 'grp2', fieldIds: ['fld5', 'fld6'] },
    ];
    const store = fulfillStore(buildDatasheetPack(columnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.MoveColumn,
      viewId: 'viw1',
      data: [{ fieldId: 'fld3', overTargetId: 'fld6', direction: DropDirectionType.BEFORE }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    const actions = (result as ICollaCommandExecuteSuccessResult<any>).operation!.actions;
    expect(actions).toEqual([
      {
        n: OTActionName.ListMove,
        p: ['meta', 'views', 0, 'columns', 2],
        lm: 4,
      },
      {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', 0, 'columnGroups'],
        oi: [{ id: 'grp2', fieldIds: ['fld5', 'fld3', 'fld6'] }],
        od: columnGroups,
      },
    ]);
  });

  it('adds a batch of ungrouped fields dragged into a group', () => {
    const columnGroups: IColumnGroup[] = [{ id: 'grp1', fieldIds: ['fld2', 'fld3'] }];
    const store = fulfillStore(buildDatasheetPack(columnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.MoveColumn,
      viewId: 'viw1',
      data: [
        { fieldId: 'fld4', overTargetId: 'fld3', direction: DropDirectionType.BEFORE },
        { fieldId: 'fld5', overTargetId: 'fld3', direction: DropDirectionType.BEFORE },
      ],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    const actions = (result as ICollaCommandExecuteSuccessResult<any>).operation!.actions;
    expect(actions[actions.length - 1]).toEqual({
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', 0, 'columnGroups'],
      oi: [{ id: 'grp1', fieldIds: ['fld2', 'fld4', 'fld5', 'fld3'] }],
      od: columnGroups,
    });
  });

  it('dragging an ungrouped field between other columns produces no columnGroups action', () => {
    const columnGroups: IColumnGroup[] = [
      { id: 'grp1', fieldIds: ['fld2', 'fld3'] },
      { id: 'grp2', fieldIds: ['fld5', 'fld6'] },
    ];
    const store = fulfillStore(buildDatasheetPack(columnGroups));
    commandManager = new CollaCommandManager(mockCommandListener, store);

    // fld4 belongs to no group; move it right after fld1
    const result = commandManager.execute({
      cmd: CollaCommandName.MoveColumn,
      viewId: 'viw1',
      data: [{ fieldId: 'fld4', overTargetId: 'fld1', direction: DropDirectionType.AFTER }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    const actions = (result as ICollaCommandExecuteSuccessResult<any>).operation!.actions;
    expect(actions).toEqual([
      {
        n: OTActionName.ListMove,
        p: ['meta', 'views', 0, 'columns', 3],
        lm: 1,
      },
    ]);
  });

  it('behaves exactly as before when the view has no columnGroups at all', () => {
    const store = fulfillStore(buildDatasheetPack());
    commandManager = new CollaCommandManager(mockCommandListener, store);

    const result = commandManager.execute({
      cmd: CollaCommandName.MoveColumn,
      viewId: 'viw1',
      data: [{ fieldId: 'fld2', overTargetId: 'fld3', direction: DropDirectionType.AFTER }],
    });

    expect(result.result).toBe(ExecuteResult.Success);
    const actions = (result as ICollaCommandExecuteSuccessResult<any>).operation!.actions;
    expect(actions).toEqual([
      {
        n: OTActionName.ListMove,
        p: ['meta', 'views', 0, 'columns', 1],
        lm: 2,
      },
    ]);
  });
});
