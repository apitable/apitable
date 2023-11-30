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

import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, createStore as _createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { IReduxState, Reducers } from '@apitable/core';
import { viewDerivationMiddleware } from './view_derivation_middleware';
import { widgetSyncDataMiddleware } from './widget_sync_data_middleware';

declare const window: any;
const composeEnhancers = composeWithDevTools({ trace: true });

export const createStore = () => {
  return _createStore<IReduxState, any, unknown, unknown>(
    enableBatching(Reducers.rootReducers),
    // https://github.com/zalmoxisus/redux-devtools-extension#14-using-in-production
    composeEnhancers(applyMiddleware(thunkMiddleware, viewDerivationMiddleware, widgetSyncDataMiddleware)),
  );
};

export const store = createStore();

export type AppDispatch = typeof store.dispatch;

(() => {
  if (!process.env.SSR) {
    window.VkStore = store;
  }
})();
