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
import { DashboardAction } from '../../commands_actions/dashboard';
import { IDashboardLayout } from '../../exports/store/interfaces';
import { getInstalledWidgetInDashboard,getDashboardSnapshot } from 'modules/database/store/selectors/resource/dashboard';

import { CollaCommandName } from '..';

export interface IChangeDashboardLayout {
  cmd: CollaCommandName.ChangeDashboardLayout;
  dashboardId: string;
  layout: IDashboardLayout[]
}

export const changeDashboardLayout: ICollaCommandDef<IChangeDashboardLayout> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options) {
    const { state: state } = context;
    const { dashboardId, layout } = options;
    const installedWidgetIds = getInstalledWidgetInDashboard(state);
    if (!installedWidgetIds) { return null; }

    const ids = layout.map(item => { return item.id; });

    const _ids = [...new Set([...ids, ...installedWidgetIds])];

    if (_ids.length !== ids.length) {
      return null;
    }

    const dashboardSnapshot = getDashboardSnapshot(state);

    if (!dashboardSnapshot) { return null;}

    const changeDashBoardLayoutAction = DashboardAction.changeWidgetLayout2Action(dashboardSnapshot, { layout: layout });

    if (!changeDashBoardLayoutAction) { return null; }

    return {
      result: ExecuteResult.Success,
      resourceId: dashboardId,
      resourceType: ResourceType.Dashboard,
      actions: changeDashBoardLayoutAction,
    };
  },
};