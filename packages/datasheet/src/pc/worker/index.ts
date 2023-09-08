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

import { Remote, wrap } from 'comlink';
import { Store } from 'redux';
import { DispatchToStore, IReduxState, Selectors, StoreActions } from '@apitable/core';
import { dispatch, remoteStoreWrap } from './store';

/**
 * comlinkStore is similar to a full-duplex socket service,
 * where the main thread can call the worker instance's methods imperatively via storeComlink.proxy.
 * At the same time the worker instance will also actively push some messages to update the redux of the main thread,
 * so as to update the UI, actively pushing the data data for a redux action
 */
export const comlinkStore: {
  worker: Worker | null;
  proxy: Remote<any> | null;
  store: (Store<IReduxState> & { removeCache: (params: any[]) => void }) | null;
} = { worker: null, proxy: null, store: null };

export async function initWorkerStore() {
  let worker: any, proxy: any;
  const useWorker = false;
  if (typeof Worker === 'function' && useWorker) {
    (window as any).useWorkerCompute = true;
    worker = new Worker('./store/store_worker', { type: 'module', name: 'store_worker' });
    proxy = await wrap<Store<any>>(worker);
    worker.addEventListener('message', (e: any) => {
      if (typeof e.data === 'string') {
        const data = JSON.parse(e.data);
        // Some action messages sent by the worker, such as pushing some calculated data to the main thread store
        // console.log('worker data post spend time: ', Date.now() - data.postTime);
        // console.log('dispatch action from worker', data.action);
        dispatch(data.action);
        return;
      } else if (e.data?.type === 'requestResource') {
        const datasheetId = e.data.datasheetId;
        if (datasheetId) {
          const state = comlinkStore.store!.getState();
          const datasheet = Selectors.getDatasheet(state, datasheetId);
          if (datasheet) {
            console.log("Replenish data from the main thread's store to the worker", datasheet);
            comlinkStore.store!.dispatch({
              ...StoreActions.receiveDataPack(
                { snapshot: datasheet.snapshot, datasheet },
                { isPartOfData: datasheet.isPartOfData, getState: () => state },
              ),
              dispatchToStore: DispatchToStore.Remote,
            });
          }
        }
      } else if (e.data?.type === 'error_trace') {
        Promise.reject({ type: 'worker_error', message: e.data.errInfo });
      }
    });
  }
  const wrappedStore = remoteStoreWrap(proxy) as any;
  comlinkStore.worker = worker;
  comlinkStore.proxy = proxy;
  comlinkStore.store = wrappedStore;
  if (useWorker) {
    console.log('worker initialization successful', comlinkStore);
  }
  return comlinkStore;
}
