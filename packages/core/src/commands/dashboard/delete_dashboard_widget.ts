import { CollaCommandName } from 'commands';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from 'command_manager';
import { Selectors } from '../../exports/store';
import { ResourceType } from 'types';
import { DashboardAction } from '../../model/dashboard';

export interface IDeleteDashboardWidget {
  cmd: CollaCommandName.DeleteDashboardWidget;
  dashboardId: string;
  widgetId: string;
}

export const deleteDashboardWidget: ICollaCommandDef<IDeleteDashboardWidget> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IDeleteDashboardWidget) {
    const { model: state } = context;
    const { dashboardId, widgetId } = options;
    const snapshot = Selectors.getDashboardSnapshot(state);

    if (!snapshot) {
      return null;
    }

    const installedIds = Selectors.getInstalledWidgetInDashboard(state);

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
