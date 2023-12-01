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

import { DEFAULT_PERMISSION } from 'modules/shared/store/constants';
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
