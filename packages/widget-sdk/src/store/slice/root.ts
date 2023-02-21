import { IWidgetState } from 'interface';
import { SET_ERROR_CODE, SET_USER_INFO } from '../constant';
import { datasheetMapReducer } from './datasheetMap/reducer';
import { IUserInfo } from 'core';
import { Reducers } from '@apitable/core';
import { permissionReducer } from './permission/reducer';
import { widgetReducer } from './widget/reducer';
import { combineReducers, createStore, Store } from 'redux';

const { unitInfo, pageParams, mirrorMap, collaborators } = Reducers;

export interface ISetErrorCodeAction {
  type: typeof SET_ERROR_CODE;
  payload: number | null;
}

export const setErrorCodeAction = (payload: number | null): ISetErrorCodeAction => ({ type: SET_ERROR_CODE, payload });

export const rootReducers = combineReducers<IWidgetState>({
  widget: widgetReducer,
  datasheetMap: datasheetMapReducer,
  unitInfo: unitInfo,
  pageParams: pageParams,
  mirrorMap: mirrorMap,
  collaborators: collaborators,
  permission: permissionReducer,
  errorCode: (state: number | null = null, action: ISetErrorCodeAction) => {
    switch (action.type) {
      case SET_ERROR_CODE:
        return action.payload;
      default:
        return state;
    }
  },
  user: (state: IUserInfo | null = null, action) => {
    switch (action.type) {
      case SET_USER_INFO: {
        state = action.payload;
        return state;
      }
      default:
        return state;
    }
  },
});

export let widgetStore = createStore(rootReducers) as Store<IWidgetState>;

export const initWidgetStore = (state: IWidgetState) => {
  const next = createStore(rootReducers, state);
  widgetStore = next;
  /** debug */
  (window as any)._widgetStore = next;
};
