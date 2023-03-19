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

import { IStoreProvider } from '../providers';
import { Store, AnyAction, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import { IBaseDatasheetPack, IReduxState, Reducers, StoreActions } from 'exports/store';

export const fulfillStore = (datasheetPack: IBaseDatasheetPack) => {
  const store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
  store.dispatch(
    StoreActions.setPageParams({
      datasheetId: datasheetPack.datasheet.id,
      spaceId: datasheetPack.datasheet.spaceId,
    }),
  );

  if (datasheetPack.fieldPermissionMap) {
    store.dispatch(StoreActions.loadFieldPermissionMap(datasheetPack.fieldPermissionMap, datasheetPack.datasheet.id));
  }
  store.dispatch(StoreActions.setDatasheetConnected(datasheetPack.datasheet.id));
  store.dispatch(StoreActions.receiveDataPack(datasheetPack));
  return store;
};

export class MockStoreProvider implements IStoreProvider {
  createStore(datasheetPack: IBaseDatasheetPack): Promise<Store<IReduxState, AnyAction>> {
    return Promise.resolve(fulfillStore(datasheetPack));
  }
}
