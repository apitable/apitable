import { ILabs, IShareInfo, IUserInfo } from 'core';
import { IWidgetState } from 'interface';
import { combineReducers, createStore, Store } from 'redux';
import { SET_ERROR_CODE, SET_LABS, SET_SHARE_INFO, SET_USER_INFO, UPDATE_DASHBOARD, UPDATE_UNIT_INFO } from '../constant';
import { calcCacheReducer } from './calc_cache/reducer';
import { datasheetMapReducer } from './datasheetMap/reducer';
import { mirrorMapReducer } from './mirror/reducer';
import { widgetReducer } from './widget/reducer';
import { widgetConfigReducer } from './widget_config/reducer';

export interface ISetErrorCodeAction {
  type: typeof SET_ERROR_CODE;
  payload: number | null;
}

export const setErrorCodeAction = (payload: number | null): ISetErrorCodeAction => ({ type: SET_ERROR_CODE, payload });

export const rootReducers = combineReducers<IWidgetState>({
  widget: widgetReducer,
  datasheetMap: datasheetMapReducer,
  widgetConfig: widgetConfigReducer,
  dashboard: (state, action) => {
    switch (action.type) {
      case UPDATE_DASHBOARD:
        return {
          ...state,
          ...action.payload
        };
      default:
        return state || null;
    }
  },
  unitInfo: (state, action) => {
    switch (action.type) {
      case UPDATE_UNIT_INFO:
        return action.payload;
      default:
        return state || null;
    }
  },
  errorCode: (state: number | null = null, action: ISetErrorCodeAction) => {
    switch (action.type) {
      case SET_ERROR_CODE:
        return action.payload;
      default:
        return state;
    }
  },
  // TODO: Selector computationally optimized post-removal.
  pageParams: (state, action) => {
    switch (action.type) {
      case 'UPDATE_PAGE_PARAMS':
        return action.payload;
      default:
        return state || {};
    }
  },
  labs: (state: ILabs = [], action) => {
    switch (action.type) {
      case SET_LABS: {
        state = action.payload;
        return state;
      }
      default:
        return state;
    }
  },
  share: (state: IShareInfo = {}, action) => {
    switch (action.type) {
      case SET_SHARE_INFO: {
        state = action.payload;
        return state;
      }
      default:
        return state;
    }
  },
  calcCache: calcCacheReducer,
  mirrorMap: mirrorMapReducer,
  user: (state: IUserInfo | null = null, action) => {
    switch (action.type) {
      case SET_USER_INFO: {
        state = action.payload;
        return state;
      }
      default:
        return state;
    }
  }
});

export const widgetStore: Store = createStore(rootReducers);
