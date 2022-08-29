import { IWidget, widget } from 'core';
import { IRefreshWidgetAction } from './action';
import { UPDATE_WIDGET } from '../../constant';

export function widgetReducer(
  state: IWidget | null = null,
  action: IRefreshWidgetAction): IWidget | null {
  switch (action.type) {
    case UPDATE_WIDGET: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state ? widget(state, action) : null;
    }
  }
}
