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

import { find, isEmpty } from 'lodash';
import { IJOTAction, jot } from 'engine/ot';
import { DatasheetActions } from 'commands_actions/datasheet';
import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { Strings, t } from '../../exports/i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';

// import { IGridViewProperty } from 'store/interface';

export interface IDeleteView {
  viewId: string;
}

export interface IDeleteViewsOptions {
  cmd: CollaCommandName.DeleteViews;
  data: IDeleteView[];
}

export const deleteViews: ICollaCommandDef<IDeleteViewsOptions> = {

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
      const { viewId } = recordOption;

      if (views.length === 1) {
        // The last view cannot be deleted
        return collected;
      }

      // Check if viewId exists
      if (!find(views, { id: viewId })) {
        throw new Error(t(Strings.error_del_view_failed_not_found_target));
      }

      const action = DatasheetActions.deleteView2Action(snapshot, { viewId });

      if (!action) {
        return collected;
      }

      if (collected.length) {
        const transformedAction = jot.transform([action], collected, 'right');
        collected.push(...transformedAction);
      } else {
        collected.push(action);
      }

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
 execute(options: IDeleteViewsOptions & { cmd: 'DeleteViews' });
 }
 }

 */
