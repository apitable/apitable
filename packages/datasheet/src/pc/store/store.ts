import { IReduxState, Reducers } from '@vikadata/core';
import { applyMiddleware, createStore as _createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunkMiddleware from 'redux-thunk';
import { rowsCacheAction } from './rows_cache_action';

declare const window: any;
const composeEnhancers = composeWithDevTools({ trace: true });

export const createStore = () => {
  return _createStore<IReduxState, any, unknown, unknown>(
    enableBatching(Reducers.rootReducers),
    // https://github.com/zalmoxisus/redux-devtools-extension#14-using-in-production
    composeEnhancers(applyMiddleware(thunkMiddleware, rowsCacheAction)),
  );
};

export const store = createStore();

(() => {
  if (!process.env.SSR) {
    window.VkStore = store;
  }
})();

