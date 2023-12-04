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

import { ExecuteResult, ICollaCommandDef, ICommandOptionBase } from 'command_manager';
import { Strings, t } from '../../exports/i18n';
import { WidgetActions } from 'commands_actions/widget';
import { ResourceType } from 'types';
import { getResourcePack } from 'modules/database/store/selectors/resource';

export interface ISetGlobalStorage extends ICommandOptionBase {
  key: string;
  value: any;
}

const MAX_GLOBAL_STORAGE_KEY = 100;

export const setGlobalStorage: ICollaCommandDef<ISetGlobalStorage> = {
  undoable: false,

  execute(context, options) {
    const state = context.state;
    const { resourceId, key, value } = options;
    const widgetPack = getResourcePack(state, resourceId, ResourceType.Widget);

    if (!widgetPack) {
      return null;
    }

    const widgetSnapshot = widgetPack.widget.snapshot;

    if (Object.keys(widgetSnapshot).length > MAX_GLOBAL_STORAGE_KEY) {
      throw new Error(t(Strings.global_storage_size_large));
    }

    const setGlobalStorageAction = WidgetActions.setGlobalStorage2Action(widgetSnapshot, { key, value });

    if (!setGlobalStorageAction) {
      return null;
    }

    return {
      resourceId: options.resourceId,
      resourceType: options.resourceType,
      result: ExecuteResult.Success,
      actions: setGlobalStorageAction,
    };
  },
};
