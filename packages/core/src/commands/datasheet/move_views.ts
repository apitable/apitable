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

import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { IJOTAction } from 'engine/ot';
import { find, isEmpty } from 'lodash';
import { DatasheetActions } from 'commands_actions/datasheet';
import { ResourceType } from 'types';
import { Strings, t } from '../../exports/i18n';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
// import { IGridViewProperty } from 'store/interface';

export interface IMoveView {
  newIndex: number;
  viewId: string;
}

export interface IMoveViewsOptions {
  cmd: CollaCommandName.MoveViews;
  data: IMoveView[];
}

export type IMoveSelfView = Omit<IMoveView, 'viewId'>;

export const moveViews: ICollaCommandDef<IMoveViewsOptions> = {

  undoable: true,

  execute: (context, options) => {

    const { state: state } = context;
    const { data } = options;
    const datasheetId = getActiveDatasheetId(state)!;
    const snapshot = getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const views = snapshot.meta.views;

    if (isEmpty(data)) {
      return null;
    }

    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { newIndex, viewId } = recordOption;

      // Check if viewId exists

      if (!find(views, { id: viewId })) {
        throw new Error(t(Strings.error_move_view_failed_not_found_target));
      }
      const action = DatasheetActions.moveView2Action(snapshot, { viewId, target: newIndex });
      action && collected.push(action);
      return collected;
    }, []);

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
    execute(options: IMoveViewOptions & { cmd: 'MoveViews' });
  }
}

*/
