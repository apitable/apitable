import produce from 'immer';
import { AnyAction, combineReducers } from 'redux';
import { ActionConstants } from 'store';
import { IResetDashboard, ISetDashboardClientAction, ISetDashboardDataAction, ISetDashboardLoadingAction, IUpdateDashboardName } from 'store/actions';
import { IUpdateDashboardInfo } from '../../../interface';
import * as actions from 'store/action_constants';
import {
  IChangeResourceSyncingStatus, IDashboard, IDashboardClient, IDashboardMap, IDashboardPack, IJOTActionPayload,
  IResourceErrCode, IRoomInfoSync, ISetResourceConnected, IUpdateResource,
  IUpdateRevision, IDeActiveDashboardCollaborator, IActiveDashboardCollaboratorAction,
} from 'store/interface';
import { JOTApply } from '../jot_apply';

export const dashboardMap = (state: IDashboardMap = {}, action: IResetDashboard | AnyAction): IDashboardMap => {
  if (!action.dashboardId) {
    return state;
  }
  if (action.type === actions.RESET_DASHBOARD) {
    const newState = { ...state };
    delete newState[action.dashboardId];
    return newState;
  }

  return {
    ...state,
    [action.dashboardId]: dashboardPack(state[action.dashboardId], action as any),
  };
};

type IDashboardAction = ISetDashboardLoadingAction | ISetDashboardDataAction | ISetDashboardClientAction |
  IJOTActionPayload | IUpdateRevision | ISetResourceConnected | IChangeResourceSyncingStatus |
  IRoomInfoSync | IResourceErrCode | IUpdateResource | IResetDashboard | IUpdateDashboardName | IUpdateDashboardInfo |
  IDeActiveDashboardCollaborator | IActiveDashboardCollaboratorAction;

export const dashboard = (state: IDashboard | null = null, action: IDashboardAction): IDashboard | null => {
  if (action.type === ActionConstants.SET_DASHBOARD_DATA) {
    return action.payload;
  }
  if (!state) {
    return null;
  }
  switch (action.type) {
    case ActionConstants.UPDATE_DASHBOARD_INFO:
    case ActionConstants.UPDATE_DASHBOARD: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case ActionConstants.DASHBOARD_JOT_ACTION: {
      return produce<IDashboard, IDashboard>(state, draft => {
        JOTApply(draft, action);
        return draft;
      });
    }
    case ActionConstants.DASHBOARD_UPDATE_REVISION: {
      return {
        ...state,
        revision: action.payload,
      };
    }
    case ActionConstants.UPDATE_DASHBOARD_NAME: {
      state.name = action.payload;
      return state;
    }
    default: {
      return state;
    }
  }
};

const defaultClient = {
  isFullScreen: false,
  showRecommendPanel: false,
  collaborators: [],
};
const client = (state: IDashboardClient = defaultClient, action: IDashboardAction): IDashboardClient => {
  switch (action.type) {
    case ActionConstants.DASHBOARD_ACTIVE_COLLABORATOR: {
      if (!state.collaborators) {
        return { ...state, collaborators: [action.payload] };
      } else if (state.collaborators.find(user => user.socketId === action.payload.socketId)) {
        console.error('warning user enter with same socketid');
        return state;
      }
      state.collaborators = [...state.collaborators, action.payload];
      return state;
    }
    case ActionConstants.DASHBOARD_DEACTIVATE_COLLABORATOR: {
      if (!state.collaborators) {
        return state;
      }
      state.collaborators = state.collaborators.filter(user => user.socketId !== action.payload.socketId);
      return state;
    }
    case ActionConstants.DASHBOARD_ROOM_INFO_SYNC: {
      return {
        ...state,
        collaborators: action.payload,
      };
    }
    case ActionConstants.SET_DASHBOARD_CLIENT: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

const dashboardPack = combineReducers<IDashboardPack>({
  loading: (state = false, action) => {
    if (action.type === ActionConstants.SET_DASHBOARD_LOADING) {
      return action.payload;
    }
    if (
      action.type === ActionConstants.DASHBOARD_ERROR_CODE ||
      action.type === ActionConstants.SET_DASHBOARD_DATA
    ) {
      return false;
    }

    return state;
  },
  connected: (state = false, action) => {
    if (action.type === ActionConstants.DASHBOARD_CONNECTED) {
      return true;
    }
    return state;
  },
  errorCode: (state = null, action) => {
    if (action.type === ActionConstants.DASHBOARD_ERROR_CODE) {
      return action.payload;
    }
    if (
      action.type === ActionConstants.SET_DASHBOARD_LOADING ||
      action.type === ActionConstants.SET_DASHBOARD_DATA
    ) {
      return null;
    }
    return state;
  },
  syncing: (state = false, action) => {
    if (action.type === ActionConstants.SET_DASHBOARD_SYNCING) {
      return action.payload;
    }
    return state;
  },
  dashboard,
  client,
});
