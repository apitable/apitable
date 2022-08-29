import { IReduxState } from 'store/interface';

export const getWidget = (state: IReduxState, id: string) => {
  if (!state.widgetMap) return;
  return state.widgetMap[id]?.widget;
};

export const getWidgetStorageById = (state: IReduxState, id: string): undefined | { [key: string]: any } => {
  const widget = getWidget(state, id);
  if (!widget) { return; }
  return widget.snapshot.storage;
};

export const getWidgetSnapshot = (state: IReduxState, id: string) => { 
  const widget = getWidget(state, id);
  if(!widget) return; 
  return widget.snapshot;
};
