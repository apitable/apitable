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
import { ITemporaryView } from '../../exports/store/interfaces';
import { IJOTAction } from 'engine';
import { CollaCommandName } from '..';
import { ResourceType } from 'types';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
export interface IManualSaveView {
  cmd: CollaCommandName.ManualSaveView;
  viewId: string;
  viewProperty: ITemporaryView
}

export const manualSaveView: ICollaCommandDef<IManualSaveView> = {
  undoable: false,

  execute: (context, options) => {
    const { state: state, fieldMapSnapshot } = context;
    const { viewProperty, viewId } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);

    if (!snapshot) {
      return null;
    }

    const manualSaveViewActions = DatasheetActions.manualSaveView2Action(snapshot, { viewId, viewProperty });

    if (!manualSaveViewActions) {
      return null;
    }

    const actions: IJOTAction[] = [...manualSaveViewActions];

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      fieldMapSnapshot
    };
  },
};
