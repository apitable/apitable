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
import { DatasheetActions } from 'commands_actions/datasheet';
import {
  getResourceWidgetPanels,
  getResourceActiveWidgetPanel
} from 'modules/database/store/selectors/resource';

import { ResourceType } from 'types';
import { CollaCommandName } from 'commands/index';

export interface IDeleteWidgetAction {
  cmd: CollaCommandName.DeleteWidget;
  widgetId: string;
  resourceId: string;
  resourceType: ResourceType;
}

export const deleteWidget: ICollaCommandDef<IDeleteWidgetAction> = {
  undoable: false,

  execute: (context, options) => {
    const { state: state } = context;
    const { widgetId, resourceId, resourceType } = options;

    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);
    const activeWidgetPanel = getResourceActiveWidgetPanel(state, resourceId, resourceType);

    if (!widgetPanels || !activeWidgetPanel) {
      return null;
    }

    const widgetPanelIndex = widgetPanels.findIndex(item => item.id === activeWidgetPanel.id);
    if (widgetPanelIndex < 0) {
      return null;
    }

    const widgets = activeWidgetPanel.widgets;
    const widgetIndex = widgets.findIndex(item => item.id === widgetId);

    if (widgetIndex < 0) {
      return null;
    }

    const deleteWidgetAction = resourceType === ResourceType.Datasheet ?
      DatasheetActions.deleteWidget2Action(state, { widgetPanelIndex, widget: widgets[widgetIndex]!, widgetIndex }) :
      DatasheetActions.deleteMirrorWidget2Action(state, { widgetPanelIndex, widget: widgets[widgetIndex]!, widgetIndex });

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: deleteWidgetAction,
    };
  },
};
