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

import { DatasheetActions } from 'commands_actions/datasheet';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { IJOTAction } from 'engine';
import { IViewProperty } from '../../exports/store/interfaces';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { CollaCommandName } from '..';
import { ResourceType } from 'types';
import { manualSaveView } from 'commands/datasheet/manual_save_view';

export interface ISetViewAutoSave {
  cmd: CollaCommandName.SetViewAutoSave;
  viewId: string;
  autoSave: boolean;
  viewProperty?: IViewProperty
}

export const setViewAutoSave: ICollaCommandDef<ISetViewAutoSave> = {
  undoable: false,

  execute: (context, options) => {
    const { state: state, fieldMapSnapshot } = context;
    const { autoSave, viewId, viewProperty } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }

    const setViewAutoSaveAction = DatasheetActions.setViewAutoSave2Action(snapshot, { viewId, autoSave });

    if (!setViewAutoSaveAction) {
      return null;
    }

    const actions: IJOTAction[] = [setViewAutoSaveAction];

    if (viewProperty) {
      const manualSaveViewActions = manualSaveView.execute(context, { cmd: CollaCommandName.ManualSaveView, viewId, viewProperty });

      if (manualSaveViewActions) {
        if (manualSaveViewActions.result === ExecuteResult.Fail) {
          return manualSaveViewActions;
        }
        actions.push(...manualSaveViewActions.actions);
      }
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      fieldMapSnapshot
    };
  },
};
