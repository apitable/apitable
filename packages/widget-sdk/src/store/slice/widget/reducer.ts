import { IWidget, widget } from 'core';
import { AnyAction } from 'redux';

export function widgetReducer(
  state: IWidget | null = null,
  action: AnyAction): IWidget | null {
  if(!state) {
    return null;
  }
  return widget(state, action);
}
