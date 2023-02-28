import { createWidgetContextWrapper } from 'context/__tests__/create_widget_context';
import { noop } from 'lodash';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';

export const createSimpleWrapper = (props?: {
  config?: any,
  widgetState?: any
}) => {
  const {
    config = {
      isFullscreen: false,
      isShowingSettings: false,
      toggleFullscreen: noop,
      toggleSettings: noop,
      expandRecord: noop,
    },
    widgetState = MockWidgetSdkData.simpleDatasheetExample().widgetSdkData
  } = props || {};
  return createWidgetContextWrapper(config, widgetState);
};
