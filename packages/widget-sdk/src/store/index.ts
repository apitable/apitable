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
