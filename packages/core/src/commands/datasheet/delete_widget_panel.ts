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
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { CollaCommandName } from '..';

export interface IDeleteWidgetPanel {
  cmd: CollaCommandName.DeleteWidgetPanel;
  deletePanelId: string;
  resourceId: string;
  resourceType: ResourceType.Datasheet | ResourceType.Mirror;
}

export const deleteWidgetPanel: ICollaCommandDef<IDeleteWidgetPanel> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IDeleteWidgetPanel) {
    const { state: state } = context;
    const { deletePanelId, resourceType, resourceId } = options;

    const widgetPanels = getResourceWidgetPanels(state, resourceId, resourceType);

    if (!widgetPanels) {
      return null;
    }

    const panel = widgetPanels.find(item => item.id === deletePanelId);

    if (!panel) {
      return null;
    }

    const deleteWidgetPanelAction = DatasheetActions.deleteWidgetPanel2Action(state, deletePanelId, widgetPanels, resourceType);

    if (!deleteWidgetPanelAction) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: resourceId,
      resourceType: resourceType,
      actions: deleteWidgetPanelAction,
    };
  },
};
