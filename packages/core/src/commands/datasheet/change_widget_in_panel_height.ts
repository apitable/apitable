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

import { ICollaCommandDef, ICollaCommandExecuteContext, ExecuteResult } from 'command_manager';
import { getResourceWidgetPanels } from 'modules/database/store/selectors/resource';
import { DatasheetActions } from 'commands_actions/datasheet';
import { ResourceType } from 'types';
import { CollaCommandName } from 'commands/enum';

export interface IChangeWidgetInPanelHeight {
  cmd: CollaCommandName.ChangeWidgetInPanelHeight;
  panelId: string;
  widgetId: string;
  widgetHeight: number;
  resourceId: string;
  resourceType: ResourceType;
}

export const changeWidgetInPanelHeight: ICollaCommandDef<IChangeWidgetInPanelHeight> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options) {
    const { state: state } = context;
    const { widgetId, resourceId, resourceType, panelId, widgetHeight } = options;
    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);

    if (!widgetPanels) { return null; }

    const widgetPanelIndex = widgetPanels.findIndex(item => item.id === panelId);

    if (widgetPanelIndex < 0) { return null; }

    const widgets = widgetPanels[widgetPanelIndex]!.widgets;
    const widgetIndex = widgets.findIndex(item => item.id === widgetId);

    if (widgetIndex < 0) { return null; }

    const changeWidgetHeightAction = DatasheetActions.changeWidgetHeight2Action(
      state, { widgetIndex, widgetPanelIndex, widgetHeight, resourceId, resourceType }
    );

    if (!changeWidgetHeightAction) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId,
      resourceType,
      actions: changeWidgetHeightAction,
    };
  },
};