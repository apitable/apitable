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

import { CollaCommandName } from 'commands/enum';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { getInstalledWidgetInDashboard,getDashboardSnapshot } from 'modules/database/store/selectors/resource/dashboard';

import { ResourceType } from 'types';
import { DashboardAction } from '../../commands_actions/dashboard';

export interface IDeleteDashboardWidget {
  cmd: CollaCommandName.DeleteDashboardWidget;
  dashboardId: string;
  widgetId: string;
}

export const deleteDashboardWidget: ICollaCommandDef<IDeleteDashboardWidget> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IDeleteDashboardWidget) {
    const { state: state } = context;
    const { dashboardId, widgetId } = options;
    const snapshot = getDashboardSnapshot(state);

    if (!snapshot) {
      return null;
    }

    const installedIds = getInstalledWidgetInDashboard(state);

    if (!installedIds) {
      return null;
    }

    if (!installedIds.includes(widgetId)) {
      return null;
    }

    const deleteDashboardWidgetAction = DashboardAction.deleteWidget2Action(snapshot, widgetId);

    if (!deleteDashboardWidgetAction) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: dashboardId,
      resourceType: ResourceType.Dashboard,
      actions: deleteDashboardWidgetAction,
    };
  },
};
