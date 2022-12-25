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
import { IFormMap, IFormClient, IFormState, IJOTActionPayload } from '../../../../../../exports/store/interfaces';
import { IResetFormAction } from 'modules/database/store/actions/resource/form';
import * as actions from '../../../../../shared/store/action_constants';
import { JOTApply } from '../index';

const form = (state: IFormState | null = null, action: AnyAction | IJOTActionPayload): IFormState | null => {
  if (action.type === actions.SET_FORM_DATA) {
    return action.payload;
  }
  if (!state) { return null; }
  switch (action.type) {
    case actions.UPDATE_FORM: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case actions.FORM_PROP_UPDATE: {
      return {
        ...state,
        snapshot: {
          ...state.snapshot,
          formProps: {
            ...state.snapshot.formProps,
            ...action.payload,
          }
        }
      };
    }
    case actions.FORM_JOT_ACTION: {
      return produce<IFormState, IFormState>(state, draft => {
        JOTApply(draft, action as IJOTActionPayload);
        return draft;
      });
    }
    case actions.FORM_UPDATE_REVISION: {
      return {
        ...state,
        revision: action.payload,
      };
    }
    case actions.UPDATE_FORM_NAME: {
      state.name = action.payload;
      return state;
    }
    default: {
      return state;
    }
  }
};

const defaultClient = {};

const client = (state: IFormClient = defaultClient, action: AnyAction): IFormClient => {
  switch (action.type) {
    case actions.FORM_ACTIVE_COLLABORATOR: {
      if (!state.collaborators) {
        return { ...state, collaborators: [action.payload] };
      } else if (state.collaborators.find(user => user.socketId === action.payload.socketId)) {
        console.error('warning user enter with same socketid');
        return state;
      }
      state.collaborators = [...state.collaborators, action.payload];
      return state;
    }
    case actions.FORM_DEACTIVATE_COLLABORATOR: {
      if (!state.collaborators) {
        return state;
      }
      state.collaborators = state.collaborators.filter(user => user.socketId !== action.payload.socketId);
      return state;
    }
    case actions.FORM_ROOM_INFO_SYNC: {
      return {
        ...state,
        collaborators: action.payload,
      };
    }
    case actions.SET_FORM_CLIENT: {
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

const formPack = combineReducers({
  loading: (state = false, action) => {
    if (action.type === actions.SET_FORM_LOADING) {
      return action.payload;
    }
    if (
      action.type === actions.FORM_ERROR_CODE ||
      action.type === actions.SET_FORM_DATA
    ) {
      return false;
    }

    return state;
  },
  connected: (state = false, action) => {
    if (action.type === actions.FORM_CONNECTED) {
      return true;
    }
    return state;
  },
  errorCode: (state = null, action) => {
    if (action.type === actions.FORM_ERROR_CODE) {
      return action.payload;
    }
    if (
      action.type === actions.SET_FORM_LOADING ||
      action.type === actions.SET_FORM_DATA
    ) {
      return null;
    }
    return state;
  },
  syncing: (state = false, action) => {
    if (action.type === actions.SET_FORM_SYNCING) {
      return action.payload;
    }
    return state;
  },
  form,
  client,
});

export const formMap = (
  state: IFormMap = {},
  action: IResetFormAction | AnyAction,
): IFormMap => {
  if (!action.formId) {
    return state;
  }
  if (action.type === actions.RESET_FORM) {
    const newState = { ...state };
    delete newState[action.formId];
    return newState;
  }

  return {
    ...state,
    [action.formId]: formPack(state[action.formId], action as any),
  };
};
