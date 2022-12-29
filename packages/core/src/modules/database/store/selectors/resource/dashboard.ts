import { DEFAULT_PERMISSION } from '../../../../../exports/store';
import { IDashboard, IDashboardPack, IReduxState } from '../../../../../exports/store/interfaces';

export const getDashboardPack = (state: IReduxState, id?: string): null | undefined | IDashboardPack => {
  const dashboardId = state.pageParams.dashboardId || id;
  if (!dashboardId) {
    return;
  }
  const dashboardPack = state.dashboardMap[dashboardId];
  if (!dashboardPack) {
    return;
  }
  return dashboardPack;
};

export const getDashboard = (state: IReduxState, id?: string): null | undefined | IDashboard => {
  const dashboardPack = getDashboardPack(state, id);
  return dashboardPack?.dashboard;
};

export const getDashboardSnapshot = (state: IReduxState, id?: string) => {
  const dashboardPack = getDashboard(state, id);
  return dashboardPack?.snapshot;
};

export const getDashboardLayout = (state: IReduxState) => {
  const snapshot = getDashboardSnapshot(state);
  return snapshot?.widgetInstallations.layout;
};

export const getInstalledWidgetInDashboard = (state: IReduxState) => {
  const snapshot = getDashboardSnapshot(state);
  const layout = snapshot?.widgetInstallations.layout || [];
  return layout.map(v => v.id);
};

export const getDashboardClient = (state: IReduxState) => {
  const dashboardPack = getDashboardPack(state);
  return dashboardPack?.client;
};

export const getDashboardLoading = (state: IReduxState) => {
  const dashboardPack = getDashboardPack(state);
  return dashboardPack?.loading;
};

export const getDashboardErrCode = (state: IReduxState) => {
  const dashboardPack = getDashboardPack(state);
  return dashboardPack?.errorCode;
};

export const getDashboardPermission = (state: IReduxState) => {
  const dashboardPack = getDashboardPack(state);
  if (!dashboardPack || !dashboardPack.dashboard || !dashboardPack.connected) {
    return DEFAULT_PERMISSION;
  }

  return dashboardPack.dashboard.permissions;
};
