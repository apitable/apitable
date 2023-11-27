import { Middleware, AnyAction, MiddlewareAPI, Dispatch } from 'redux';
import { IReduxState, ActionConstants, Selectors } from '@apitable/core';
import { aggregationWidgetPermission, eventMessage, mainMessage, setPermissionAction } from '@apitable/widget-sdk';
import { getDependenceDstIds } from 'pc/utils/dependence_dst';
import { CONST_BATCH_ACTIONS } from './view_derivation_middleware';

const updatePermissions = (store: MiddlewareAPI<Dispatch<AnyAction>, IReduxState>) => {
  const state = store.getState();
  eventMessage.widgets.forEach((_widget, widgetId) => {
    const action = setPermissionAction(aggregationWidgetPermission(state, widgetId));
    eventMessage.syncAction(action, widgetId);
  });
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
  eventMessage.widgets.forEach((v, k) => {
    v.subscribeViews.forEach(({ datasheetId, viewId }) => {
      if (datasheetId === _datasheetId && Selectors.getViewIdByNodeId(state, datasheetId, viewId) === _viewId) {
        eventMessage.syncAction(action, k);
      }
    });
  });
};

const syncActionBroadcast = (action: AnyAction) => {
  mainMessage.syncActionBroadcast(action);
  eventMessage.syncAction(action);
};

const syncActionDatasheet = (store: MiddlewareAPI<Dispatch<AnyAction>, IReduxState>, action: AnyAction) => {
  mainMessage.widgets.forEach((_widget, widgetId) => {
    const subscribeDstIds = _widget.subscribeViews.map((v) => v.datasheetId);
    const dstIds = new Set([_widget.bindDatasheetId, ...subscribeDstIds]);
    if (action.datasheetId) {
      const state = store.getState();
      const dependenceDstIds = getDependenceDstIds(state, action.datasheetId);
      const needEmit = [...dstIds].find((dstId) => dependenceDstIds?.includes(dstId) || dstId === action.datasheetId);
      needEmit && mainMessage.syncAction(widgetId, action);
    }
  });
  eventMessage.syncAction(action);
};

/**
 * The widget data synchronizer, by intercepting the data action of concern synchronization, synchronizes to the widget.
 * docs: https://vikadata.feishu.cn/docs/doccnrkKfzHY98Z5XEiKjIjejvl
 */

type IUpdateWidgetAction = AnyAction;

export const widgetSyncDataMiddleware: Middleware<{}, IReduxState> = (store) => (next) => (action: IUpdateWidgetAction) => {
  next(action);

  const handleActions = (action: IUpdateWidgetAction) => {
    switch (action.type) {
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
        syncActionDatasheet(store, action);
        return;
      }
      case ActionConstants.DATAPACK_LOADED: {
        // datasheet update
        syncActionDatasheet(store, action);
        return;
      }
      case ActionConstants.DATASHEET_JOT_ACTION: {
        // datasheet update
        syncActionDatasheet(store, action);
        return;
      }
      case ActionConstants.SET_ACTIVE_CELL:
      case ActionConstants.CLEAR_SELECTION:
      case ActionConstants.SET_RECORD_SELECTION:
      case ActionConstants.SET_SELECTION: {
        // datasheetMap - client update
        syncActionDatasheet(store, action);
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
        eventMessage.syncAction(action, action.widgetId);
        return;
      }
      case ActionConstants.DATASHEET_ERROR_CODE: {
        // widget bind datasheet errorCode
        return;
      }
      case ActionConstants.SET_USER_ME: {
        syncActionBroadcast(action);
        return;
      }
      case ActionConstants.UPDATE_UNIT_MAP:
      case ActionConstants.UPDATE_USER_MAP:
      case ActionConstants.RESET_UNIT_INFO: {
        // unitMap update
        syncActionBroadcast(action);
        return;
      }
      case ActionConstants.SET_USER_AVATAR:
      case ActionConstants.SET_NICKNAME:
      case ActionConstants.UPDATE_USERINFO: {
        // user info update
        syncActionBroadcast(action);
        return;
      }
      case ActionConstants.DATASHEET_ACTIVE_COLLABORATOR: // collaborator enter
      case ActionConstants.MIRROR_ACTIVE_COLLABORATOR:
      case ActionConstants.DASHBOARD_ACTIVE_COLLABORATOR:
      case ActionConstants.DATASHEET_DEACTIVATE_COLLABORATOR: // collaborator leave
      case ActionConstants.DASHBOARD_DEACTIVATE_COLLABORATOR:
      case ActionConstants.MIRROR_DEACTIVATE_COLLABORATOR: {
        syncActionBroadcast(action);
        return;
      }
      case ActionConstants.SET_PAGE_PARAMS: {
        // activeViewId
        syncActionBroadcast(action);
        return;
      }
      case ActionConstants.CACHE_TEMPORARY_VIEW: {
        // mirror view property update
        syncActionBroadcast(action);
        return;
      }
      case ActionConstants.REFRESH_SNAPSHOT: {
        // refresh snapshot for update cellValue cache.
        syncActionDatasheet(store, action);
      }
    }
  };

  switch (action.type) {
    case CONST_BATCH_ACTIONS: {
      const actions = action.payload as IUpdateWidgetAction[];
      actions.forEach((actionItem) => {
        switch (actionItem.type) {
          case ActionConstants.DATAPACK_LOADED: {
            handleActions(actionItem);
            return;
          }
        }
      });
      return;
    }
    default: {
      handleActions(action);
    }
  }
};
