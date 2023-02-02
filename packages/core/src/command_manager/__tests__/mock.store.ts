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

import { IBaseDatasheetPack, IReduxState, Reducers, StoreActions } from 'exports/store';
import { applyMiddleware, createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';

export function fulfillStore(datasheetPack: IBaseDatasheetPack, foreignDatasheetMap?: { [dstId: string]: IBaseDatasheetPack }): any {
  const store = createStore<IReduxState, any, unknown, unknown>(enableBatching(Reducers.rootReducers), applyMiddleware(thunkMiddleware));
  store.dispatch(
    StoreActions.setPageParams({
      datasheetId: datasheetPack.datasheet.id,
      spaceId: datasheetPack.datasheet.spaceId,
    }),
  );

  if (foreignDatasheetMap) {
    Object.keys(foreignDatasheetMap).forEach(dstId => {
      // Don't check linked datasheet, linked datasheet should be set to connected, or linked data can not be written
      store.dispatch(StoreActions.setDatasheetConnected(dstId));
      const dataPack = foreignDatasheetMap![dstId]!;
      store.dispatch(StoreActions.receiveDataPack(dataPack, { isPartOfData: true }));
      dataPack.fieldPermissionMap && store.dispatch(StoreActions.loadFieldPermissionMap(dataPack.fieldPermissionMap, dstId));
    });
  }

  store.dispatch(StoreActions.setDatasheetConnected(datasheetPack.datasheet.id));
  store.dispatch(StoreActions.receiveDataPack(datasheetPack));

  return store;
}
