import { Strings, t } from 'i18n';
import { ResourceType } from 'types';
import { CollaCommandName } from '..';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { DashboardAction } from '../../model/dashboard';
import { IDashboardLayout, Selectors } from '../../exports/store';
import { DASHBOARD_MAX_WIDGET_COUNT } from 'config/constant';

export interface IAddWidgetToDashboard {
  cmd: CollaCommandName.AddWidgetToDashboard;
  dashboardId: string;
  widgetIds: string[];
  cols?: number;
}

const WIDTH = 3;

export const addWidgetToDashboard: ICollaCommandDef<IAddWidgetToDashboard> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options: IAddWidgetToDashboard) {
    const { model: state } = context;
    const { dashboardId, widgetIds, cols } = options;
    const dashboardSnapshot = Selectors.getDashboardSnapshot(state, dashboardId);

    if (!dashboardSnapshot) {
      return null;
    }

    const layout = dashboardSnapshot.widgetInstallations.layout || [];

    if (layout.length + widgetIds.length > DASHBOARD_MAX_WIDGET_COUNT) {
      throw new Error(t(Strings.reach_dashboard_installed_limit, { count: DASHBOARD_MAX_WIDGET_COUNT }));
    }

    const newLayouts: IDashboardLayout[] = widgetIds.map((widgetId, index) => {
      return {
        id: widgetId,
        widthInColumns: WIDTH,
        heightInRoes: 6,
        // calculation formula
        // https://github.com/STRML/react-grid-layout/blob/master/test/examples/6-dynamic-add-remove.jsx
        row: Number.MAX_SAFE_INTEGER,
        column: ((layout.length + index) * WIDTH) % (cols || 12),
      };
    });

    const addWidgetActions = DashboardAction.addWidget2Action(dashboardSnapshot, { layout: newLayouts });

    if (!addWidgetActions) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: dashboardId,
      resourceType: ResourceType.Dashboard,
      actions: addWidgetActions,
    };
  },
} as ICollaCommandDef<IAddWidgetToDashboard>;
