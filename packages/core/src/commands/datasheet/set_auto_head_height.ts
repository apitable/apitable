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
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { IJOTAction } from 'engine/ot';
import { Strings, t } from '../../exports/i18n';
import { DatasheetActions } from 'commands_actions/datasheet';
import { getActiveDatasheetId, getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import { ResourceType } from 'types';

export interface ISetAutoHeadHeightOptions {
  cmd: CollaCommandName.SetAutoHeadHeight;
  isAuto: boolean;
  viewId: string;
}

export const setAutoHeadHeight: ICollaCommandDef<ISetAutoHeadHeightOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { isAuto, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const datasheet = getDatasheet(state, datasheetId);

    if (!state || !datasheet) {
      return null;
    }

    // Determine whether the current operating view is the active view
    if (datasheet.activeView !== viewId) {
      throw new Error(t(Strings.error_set_row_height_failed_wrong_target_view));
    }

    const actions: IJOTAction[] = [];
    const setAutoHeadHeightAction = DatasheetActions.setAutoHeadHeight2Action(datasheet.snapshot, { viewId, isAuto });
    setAutoHeadHeightAction && actions.push(setAutoHeadHeightAction);
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
