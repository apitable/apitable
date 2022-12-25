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

import { IReduxState, Reducers } from 'core';
import { AnyAction, applyMiddleware, CombinedState, compose, createStore, Store } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { IGlobalContext, IWidgetState } from 'interface';
import { ResourceService } from '../resource/service';
import { subscribeDatasheetMap, subscribeWidgetMap } from '../subscribe';

export * from './selector';
export * from './actions';
export * from './connector';
export * from './constant';
export * from './slice/root';

export type IWidgetStore = Store<CombinedState<IWidgetState>, AnyAction>;

export const createGlobalStore = () => createStore<IReduxState, any, unknown, unknown>(
  enableBatching(Reducers.rootReducers),
  compose(applyMiddleware(thunkMiddleware)),
);
/**
 * @description Initialize all the dependencies and data needed for the widget and create an environment that can run independently.
 * 1. Enables widget developers to develop widget directly without launching the main development environment.
 * 2. Allow the widget to be displayed independently from the datasheet (standalone page).
 */
export const initGlobalContext = (): IGlobalContext => {
  const store = createGlobalStore();
  const datasheetService = new ResourceService(store, e => alert(e.message));
  const unSubscribeDatasheetMap = subscribeDatasheetMap(store, { instance: datasheetService });
  const unSubscribeWidgetMap = subscribeWidgetMap(store, { instance: datasheetService });
  return {
    resourceService: datasheetService,
    globalStore: store,
    unSubscribe: () => {
      unSubscribeDatasheetMap();
      unSubscribeWidgetMap();
    },
  };
};
