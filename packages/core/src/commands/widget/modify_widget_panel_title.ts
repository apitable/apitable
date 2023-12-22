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

import { getResourceWidgetPanels } from 'modules/database/store/selectors/resource';
import { ResourceType } from 'types';
import { CollaCommandName } from '..';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { DatasheetActions } from '../../commands_actions/datasheet';

export interface IModifyWidgetPanelName {
  cmd: CollaCommandName.ModifyWidgetPanelName;
  panelId: string;
  panelName: string;
  resourceId: string;
  resourceType: ResourceType.Datasheet | ResourceType.Mirror;
}

export const modifyWidgetPanelName: ICollaCommandDef<IModifyWidgetPanelName> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IModifyWidgetPanelName) {
    const { state: state } = context;
    const { panelName, panelId, resourceId, resourceType } = options;

    if (!panelName) {
      return null;
    }

    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);

    if (!widgetPanels) {
      return null;
    }

    const panel = widgetPanels.find(item => item.id === panelId);

    if (!panel) {
      return null;
    }

    const existPanelNames = widgetPanels.map(item => { return item.name; });

    if (existPanelNames.includes(panelName)) {
      return null;
    }

    const moveWidgetPanelAction = DatasheetActions.modifyPanelName2Acton(state, { ...panel, name: panelName }, widgetPanels, resourceType);

    if (!moveWidgetPanelAction) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: moveWidgetPanelAction,
    };
  },
};
