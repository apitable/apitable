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

import { IJOTAction } from 'engine/ot';
import { DatasheetActions } from 'commands_actions/datasheet';
import { ISortInfo, ResourceType } from 'types';
import { getActiveDatasheetId, getDatasheet, getFieldPermissionMap, getFieldRoleByFieldId } from 'modules/database/store/selectors/resource/datasheet/base';
import { getCurrentView } from 'modules/database/store/selectors/resource/datasheet/calc';
import { IGridViewProperty } from '../../exports/store/interfaces';
import { Strings, t } from '../../exports/i18n';
import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { ConfigConstant } from 'config';

export interface ISetSortInfoOptions {
  cmd: CollaCommandName.SetSortInfo;
  viewId: string;
  data?: ISortInfo;
  applySort?: boolean;
}

export const setSortInfo: ICollaCommandDef<ISetSortInfoOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data, viewId, applySort } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);
    const fieldIds = (getCurrentView(state, datasheetId)! as IGridViewProperty).columns.map(item => item.fieldId);
    const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);
    if (!state || !datasheet) {
      return null;
    }

    const hasInvalidSort = data && data.rules.some(sortField => {
      const fieldRole = getFieldRoleByFieldId(fieldPermissionMap, sortField.fieldId);

      // If the column permission is set, the current column does not exist in the view data, so ignore this situation
      if (fieldRole === ConfigConstant.Role.None) {
        return false;
      }
      return !fieldIds.includes(sortField.fieldId);
    });

    // Determine whether the FieldId of the current operation exists or not
    if (hasInvalidSort) {
      throw new Error(t(Strings.error_sorted_failed_the_field_not_exist));
    }

    // Determine whether the currently operating view is the active view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_sorted_failed_wrong_target_view));
    }

    const actions: IJOTAction[] = [];

    const setSortInfoAction = DatasheetActions.setViewSort2Action(state, datasheet.snapshot, { viewId, sortInfo: data, applySort });
    // action && collected.push(action);
    setSortInfoAction && actions.push(...setSortInfoAction);

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

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: ISetRecordsOptions & { cmd: 'SetRecords' });
 }
 }

 */
