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
import { getCustomConfig } from 'config';
import { IJOTAction } from 'engine/ot';
import { find, isEmpty } from 'lodash';
import { DatasheetActions } from 'commands_actions/datasheet';
import { ResourceType } from 'types';
import { Strings, t } from '../../exports/i18n';
import { IViewColumn } from '../../exports/store/interfaces';

import {
  getActiveDatasheetId,
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';

export interface IModifyViewBase {
  viewId: string;
}

export interface IModifyViewColumns extends IModifyViewBase {
  key: 'columns';
  value: IViewColumn[];
}

export interface IModifyViewStrings extends IModifyViewBase {
  key: 'name' | 'description';
  value: string;
}

export interface IModifyViewBoolean extends IModifyViewBase {
  key: 'displayHiddenColumnWithinMirror';
  value: boolean;
}

export type IModifyView = IModifyViewColumns | IModifyViewStrings | IModifyViewBoolean;

export type IModifySelfView = Omit<IModifyViewColumns, 'viewId'> | Omit<IModifyViewStrings, 'viewId'> | Omit<IModifyViewBoolean, 'viewId'>;

export interface IModifyViewsOptions {
  cmd: CollaCommandName.ModifyViews;
  data: IModifyView[];
  datasheetId?: string;
}

export const modifyViews: ICollaCommandDef<IModifyViewsOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { state: state } = context;
    const { data, datasheetId: _datasheetId } = options;
    const activeDatasheetId = getActiveDatasheetId(state)!;
    const datasheetId = _datasheetId || activeDatasheetId;
    const snapshot = getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const views = snapshot.meta.views;

    if (isEmpty(data)) {
      return null;
    }

    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { viewId, key, value } = recordOption;

      // character is too long or not filled
      if (key === 'name' && (value.length > (getCustomConfig().VIEW_NAME_MAX_COUNT || 30) || value.length < 1)) {
        return collected;
      }

      // Check if there is a view with the same name
      if (key === 'name' && find(views, { name: value as string })) {
        throw new Error(t(Strings.error_modify_view_failed_duplicate_name));
      }
      // Check if viewId exists
      if (!find(views, { id: viewId })) {
        throw new Error(t(Strings.error_modify_view_failed_not_found_target));
      }
      const action = DatasheetActions.modifyView2Action(snapshot, { viewId, key, value });
      action && collected.push(...action);
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
 execute(options: IModifyViewOptions & { cmd: 'ReplaceViews' });
 }
 }

 */
