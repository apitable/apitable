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

import { CollaCommandName } from 'commands/index';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { IJOTAction } from 'engine';
import { DatasheetActions } from 'commands_actions/datasheet';
import { getResourceWidgetPanels, getResourceWidgetPanelStatus } from 'modules/database/store/selectors/resource';

import { ResourceType } from 'types';
import { addWidgetPanel } from 'commands/common/add_widget_panel';

export interface IAddWidgetToPanel {
  cmd: CollaCommandName.AddWidgetToPanel;
  resourceId: string;
  resourceType: ResourceType.Mirror | ResourceType.Datasheet;
  widgetId: string;
}

export const addWidgetToPanel: ICollaCommandDef<IAddWidgetToPanel> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options) {
    const { state: state } = context;
    const { widgetId, resourceId, resourceType } = options;
    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);
    let panelIndex = 0;
    let installationIndex = 0;
    const actions: IJOTAction[] = [];

    if (!widgetPanels || !widgetPanels.length) {
      // The first time you install a widget, you need to install a panel first
      const rct = addWidgetPanel.execute(context, {
        cmd: CollaCommandName.AddWidgetPanel,
        resourceId,
        resourceType
      });
      if (rct && rct.result !== ExecuteResult.Fail) {
        actions.push(...rct.actions);
      }
    } else {
      const widgetPanelStatus = getResourceWidgetPanelStatus(state, resourceId, resourceType);
      const activePanelId = widgetPanelStatus?.activePanelId || widgetPanels[0]!.id;
      panelIndex = widgetPanels.findIndex(item => item.id === activePanelId);

      if (panelIndex < 0) {
        return null;
      }

      installationIndex = widgetPanels[panelIndex]!.widgets.length;
    }

    const addWidgetToPanelAction = resourceType === ResourceType.Datasheet ?
      DatasheetActions.addWidgetToPanel2Action(state, { installationIndex, panelIndex, widgetId }) :
      DatasheetActions.addWidgetToPanelWithMirror2Action(state, { installationIndex, panelIndex, widgetId });

    if (!addWidgetToPanelAction) {
      return null;
    }

    actions.push(...addWidgetToPanelAction);

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: actions,
    };
  },
};
