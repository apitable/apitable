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

import { Remote } from 'comlink';
import { Store, AnyAction, Dispatch } from 'redux';
import { DispatchToStore, IReduxState } from '@apitable/core';
import { store as localStore } from '../../store';

export * from './store_worker';

let _dispatch: Dispatch;

// Used to synchronize an action to the main thread's store and worker store,
// some data needs to be synchronized between the two stores, such as pageParams
export const dispatch = (action: any): any => {
  if (!_dispatch) return false;
  _dispatch(action);
  return true;
};

// The wrapping of the store within the worker, a bit of a proxy, this part of the code is running in the main thread
// You can do some sorting of the action in the following dispatch,
// and the action that will not cause recalculation can be dispatched directly to the store of the main thread
export function remoteStoreWrap(remoteStore: Remote<Store<IReduxState>> | null) {
  // When the browser does not support worker, there is no remoteStore
  if (!remoteStore) {
    _dispatch = (action: any) => {
      if (action.dispatchToStore !== DispatchToStore.Remote) {
        return localStore.dispatch(action);
      }
      return action;
    };
    return {
      ...localStore,
      dispatch: _dispatch,
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
    dispatch,
  };
}
