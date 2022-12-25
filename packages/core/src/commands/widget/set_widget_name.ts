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
import { WidgetActions } from 'model';
import { Selectors } from '../../exports/store';
import { ResourceType } from 'types';

export interface ISetWidgetName extends ICommandOptionBase {
  newWidgetName: string
}

export const setWidgetName: ICollaCommandDef<ISetWidgetName> = {
  undoable: false,

  execute(context, options) {
    const state = context.model;
    const { resourceId, newWidgetName } = options;
    const widgetPack = Selectors.getResourcePack(state, resourceId, ResourceType.Widget);

    if (!widgetPack) {
      return null;
    }
    
    const widgetSnapshot = widgetPack.widget.snapshot;

    const setWidgetNameAction = WidgetActions.setWidgetName2Action(widgetSnapshot, { newWidgetName });

    if (!setWidgetNameAction) {
      return null;
    }

    return {
      resourceId: resourceId,
      resourceType: options.resourceType,
      result: ExecuteResult.Success,
      actions: setWidgetNameAction,
    };
  },
};
