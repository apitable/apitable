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

import { AnyAction, combineReducers } from 'redux';
import { WIDGET_JOT_ACTION, WIDGET_UPDATE_REVISION } from '../../../../../shared/store/action_constants';
import { IJOTActionPayload, IUnMountWidget, IWidget } from '../../../../../../exports/store/interfaces';
import { RECEIVE_INSTALLATIONS_WIDGET, RESET_WIDGET } from '../../../../../shared/store/action_constants';
import { JOTApply } from '../index';
import produce from 'immer';

export const widgetMap = (state = {}, action: IUnMountWidget | AnyAction) => {
  if (action.type === RESET_WIDGET) {
    const newState = { ...state };
    for (const id of action.payload) {
      delete newState[id];
    }
    return newState;
  }
  
  if (!action.widgetId) {
    return state;
  }
  
  return {
    ...state,
    [action.widgetId]: widgetPack(state[action.widgetId], action),
  };
};

export const widget = (state: IWidget, action: AnyAction) => {
  if (action.type === RECEIVE_INSTALLATIONS_WIDGET) {
    return action.payload;
  }
  if (!state) {
    return null;
  }
  switch (action.type) {
    case WIDGET_JOT_ACTION:
      return produce(state, draft => {
        JOTApply(draft, action as IJOTActionPayload);
        return draft;
      });
    case WIDGET_UPDATE_REVISION:
      return {
        ...state,
        revision: action.payload,
      };
    default: {
      return state;
    }
  }
};

// TODO： finish more here
export const widgetPack = combineReducers({
  loading: (state = false, _action) => {
    return state;
  },
  syncing: (state = false, _action) => {
    return state;
  },
  connected: (state = false, _action) => {
    return state;
  },
  widget,
});

