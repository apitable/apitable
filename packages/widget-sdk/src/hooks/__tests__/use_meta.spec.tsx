import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { useMeta } from '../use_meta';
import { ThemeName } from '@apitable/components';
import { StoreActions } from '@apitable/core';
import { getViews } from 'store/selector';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { InstallPosition } from 'interface/modal';
import { defaultWidget } from '__tests__/mocks/mock_store';

test('use meta should return a correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const views = getViews(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID);
  const viewId = views?.[0]?.id;

  mockWidgetSdkData.dispatch(StoreActions.setPageParams({
    viewId,
    datasheetId: DEFAULT_DATASHEET_ID
  }));

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useMeta(), { wrapper });

  expect(result.current.theme).toBe(ThemeName.Light);
  expect(result.current.installPosition).toBe(InstallPosition.WidgetPanel);
  expect(result.current.id).toBe(defaultWidget.id);
});
