import { IWidgetConfigIframe } from 'interface';
import { UPDATE_WIDGET_CONFIG } from '../../constant';

export interface IUpdateWidgetConfigAction {
  type: typeof UPDATE_WIDGET_CONFIG;
  payload: IWidgetConfigIframe;
}

export const updateWidgetConfigAction = (payload: IWidgetConfigIframe): IUpdateWidgetConfigAction => ({ type: UPDATE_WIDGET_CONFIG, payload });
