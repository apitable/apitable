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

import { DashboardApi } from 'exports/api';
import { StatusCode } from 'config';
import { batchActions } from 'redux-batched-actions';
import * as ActionConstants from 'modules/shared/store/action_constants';
import { deleteNode } from 'modules/space/store/actions/catalog_tree';
import { IDashboard, IDashboardClient, IReduxState, ICollaborator } from 'exports/store/interfaces';
import { getDashboardPack, getInstalledWidgetInDashboard } from 'modules/database/store/selectors/resource/dashboard';
import { receiveInstallationWidget } from '../widget';
import { UPDATE_DASHBOARD_NAME, UPDATE_DASHBOARD_INFO } from 'modules/shared/store/action_constants';
import { fetchWidgetsByWidgetIds } from 'modules/database/store/actions/resource';

export const fetchDashboardPack = (dashboardId: string, successFn?: (props?: any) => void, overWrite = false) => {
  return (dispatch: any, getState: () => IReduxState) => {
    const state = getState();
    const { shareId, templateId, embedId } = state.pageParams;
    const dashboardPack = getDashboardPack(state, dashboardId);
    const dashboardLoading = dashboardPack?.loading;
    const dashboard = dashboardPack?.dashboard;

    if (dashboardLoading) {
      return;
    }
    const fetchMethod = (() => {
      if (shareId) {
        return DashboardApi.fetchShareDashboardPack.bind(null, dashboardId, shareId);
      }
      if (templateId) {
        return DashboardApi.fetchTemplateDashboardPack.bind(null, dashboardId, templateId);
      }
      if (embedId) {
        return DashboardApi.fetchEmbedDashboardPack.bind(null, dashboardId, embedId);
      }
      return DashboardApi.fetchDashboardPack.bind(null, dashboardId);
    })();

    if (dashboard && !overWrite) {
      const installWidgetIds = getInstalledWidgetInDashboard(state) || [];
      if (installWidgetIds.length) {
        dispatch(fetchWidgetsByWidgetIds(installWidgetIds));
      }
      successFn?.();
      return;
    }
    dispatch(setDashboardLoading(true, dashboardId));
    return fetchMethod()
      .then((response: any) => {
        return Promise.resolve({ dispatch, getState, response, dashboardId });
      })
      .catch((err: any) => {
        if (state.catalogTree.treeNodesMap[dashboardId]) {
          dispatch(deleteNode({ nodeId: dashboardId, parentId: state.catalogTree.treeNodesMap[dashboardId]!.parentId }));
        }
        dispatch(setDashboardErrorCode(dashboardId, StatusCode.COMMON_ERR));
        throw err;
      })
      .then((props: any) => {
        fetchSuccess(props);
        props.response.data.success && successFn?.(props);
      });
  };
};

export const setDashboardErrorCode = (dashboardId: string, code: number | null) => {
  return {
    type: ActionConstants.DASHBOARD_ERROR_CODE,
    payload: code,
    dashboardId,
  };
};

export const fetchSuccess = ({
  dispatch,
  response,
  dashboardId,
}: {
  dispatch: any;
  getState: () => IReduxState;
  response: any;
  dashboardId: string;
}) => {
  const { data, success, code } = response.data;
  if (success) {
    const _batchActions: any[] = [setDashboard(data.dashboard, data.dashboard.id)];

    if (Object.keys(data.widgetMap)) {
      for (const key in data.widgetMap) {
        _batchActions.push(receiveInstallationWidget(key, data.widgetMap[key]));
      }
    }
    dispatch(batchActions(_batchActions));
    return;
  }
  dispatch(setDashboardErrorCode(dashboardId, code));
};

export const setDashboardLoading = (status: boolean, dashboardId: string): ISetDashboardLoadingAction => {
  return {
    type: ActionConstants.SET_DASHBOARD_LOADING,
    payload: status,
    dashboardId: dashboardId,
  };
};

export const setDashboard = (data: IDashboard, dashboardId: string): ISetDashboardDataAction => {
  return {
    type: ActionConstants.SET_DASHBOARD_DATA,
    payload: data,
    dashboardId: dashboardId,
  };
};

export const resetDashboard = (dashboardId: string) => {
  return {
    type: ActionConstants.RESET_DASHBOARD,
    dashboardId: dashboardId,
  };
};

export interface IResetDashboard {
  type: typeof ActionConstants.RESET_DASHBOARD;
  dashboardId: string;
}

export interface ISetDashboardLoadingAction {
  type: typeof ActionConstants.SET_DASHBOARD_LOADING;
  payload: boolean;
  dashboardId: string;
}

export interface ISetDashboardDataAction {
  type: typeof ActionConstants.SET_DASHBOARD_DATA;
  payload: IDashboard;
  dashboardId: string;
}

export const setDashboardClient = (client: Partial<IDashboardClient>): ISetDashboardClientAction => {
  return {
    type: ActionConstants.SET_DASHBOARD_CLIENT,
    payload: client,
  };
};

export const activeDashboardCollaborator = (payload: ICollaborator, resourceId: string) => {
  return {
    type: ActionConstants.DASHBOARD_ACTIVE_COLLABORATOR,
    dashboardId: resourceId,
    payload,
  };
};

export const deactivateDashboardCollaborator = (payload: { socketId: string }, resourceId: string) => {
  return {
    type: ActionConstants.DASHBOARD_DEACTIVATE_COLLABORATOR,
    dashboardId: resourceId,
    payload,
  };
};

export interface ISetDashboardClientAction {
  type: typeof ActionConstants.SET_DASHBOARD_CLIENT;
  payload: Partial<IDashboardClient>;
}

export const updateDashboardName = (newName: string, dashboardId: string) => {
  return {
    type: UPDATE_DASHBOARD_NAME,
    dashboardId,
    payload: newName,
  };
};

export const updateDashboard = (dashboardId: string, data: Partial<IDashboard>) => {
  return {
    type: UPDATE_DASHBOARD_INFO,
    dashboardId,
    payload: data,
  };
};

export interface IUpdateDashboardName {
  type: typeof ActionConstants.UPDATE_DASHBOARD_NAME;
  dashboardId: string;
  payload: string;
}
