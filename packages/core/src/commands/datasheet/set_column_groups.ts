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
import { ViewType } from 'modules/shared/store/constants';
import { IColumnGroup, IGridViewProperty, Role } from '../../exports/store/interfaces';
import { ResourceType } from 'types';
import { Strings, t } from '../../exports/i18n';
import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

/**
 * column(field) grouping, this is unrelated to `SetGroup`(row grouping by field value), do not confuse the two.
 */
export interface ISetColumnGroupsOptions {
  cmd: CollaCommandName.SetColumnGroups;
  data?: IColumnGroup[];
  viewId: string;
}

export const setColumnGroups: ICollaCommandDef<ISetColumnGroupsOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);

    if (!state || !datasheet) {
      return null;
    }

    // Determine whether the currently operating view is the active view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_group_failed_wrong_target_view));
    }

    const view = getCurrentView(state, datasheetId);

    // column(field) grouping only applies to grid view
    if (!view || view.type !== ViewType.Grid) {
      return null;
    }

    const fieldIds = (view as IGridViewProperty).columns.map(item => item.fieldId);
    const fieldPermissionMap = getFieldPermissionMap(state, datasheetId);

    const isFieldMissing = (fieldId: string) => {
      // Data missing due to permissions is expected and will not be processed
      if (getFieldRoleByFieldId(fieldPermissionMap, fieldId) === Role.None) {
        return false;
      }
      return !fieldIds.includes(fieldId);
    };

    // Check if the fields used by column groups exist in the current view
    const hasMissingField = data && data.some(group => group.fieldIds.some(isFieldMissing));
    if (hasMissingField) {
      throw new Error(t(Strings.error_group_failed_the_column_not_exist));
    }

    // a field can only belong to one group, when a fieldId shows up in more than one group,
    // keep it in the group where it first appears and drop it from the later ones.
    let columnGroups = data;
    if (columnGroups) {
      const seenFieldIds = new Set<string>();
      columnGroups = columnGroups
        .map(group => {
          const dedupedFieldIds = group.fieldIds.filter(fieldId => {
            if (seenFieldIds.has(fieldId)) {
              return false;
            }
            seenFieldIds.add(fieldId);
            return true;
          });
          return dedupedFieldIds.length === group.fieldIds.length ? group : { ...group, fieldIds: dedupedFieldIds };
        })
        .filter(group => group.fieldIds.length > 0);
    }

    const actions: IJOTAction[] = [];
    const setColumnGroupsAction = DatasheetActions.setColumnGroups2Action(datasheet.snapshot, { viewId, columnGroups });
    setColumnGroupsAction && actions.push(setColumnGroupsAction);

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
