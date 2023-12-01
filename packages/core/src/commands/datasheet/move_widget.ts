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

import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { CollaCommandName } from '..';
import { getResourceWidgetPanels } from 'modules/database/store/selectors/resource';
import { IWidgetInPanel } from '../../exports/store/interfaces';

export interface IMoveWidget {
  cmd: CollaCommandName.MoveWidget;
  layout: IWidgetInPanel[];
  resourceId: string;
  resourceType: ResourceType.Datasheet | ResourceType.Mirror;
  panelId: string;
}

export const moveWidget: ICollaCommandDef<IMoveWidget> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IMoveWidget) {
    const { state: state } = context;
    const { layout, panelId, resourceType, resourceId } = options;
    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);

    if (!widgetPanels) {
      return null;
    }

    const activePanelIndex = widgetPanels.findIndex(item => item.id === panelId);

    if (activePanelIndex < 0) {
      return null;
    }

    const widgets = widgetPanels[activePanelIndex]!.widgets;
    const installedWidgetIds = widgets.map(widget => widget.id);
    const ids = layout.map(v => v.id);
    const _ids = [...new Set([...ids, ...installedWidgetIds])];
    if (_ids.length !== ids.length) {
      return null;
    }

    const moveWidgetAction = DatasheetActions.moveWidget2Action(state, {
      widgetPanelIndex: activePanelIndex, layout, resourceType, resourceId
    });

    if (!moveWidgetAction) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: moveWidgetAction,
    };
  },
};
