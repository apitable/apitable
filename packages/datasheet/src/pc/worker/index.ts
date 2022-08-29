import { DispatchToStore, IReduxState, Selectors, StoreActions, SystemConfig } from '@vikadata/core';
import { Remote, wrap } from 'comlink';
import { Store } from 'redux';
import { getTestFunctionAvailable } from '../utils/storage';
import { dispatch, remoteStoreWrap } from './store';

/**
 * comlinkStore 类似于一个全双工的socket服务，主线程可以通过storeComlink.proxy命令式的调用worker实例的方法
 * 同时worker实例也会主动推送一些消息来更新主线程的redux，以此来更新UI，主动推送的data数据为一个redux的action
*/
export const comlinkStore:
{ worker: Worker | null, proxy: Remote<any> | null, store: Store<IReduxState> & { removeCache: (params: any[]) => void } | null }
= { worker: null, proxy: null, store: null };

export async function initWorkerStore() {
  let worker: any, proxy: any;
  const useWorker = getTestFunctionAvailable(SystemConfig.test_function.async_compute.feature_key);
  if (typeof Worker === 'function' && useWorker) {
    (window as any).useWorkerCompute = true;
    worker = new Worker('./store/store_worker', { type: 'module', name: 'store_worker' });
    proxy = await wrap<Store<any>>(worker);
    worker.addEventListener('message', (e: any) => {
      if (typeof e.data === 'string') {
        const data = JSON.parse(e.data);
        // worker主动发送的一些action消息，如将一些计算好的数据主动推送到主线程store
        // console.log('worker data post spend time: ', Date.now() - data.postTime);
        // console.log('dispatch action from worker', data.action);
        dispatch(data.action);
        return ;
      } else if (e.data?.type === 'requestResource') {
        const datasheetId = e.data.datasheetId;
        if (datasheetId) {
          const state = comlinkStore.store!.getState();
          const datasheet = Selectors.getDatasheet(state, datasheetId);
          if (datasheet) {
            console.log('从主线程的store补发数据到worker', datasheet);
            comlinkStore.store!.dispatch({
              ...StoreActions.receiveDataPack({ snapshot: datasheet.snapshot, datasheet }, datasheet.isPartOfData, () => state),
              dispatchToStore: DispatchToStore.Remote
            });
          }
        }
      } else if (e.data?.type === 'error_trace') {
        Promise.reject({ type: 'worker_error', message: e.data.errInfo });
      }
    });
  }
  const wrappedStore = await remoteStoreWrap(proxy) as any;
  comlinkStore.worker = worker;
  comlinkStore.proxy = proxy;
  comlinkStore.store = wrappedStore;
  if (useWorker) {
    console.log('worker 初始化成功', comlinkStore);
  }
  return comlinkStore;
}
