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

import { isEmpty, find } from 'lodash';
import { IJOTAction } from 'engine/ot';
import { DatasheetActions } from 'model';
import { Selectors } from '../../exports/store';
import { t, Strings } from '../../exports/i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
// import { IGridViewProperty } from 'store/interface';

export interface IMoveView {
  newIndex: number;
  viewId: string;
}

export interface IMoveViewsOptions {
  cmd: CollaCommandName.MoveViews;
  data: IMoveView[];
}

export const moveViews: ICollaCommandDef<IMoveViewsOptions> = {

  undoable: true,

  execute: (context, options) => {

    const { model: state } = context;
    const { data } = options;
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
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
