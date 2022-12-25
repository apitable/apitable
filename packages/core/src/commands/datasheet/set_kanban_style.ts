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

import { Strings, t } from '../../exports/i18n';
import { KanbanView } from 'model';
import { ISetKanbanStyleValue } from '../../exports/store';
import { getActiveDatasheetId, getActualRowCount } from '../../exports/store/selectors';
import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef } from '../../command_manager';
import { IJOTAction } from '../../engine/ot';
import { getDatasheet } from '../../exports/store/selectors';
import { CollaCommandName } from '..';
import { addRecords } from './add_records';

export type ISetKanbanStyleOptions = {
  cmd: CollaCommandName.SetKanbanStyle;
  viewId: string;
  addRecord?: boolean
} & ISetKanbanStyleValue;

export const setKanbanStyle: ICollaCommandDef<ISetKanbanStyleOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const { viewId, addRecord, styleValue } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);
    if (!state || !datasheet) {
      return null;
    }

    // Determine whether the currently operating view is the active view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_modify_column_failed_wrong_target_view));
    }

    const actions: IJOTAction[] = [];

    const setKanbanStyleAction = KanbanView.setViewStyle2Action(datasheet.snapshot, options);
    setKanbanStyleAction && actions.push(setKanbanStyleAction);

    if (addRecord) {
      const rowCount = getActualRowCount(state)!;
      const unitId = state.user.info!.unitId;
      const addRecordActions = addRecords.execute(context, {
        cmd: CollaCommandName.AddRecords,
        viewId,
        index: rowCount,
        count: 1,
        cellValues: [{ [styleValue as string]: [unitId] }],
      });

      if (addRecordActions) {
        if (addRecordActions.result === ExecuteResult.Fail) {
          return addRecordActions;
        }
        actions.push(...addRecordActions.actions);
      }
    }
    if (actions.length === 0) {
      return null;
    }
    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};
