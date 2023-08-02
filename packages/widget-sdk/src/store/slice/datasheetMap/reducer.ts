import {
  filterDatasheetOp,
  IDeleteViewDerivation,
  IPatchViewDerivation,
  ISetViewDerivation,
  JOTApply,
  selection
} from '@apitable/core';
import { ActionConstants } from 'core';
import { IDatasheetClient, IDatasheetMain, IDatasheetMap, IWidgetDatasheetState } from 'interface';
import { AnyAction, combineReducers } from 'redux';
import { IAddDatasheetAction } from './action';
import { produce } from 'immer';
import { omit } from 'lodash';

export const datasheetMapReducer = (
  state: IDatasheetMap = {},
  action: AnyAction,
): IDatasheetMap => {
  if (!action.datasheetId) {
    return state;
  }
  if (action.type === ActionConstants.ADD_DATASHEET) {
    const newState = { ...state, [action.datasheetId]: (action as IAddDatasheetAction).payload };
    return newState;
  }
  const result = datasheetPack(state[action.datasheetId], action);
  if (result === state[action.datasheetId]) {
    return state;
  }
  return {
    ...state,
    [action.datasheetId]: result,
  };
};
export const datasheetPack = combineReducers<IWidgetDatasheetState>({
  connected: (state = false, action) => {
    if (action.type === ActionConstants.DATASHEET_CONNECTED) {
      return true;
    }
    return state;
  },
  datasheet: produce((state: IDatasheetMain | null = null, action) => {
    if (!state) {
      return null;
    }
    switch(action.type) {
      case ActionConstants.DATAPACK_LOADED: {
        state = { ...state, ...action.payload };
        return state;
      }
      case ActionConstants.UPDATE_DATASHEET: {
        state = { ...state, ...action.payload };
        return state;
      }
      case ActionConstants.DATASHEET_JOT_ACTION: {
        return JOTApply(state as any, action, filterDatasheetOp);
      }
      case ActionConstants.UPDATE_SNAPSHOT: {
        state = { ...state, snapshot: action.payload };
        return state;
      }
      case ActionConstants.REFRESH_SNAPSHOT: {
        state.snapshot = { ...state.snapshot };
        return state;
      }
    }
    return state;
  }),
  client: combineReducers<IDatasheetClient>({
    selection,
    viewDerivation(state = {}, action: ISetViewDerivation | IPatchViewDerivation | IDeleteViewDerivation) {
      if (action.type === ActionConstants.SET_VIEW_DERIVATION) {
        return { ...state, [action.payload.viewId]: action.payload.viewDerivation };
      }
  
      if (action.type === ActionConstants.PATCH_VIEW_DERIVATION) {
        const oldState = state[action.payload.viewId];
        if (oldState) {
          return {
            ...state,
            [action.payload.viewId]: { ...oldState, ...action.payload.viewDerivation },
          };
        }
        return state;
      }

      if (action.type === ActionConstants.DELETE_VIEW_DERIVATION) {
        return omit(state, [action.payload.viewId]);
      }

      return state;
    },
  })
});
  
