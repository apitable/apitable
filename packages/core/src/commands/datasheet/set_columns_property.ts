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
import { StatType } from 'model/field/stat';
import { getActiveDatasheetId, getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import { getFieldMap } from 'modules/database/store/selectors/resource/datasheet/calc';
import { Strings, t } from '../../exports/i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

export interface ISetColumnsPropertyOptions {
  cmd: CollaCommandName.SetColumnsProperty;
  viewId: string;
  fieldId: string;
  data: {
    width?: number;
    statType?: StatType;
  };
}

export const setColumnsProperty: ICollaCommandDef<ISetColumnsPropertyOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { fieldId, viewId, data } = options;
    const { width, statType } = data;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);
    const fieldMap = getFieldMap(state, datasheetId)!;

    if (!state || !datasheet) {
      return null;
    }

    // Determine whether the currently operating view is the active view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_modify_column_failed_wrong_target_view));
    }

    if (!fieldMap[fieldId]) {
      throw new Error(t(Strings.error_modify_column_failed_column_not_exist));
    }

    const actions: IJOTAction[] = [];
    if (width) {
      const changeColumnsWidthAction = DatasheetActions.setColumnWidth2Action(datasheet.snapshot, { viewId, fieldId, width });
      changeColumnsWidthAction && actions.push(changeColumnsWidthAction);
    }
    if (statType != null) {
      const changeFieldStatAction = DatasheetActions.setColumnStatType2Action(datasheet.snapshot, { viewId, fieldId, statType });
      changeFieldStatAction && actions.push(changeFieldStatAction);
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
/*

declare module 'command_manager/command_manager' {
  interface CollaCommandManager {
    execute(options: ISetRecordsOptions & { cmd: 'SetRecords' });
  }
}

*/
