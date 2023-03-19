import { Middleware, AnyAction, MiddlewareAPI, Dispatch } from 'redux';
import {
  IReduxState, ActionConstants, Selectors
} from '@apitable/core';
import { aggregationWidgetPermission, mainMessage, setPermissionAction } from '@apitable/widget-sdk';
import { getDependenceDstIds } from 'pc/utils/dependence_dst';

const updatePermissions = (store: MiddlewareAPI<Dispatch<AnyAction>, IReduxState>) => {
  const state = store.getState();
  mainMessage.widgets.forEach((_widget, widgetId) => {
    const action = setPermissionAction(aggregationWidgetPermission(state, widgetId));
    mainMessage.syncAction(widgetId, action);
  });
};

const syncActionSubscribeView = (store: MiddlewareAPI<Dispatch<AnyAction>, IReduxState>, action: AnyAction) => {
  const _datasheetId = action.datasheetId;
  const _viewId = action.payload.viewId;
  const state = store.getState();
  // Cache updates are only synced to applets that have subscribed to the view.
  mainMessage.widgets.forEach((v, k) => {
    v.subscribeViews.forEach(({ datasheetId, viewId }) => {
      if (datasheetId === _datasheetId && Selectors.getViewIdByNodeId(state, datasheetId, viewId) === _viewId) {
        mainMessage.syncAction(k, action);
      }
    });
  });
};

const syncActionBroadcast = (store: MiddlewareAPI<Dispatch<AnyAction>, IReduxState>, action: AnyAction) => {
  const foreignDatasheetIds = getDependenceDstIds(store.getState(), action.datasheetId);
  mainMessage.syncActionBroadcast(action, foreignDatasheetIds);
};

/**
 * The widget data synchronizer, by intercepting the data action of concern synchronization, synchronizes to the widget.
 * docs: https://vikadata.feishu.cn/docs/doccnrkKfzHY98Z5XEiKjIjejvl
 */

type IUpdateWidgetAction = AnyAction;

export const widgetSyncDataMiddleware: Middleware<{}, IReduxState> = store => next => (action: IUpdateWidgetAction) => {
  next(action);
  switch(action.type) {
    case ActionConstants.SET_DASHBOARD_DATA:
    case ActionConstants.UPDATE_DASHBOARD: {
      // permission update
      updatePermissions(store);
      return;
    }
    case ActionConstants.UPDATE_DATASHEET: {
      // permission || datasheet update
      if (action.payload.permissions) {
        updatePermissions(store);
        return;
      }
      syncActionBroadcast(store, action);
      return;
    }
    case ActionConstants.DATASHEET_JOT_ACTION: {
      // datasheet update
      syncActionBroadcast(store, action);
      return;
    }
    case ActionConstants.SET_ACTIVE_CELL:
    case ActionConstants.CLEAR_SELECTION:
    case ActionConstants.SET_SELECTION: {
      // datasheetMap - client update
      syncActionBroadcast(store, action);
      return;
    }
    case ActionConstants.PATCH_VIEW_DERIVATION:
    case ActionConstants.SET_VIEW_DERIVATION:
    case ActionConstants.DELETE_VIEW_DERIVATION: {
      // calc update
      syncActionSubscribeView(store, action);
      return;
    }
    case ActionConstants.WIDGET_JOT_ACTION: {
      // widget update
      mainMessage.syncAction(action.widgetId, action);
      return;
    }
    case ActionConstants.DATASHEET_ERROR_CODE: {
      // widget bind datasheet errorCode
      return;
    }
    case ActionConstants.UPDATE_UNIT_MAP:
    case ActionConstants.UPDATE_USER_MAP:
    case ActionConstants.RESET_UNIT_INFO: {
      // unitMap update
      syncActionBroadcast(store, action);
      return;
    }
    case ActionConstants.SET_USER_AVATAR:
    case ActionConstants.SET_NICKNAME:
    case ActionConstants.UPDATE_USERINFO: {
      // user info update
      syncActionBroadcast(store, action);
      return;
    }
    case ActionConstants.DATASHEET_ACTIVE_COLLABORATOR: // collaborator enter
    case ActionConstants.MIRROR_ACTIVE_COLLABORATOR:
    case ActionConstants.DASHBOARD_ACTIVE_COLLABORATOR:
    case ActionConstants.DATASHEET_DEACTIVATE_COLLABORATOR: // collaborator leave
    case ActionConstants.DASHBOARD_DEACTIVATE_COLLABORATOR:
    case ActionConstants.MIRROR_DEACTIVATE_COLLABORATOR: {
      syncActionBroadcast(store, action);
      return;
    }
    case ActionConstants.SET_PAGE_PARAMS: {
      // activeViewId
      syncActionBroadcast(store, action);
      return;
    }
    case ActionConstants.CACHE_TEMPORARY_VIEW: {
      // mirror view property update
      syncActionBroadcast(store, action);
      return;
    }
  }
  return;
};