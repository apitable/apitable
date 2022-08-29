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
 * 
 * @description 初始化一个小程序所需所有依赖和数据，创建可以独立运行的环境
 * 1. 让小程序开发者可以不启动维格表开发环境，直接开发小程序。
 * 2. 让小程序可以脱离数表独立的进行展示（独立页面）。
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
