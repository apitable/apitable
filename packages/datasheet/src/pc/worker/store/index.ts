import { Remote } from 'comlink';
import { Store, AnyAction, Dispatch } from 'redux';
import { store as localStore } from '../../store';
import { DispatchToStore } from '@apitable/core';

export * from './store_worker';

let _dispatch: Dispatch;

// 用于将一个action同步发送给主线程的store和worker store, 有些数据需要两边store同步，比如pageParams
export const dispatch = (action: any): any => {
  if (!_dispatch) return false;
  _dispatch(action);
  return true;
};

// worker内store的包装，有点代理的意思，这部分代码是运行在主线程的
// 可以在下面的dispatch对action做一下分拣，不会引起重新计算的action，可以直接派发到主线程的store
export function remoteStoreWrap(remoteStore: Remote<Store<any>> | null) {
  // 浏览器不支持worker的时候没有remoteStore
  if (!remoteStore) {
    _dispatch = (action: any) => {
      if (action.dispatchToStore !== DispatchToStore.Remote) {
        return localStore.dispatch(action);
      }
      return action;
    };
    return {
      ...localStore,
      dispatch: _dispatch
    };
  }

  const dispatch: Dispatch = (action: AnyAction) => {
    if (typeof action === 'function') {
      (action as any)(dispatch, () => localStore.getState());
      return;
    }
    if (!action.dispatchToStore || action.dispatchToStore === DispatchToStore.All) {
      remoteStore.dispatch(action);
      localStore.dispatch(action);
    } else if (action.dispatchToStore === DispatchToStore.Local) {
      localStore.dispatch(action);
    } else if (action.dispatchToStore === DispatchToStore.Remote) {
      remoteStore.dispatch(action);
    }
    return action as any;
  };

  _dispatch = dispatch;

  return {
    ...localStore,
    dispatch
  };

  // return {
  //   getState: () => latestState,
  //   subscribe: (listener: Function) => {
  //     subscribers.add(listener);
  //     return () => subscribers.delete(listener);
  //   },
  //   replaceReducer: () => {
  //     throw new Error('Can’t transfer a function');
  //   },
  //   dispatch,
  // };
}
