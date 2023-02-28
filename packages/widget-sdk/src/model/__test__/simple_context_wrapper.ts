import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { IWidgetContext } from 'interface';
import { ThemeName } from '@apitable/core';

export const createSimpleContextWrapper = (
  context?: Partial<IWidgetContext> & { mockWidgetSdkData?: MockWidgetSdkData }
): IWidgetContext => {
  const mockWidgetSdkData = context?.mockWidgetSdkData ?? MockWidgetSdkData.simpleDatasheetExample();
  const _widgetStore = mockWidgetSdkData.widgetStore;
  const widgetState = mockWidgetSdkData.widgetSdkData;
  const widgetId = widgetState.widget?.id;
  const {
    id = widgetId!,
    locale = 'zh-CN',
    theme = ThemeName.Light,
    widgetStore = _widgetStore
  } = context || {};
  return { id, locale, theme, widgetStore };
};
