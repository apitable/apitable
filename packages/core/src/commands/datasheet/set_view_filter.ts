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
import { getActiveDatasheetId, getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import { IFilterInfo, ResourceType } from 'types';
import { Strings, t } from '../../exports/i18n';
import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

export interface ISetViewFilterOptions {
  cmd: CollaCommandName.SetViewFilter;
  data?: IFilterInfo;
  viewId: string;
}

export const setViewFilter: ICollaCommandDef<ISetViewFilterOptions> = {
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
      throw new Error(t(Strings.error_filter_failed_wrong_target_view));
    }

    const actions: IJOTAction[] = [];
    const setFilterInfoAction = DatasheetActions.setFilterInfo2Action(datasheet.snapshot, { viewId, filterInfo: data });

    // action && collected.push(action);
    setFilterInfoAction && actions.push(setFilterInfoAction);
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
