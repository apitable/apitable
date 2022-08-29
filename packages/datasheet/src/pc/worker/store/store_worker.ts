import { IReduxState, Reducers } from '@vikadata/core';
import { expose } from 'comlink';
import dayjs from 'dayjs';
import { applyMiddleware, createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { withCompute } from './with_compute';

(() => {
  if (!process.env.SSR) {
    const store = withCompute(createStore<IReduxState, any, unknown, unknown>(
      enableBatching(Reducers.rootReducers),
      applyMiddleware(thunkMiddleware)
    ));

    (self as any)._store_ = store;

    const initHook = (lang: string) => {
      dayjs.locale(lang);
    };

    expose({
      ...store,
      initHook
    });
  }
})();

