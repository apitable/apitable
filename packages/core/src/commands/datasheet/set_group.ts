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
import { getActiveDatasheetId, getDatasheet, getFieldPermissionMap, getFieldRoleByFieldId } from 'modules/database/store/selectors/resource/datasheet/base';
import { getCurrentView } from 'modules/database/store/selectors/resource/datasheet/calc';
import { IGridViewProperty, Role } from '../../exports/store/interfaces';
import { IGroupInfo, ResourceType } from 'types';
import { Strings, t } from '../../exports/i18n';
import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

export interface ISetGroupOptions {
  cmd: CollaCommandName.SetGroup;
  data?: IGroupInfo;
  viewId: string;
}

export const setGroup: ICollaCommandDef<ISetGroupOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);
    const fieldIds = (getCurrentView(state, datasheetId)! as IGridViewProperty).columns.map(item => item.fieldId);
    const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);

    if (!state || !datasheet) {
      return null;
    }

    // Determine whether the currently operating view is the active view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_group_failed_wrong_target_view));
    }

    const checkMissGroupField = () => {
      return data && data.filter(item => {
        // Data missing due to permissions is expected and will not be processed
        if (getFieldRoleByFieldId(fieldPermissionMap, item.fieldId) === Role.None) {
          return false;
        }
        return !fieldIds.includes(item.fieldId);
      }).length;
    };

    // Check if the field used by grouping exists in the current view
    if (checkMissGroupField()) {
      throw new Error(t(Strings.error_group_failed_the_column_not_exist));
    }

    const actions: IJOTAction[] = [];
    const setSortInfoAction = DatasheetActions.setGroupInfoField2Action(datasheet.snapshot, { viewId, groupInfo: data });
    setSortInfoAction && actions.push(setSortInfoAction);

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
