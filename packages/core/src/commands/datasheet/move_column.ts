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

import { isEmpty } from 'lodash';
import { IJOTAction, jot } from 'engine/ot';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IColumnGroup, IGridViewProperty } from '../../exports/store/interfaces';
import { DropDirectionType } from 'modules/shared/store/constants';
import { Strings, t } from '../../exports/i18n';
import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { CollaCommandName } from 'commands/enum';

import { getActiveDatasheetId, getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';

export interface IMoveColumn {
  fieldId: string; // the id of the column that needs to be dragged
  overTargetId: string; // columnIndex when letting go
  direction: DropDirectionType; // the direction of the drag
}

export interface IMoveColumnOptions {
  cmd: CollaCommandName.MoveColumn;
  data: IMoveColumn[];
  viewId: string;
}

export interface IColumnGroupMoveState {
  columnOrder: string[];
  columnGroups?: IColumnGroup[];
}

/**
 * Keep the simulated column order and column-group membership aligned after one accepted move.
 * This is shared by persisted commands and mirror temporary views so both paths apply the same
 * grouping rules.
 */
export const getColumnGroupMoveState = (state: IColumnGroupMoveState, move: IMoveColumn): IColumnGroupMoveState => {
  const { fieldId, overTargetId, direction } = move;
  const originIndex = state.columnOrder.indexOf(fieldId);
  const overIndex = state.columnOrder.indexOf(overTargetId);

  if (originIndex < 0 || overIndex < 0) {
    return state;
  }

  let targetIndex = originIndex > overIndex ? overIndex + 1 : overIndex;
  if (direction === DropDirectionType.BEFORE) {
    targetIndex--;
  }

  const columnOrder = [...state.columnOrder];
  columnOrder.splice(originIndex, 1);
  columnOrder.splice(targetIndex, 0, fieldId);

  if (!state.columnGroups?.length) {
    return { columnOrder, columnGroups: state.columnGroups };
  }

  let columnGroups = state.columnGroups.map((group) => ({ ...group, fieldIds: [...group.fieldIds] }));
  const newFieldIndex = columnOrder.indexOf(fieldId);
  const leftNeighborId = columnOrder[newFieldIndex - 1];
  const rightNeighborId = columnOrder[newFieldIndex + 1];
  const getGroupByFieldId = (neighborFieldId?: string) => {
    if (neighborFieldId == null) {
      return undefined;
    }
    return columnGroups.find((group) => group.fieldIds.includes(neighborFieldId));
  };

  const sourceGroup = columnGroups.find((group) => group.fieldIds.includes(fieldId));
  const leftGroup = getGroupByFieldId(leftNeighborId);
  const rightGroup = getGroupByFieldId(rightNeighborId);
  // A field joins a group only when the drop point is genuinely inside that group.
  const targetGroupId = leftGroup && rightGroup && leftGroup.id === rightGroup.id ? leftGroup.id : undefined;
  const remainsInSourceGroup = Boolean(sourceGroup && (leftGroup?.id === sourceGroup.id || rightGroup?.id === sourceGroup.id));

  if (sourceGroup && !remainsInSourceGroup) {
    columnGroups = columnGroups
      .map((group) => (group.id === sourceGroup.id ? { ...group, fieldIds: group.fieldIds.filter((id) => id !== fieldId) } : group))
      .filter((group) => group.fieldIds.length >= 2);
  }

  if (targetGroupId && targetGroupId !== sourceGroup?.id) {
    columnGroups = columnGroups.map((group) => {
      if (group.id !== targetGroupId || group.fieldIds.includes(fieldId)) {
        return group;
      }
      const memberIds = new Set([...group.fieldIds, fieldId]);
      return {
        ...group,
        fieldIds: columnOrder.filter((id) => memberIds.has(id)),
      };
    });
  }

  return { columnOrder, columnGroups };
};

export const moveColumn: ICollaCommandDef<IMoveColumnOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }

    const view = snapshot.meta.views.find((view) => view.id === viewId);

    const getColumnIndexMap = () => {
      const columnsMap: { [id: string]: number } = {};
      if (!view) {
        return columnsMap;
      }
      for (const [k, v] of view.columns.entries()) {
        columnsMap[v.fieldId] = k;
      }
      return columnsMap;
    };

    const columnIndexMapById = getColumnIndexMap();

    if (isEmpty(data)) {
      return null;
    }

    if (!view) {
      throw new Error(t(Strings.error_move_column_failed_invalid_params));
    }

    const frozenColumnCount = (view as IGridViewProperty).frozenColumnCount;
    let finalFrozenColumnCount = frozenColumnCount;

    // --- column(field) group bookkeeping -----------------------------------------------
    // Keep column group membership in sync with drag-and-drop. A field inserted between two
    // members of the same group joins that group; a grouped field moved away from every member of
    // its source group leaves it. Groups with fewer than two members are dissolved automatically.
    //
    // `data` can contain several selected fields. Recompute `simulatedColumnOrder` incrementally,
    // in the same sequence as the ListMove actions, so later fields see memberships established by
    // earlier moves in the batch. Membership is always derived from field ids rather than indices.
    const originalColumnGroups = (view as IGridViewProperty).columnGroups;
    let columnGroupMoveState: IColumnGroupMoveState = {
      columnOrder: view.columns.map((column) => column.fieldId),
      columnGroups: originalColumnGroups,
    };

    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { fieldId, overTargetId, direction } = recordOption;
      const originColumnIndex = columnIndexMapById[fieldId]!;
      const targetColumnIndex = columnIndexMapById[overTargetId!]!;
      let targetIndex = originColumnIndex > targetColumnIndex ? targetColumnIndex + 1 : targetColumnIndex;
      if (direction === DropDirectionType.BEFORE) {
        targetIndex--;
      }
      if (targetIndex === 0) {
        // Do not allow dragging other columns to the first column
        return collected;
      }
      if (originColumnIndex === 0) {
        // The first column does not allow dragging
        return collected;
      }
      const action = DatasheetActions.moveColumns2Action(snapshot, { fieldId, target: targetIndex, viewId });

      if (!action) {
        return collected;
      }

      if (frozenColumnCount) {
        if (targetIndex < frozenColumnCount && originColumnIndex >= frozenColumnCount) {
          finalFrozenColumnCount++;
        }
        if (targetIndex >= frozenColumnCount && originColumnIndex < frozenColumnCount) {
          finalFrozenColumnCount--;
        }
      }

      columnGroupMoveState = getColumnGroupMoveState(columnGroupMoveState, recordOption);

      if (collected.length) {
        const transformedAction = jot.transform([action], collected, 'right');
        collected.push(...transformedAction);
      } else {
        collected.push(action);
      }

      return collected;
    }, []);

    if (actions.length === 0) {
      return null;
    }

    if (frozenColumnCount && frozenColumnCount !== finalFrozenColumnCount) {
      const action = DatasheetActions.setFrozenColumnCount2Action(snapshot, { viewId, count: finalFrozenColumnCount });
      action && actions.push(action);
    }

    if (originalColumnGroups && originalColumnGroups.length) {
      const columnGroupsAction = DatasheetActions.setColumnGroups2Action(snapshot, {
        viewId,
        columnGroups: columnGroupMoveState.columnGroups,
      });
      columnGroupsAction && actions.push(columnGroupsAction);
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IMoveRowOptions & { cmd: 'MoveRow' });
 }
 }

 */
