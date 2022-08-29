import { IWidget } from 'core';
import { UPDATE_WIDGET } from '../../constant';

export interface IRefreshWidgetAction {
  type: typeof UPDATE_WIDGET;
  payload: IWidget;
}

export const refreshWidgetAction = (payload: IWidget): IRefreshWidgetAction => ({ type: UPDATE_WIDGET, payload });
