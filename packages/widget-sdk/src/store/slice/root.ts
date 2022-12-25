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
