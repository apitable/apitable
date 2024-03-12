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

import produce from 'immer';
import { AnyAction, combineReducers } from 'redux';
import {
  IActiveCollaboratorAction, ICacheTemporaryView, IChangeMirrorWidgetPanelWidth, IDeActiveCollaborator, IMirror, IMirrorClient,
  ISwitchMirrorActivePanel, IToggleMirrorWidgetPanel, IUpdateMirrorInfo, IWidgetPanelStatus
} from '../../../../../../exports/store/interfaces';
import * as ActionConstants from 'modules/shared/store/action_constants';
import * as actions from '../../../../../shared/store/action_constants';
import { CHANGE_WIDGET_PANEL_WIDTH, SWITCH_ACTIVE_PANEL, TOGGLE_WIDGET_PANEL } from '../../../../../shared/store/action_constants';
import {
  IResetMirror, ISetMirrorClientAction, ISetMirrorDataAction, ISetMirrorLoadingAction, IUpdateMirrorInfoAction, IUpdateMirrorName,
} from 'modules/database/store/actions/resource/mirror';
import {
  IChangeResourceSyncingStatus, IJOTActionPayload, IMirrorMap, IMirrorPack, IResourceErrCode, IRoomInfoSync, ISetResourceConnected, IUpdateResource,
  IUpdateRevision,
} from '../../../../../../exports/store/interfaces';
import { JOTApply } from 'modules/database/store/reducers/resource/jot_apply';

export const mirrorMap = (state: IMirrorMap = {}, action: IResetMirror | AnyAction): IMirrorMap => {
  if (!action.mirrorId) {
    return state;
  }
  if (action.type === actions.RESET_MIRROR) {
    const newState = { ...state };
    delete newState[action.mirrorId];
    return newState;
  }

  return {
    ...state,
    [action.mirrorId]: mirrorPack(state[action.mirrorId], action as any),
  };
};

type IMirrorAction = ISetMirrorLoadingAction | ISetMirrorDataAction | ISetMirrorClientAction |
  IJOTActionPayload | IUpdateRevision | ISetResourceConnected | IChangeResourceSyncingStatus |
  IRoomInfoSync | IResourceErrCode | IUpdateResource | IResetMirror | IUpdateMirrorName | IUpdateMirrorInfo |
  IDeActiveCollaborator | IActiveCollaboratorAction | IUpdateMirrorInfoAction | ICacheTemporaryView | IToggleMirrorWidgetPanel
  | IChangeMirrorWidgetPanelWidth | ISwitchMirrorActivePanel;

export const mirror = (state: IMirror | null = null, action: IMirrorAction): IMirror | null => {
  if (action.type === ActionConstants.SET_MIRROR_DATA) {
    return action.payload;
  }
  if (!state) {
    return null;
  }
  switch (action.type) {
    case ActionConstants.UPDATE_MIRROR_INFO:
    case ActionConstants.UPDATE_MIRROR: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case ActionConstants.UPDATE_MIRROR_NAME: {
      return {
        ...state,
        name: action.payload,
      };
    }
    case actions.CACHE_TEMPORARY_VIEW: {
      if (!state) {
        return state;
      }
      return {
        ...state,
        temporaryView: {
          ...(state.temporaryView || {}),
          ...action.payload
        }
      };
    }
    case ActionConstants.MIRROR_UPDATE_REVISION: {
      return {
        ...state,
        revision: action.payload,
      };
    }
    case ActionConstants.MIRROR_JOT_ACTION: {
      return produce<IMirror, IMirror>(state, draft => {
        JOTApply(draft, action);
        return draft;
      });
    }
    default: {
      return state;
    }
  }
};
const MIN_WIDGET_PANEL_WIDTH = 320;
const defaultWidgetPanelStatus: IWidgetPanelStatus = {
  opening: false,
  width: MIN_WIDGET_PANEL_WIDTH,
  activePanelId: null,
  loading: false,
};

const defaultClient = {
  collaborators: [],
  widgetPanelStatus: defaultWidgetPanelStatus
};

const client = (state: IMirrorClient = defaultClient, action: IMirrorAction): IMirrorClient => {
  switch (action.type) {
    case ActionConstants.MIRROR_ACTIVE_COLLABORATOR: {
      if (!state.collaborators) {
        return { ...state, collaborators: [action.payload] };
      } else if (state.collaborators.find(user => user.socketId === action.payload.socketId)) {
        console.error('warning user enter with same socketid');
        return state;
      }
      state.collaborators = [...state.collaborators, action.payload];
      return state;
    }
    case ActionConstants.MIRROR_DEACTIVATE_COLLABORATOR: {
      if (!state.collaborators) {
        return state;
      }
      state.collaborators = state.collaborators.filter(user => user.socketId !== action.payload.socketId);
      return state;
    }
    case ActionConstants.MIRROR_ROOM_INFO_SYNC: {
      return {
        ...state,
        collaborators: action.payload,
      };
    }
    case ActionConstants.SET_MIRROR_CLIENT: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case TOGGLE_WIDGET_PANEL: {
      return {
        ...state,
        widgetPanelStatus: {
          ...state.widgetPanelStatus,
          opening: action.payload == null ? !state.widgetPanelStatus.opening : action.payload,
        }
      };
    }
    case CHANGE_WIDGET_PANEL_WIDTH: {
      return {
        ...state,
        widgetPanelStatus: {
          ...state.widgetPanelStatus,
          width: Math.max(action.payload, MIN_WIDGET_PANEL_WIDTH),
        }
      };
    }
    case SWITCH_ACTIVE_PANEL: {
      return {
        ...state,
        widgetPanelStatus: {
          ...state.widgetPanelStatus,
          activePanelId: action.payload,
        }
      };
    }
    default: {
      return state;
    }
  }
};

const mirrorPack = combineReducers<IMirrorPack>({
  loading: (state = false, action) => {
    if (action.type === ActionConstants.SET_MIRROR_LOADING) {
      return action.payload;
    }
    if (
      action.type === ActionConstants.MIRROR_ERROR_CODE ||
      action.type === ActionConstants.SET_MIRROR_DATA
    ) {
      return false;
    }

    return state;
  },
  connected: (state = false, action) => {
    if (action.type === ActionConstants.MIRROR_CONNECTED) {
      return true;
    }
    return state;
  },
  errorCode: (state = null, action) => {
    if (action.type === ActionConstants.MIRROR_ERROR_CODE) {
      return action.payload;
    }
    if (
      action.type === ActionConstants.SET_MIRROR_LOADING ||
      action.type === ActionConstants.SET_MIRROR_DATA
    ) {
      return null;
    }
    return state;
  },
  syncing: (state = false, action) => {
    if (action.type === ActionConstants.SET_MIRROR_SYNCING) {
      return action.payload;
    }
    return state;
  },
  mirror,
  client,
});
