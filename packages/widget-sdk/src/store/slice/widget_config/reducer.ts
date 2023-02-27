import { IUpdateWidgetConfigAction } from './action';
import { UPDATE_WIDGET_CONFIG } from '../../constant';
import { IWidgetConfigIframe } from 'interface';

export function widgetConfigReducer(
  state: IWidgetConfigIframe = { isShowingSettings: false, isFullscreen: false },
  action: IUpdateWidgetConfigAction): IWidgetConfigIframe {
  switch (action.type) {
    case UPDATE_WIDGET_CONFIG: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: return state;
  }
}
