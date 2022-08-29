import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { DashboardAction } from '../../model/dashboard';
import { IDashboardLayout, Selectors } from '../../store';
import { CollaCommandName } from '..';

export interface IChangeDashboardLayout {
  cmd: CollaCommandName.ChangeDashboardLayout;
  dashboardId: string;
  layout: IDashboardLayout[]
}

export const changeDashboardLayout: ICollaCommandDef<IChangeDashboardLayout> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options) {
    const { model: state } = context;
    const { dashboardId, layout } = options;
    const installedWidgetIds = Selectors.getInstalledWidgetInDashboard(state);
    if (!installedWidgetIds) { return null; }

    const ids = layout.map(item => { return item.id; });

    const _ids = [...new Set([...ids, ...installedWidgetIds])];

    if (_ids.length !== ids.length) {
      return null;
    }

    const dashboardSnapshot = Selectors.getDashboardSnapshot(state);

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