import { REFRESH_SNAPSHOT } from '@apitable/core/dist/store/action_constants';
import { datasheet } from 'core';
import { IDatasheetMap } from 'interface';
import { AnyAction } from 'redux';
import { REFRESH_USED_DATASHEET, REFRESH_USED_DATASHEET_CLIENT, REFRESH_USED_DATASHEET_SIMPLE } from '../../constant';
import { IStoreRefreshDatasheetClientAction, IStoreRefreshDatasheetMapAction, IStoreRefreshDatasheetSimpleAction } from './action';

export function datasheetMapReducer(
  state: IDatasheetMap = {},
  action: IStoreRefreshDatasheetMapAction | IStoreRefreshDatasheetClientAction | IStoreRefreshDatasheetSimpleAction | AnyAction): IDatasheetMap {
  switch (action.type) {
    case REFRESH_USED_DATASHEET: {
      return {
        ...state,
        ...action.payload
      };
    }
    case REFRESH_USED_DATASHEET_CLIENT: {
      const datasheetId = action.payload.datasheetId;
      if (!datasheetId || !state[datasheetId]) {
        return state;
      }
      return {
        ...state,
        [datasheetId]: {
          ...state[datasheetId],
          client: action.payload.client
        }
      };
    }
    case REFRESH_USED_DATASHEET_SIMPLE: {      
      const updateState = {};
      Object.keys(action.payload).forEach(datasheetId => {
        if (state[datasheetId]) {
          updateState[datasheetId] = {
            ...state[datasheetId],
            datasheet: {
              ...state[datasheetId]?.datasheet,
              ...action.payload[datasheetId]
            }
          };
        }
      });
      return {
        ...state,
        ...updateState
      };
    }
    case REFRESH_SNAPSHOT: {
      const datasheetId = (action as AnyAction).datasheetId;
      return {
        ...state,
        [datasheetId]: {
          ...state[datasheetId],
          datasheet: {
            ...state[datasheetId]?.datasheet,
            snapshot: { ...state[datasheetId]?.datasheet.snapshot }
          }
        }
      };
    }
    default: {
      const datasheetId = (action as any).datasheetId;
      if (!datasheetId || !state[datasheetId]?.datasheet) {
        return state;
      }
      return {
        ...state,
        [datasheetId]: {
          ...state[datasheetId],
          datasheet: datasheet(state[datasheetId]?.datasheet as any, action as any)
        }
      };
    }
  }
}
