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
import { IGridViewProperty } from '../../exports/store/interfaces';
import { DropDirectionType } from 'modules/shared/store/constants';
import { Strings, t } from '../../exports/i18n';
import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { CollaCommandName } from 'commands/enum';

import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';

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

    const view = snapshot.meta.views.find(view => view.id === viewId);

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
          finalFrozenColumnCount ++;
        }
        if (targetIndex >= frozenColumnCount && originColumnIndex < frozenColumnCount) {
          finalFrozenColumnCount --;
        }
      }

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
