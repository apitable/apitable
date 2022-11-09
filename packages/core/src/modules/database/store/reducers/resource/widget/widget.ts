import { AnyAction, combineReducers } from 'redux';
import { WIDGET_JOT_ACTION, WIDGET_UPDATE_REVISION } from '../../../../../shared/store/action_constants';
import { IJOTActionPayload, IUnMountWidget, IWidget } from '../../../../../../store/interfaces';
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

