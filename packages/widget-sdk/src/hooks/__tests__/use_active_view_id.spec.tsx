import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { StoreActions } from '@apitable/core';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { useActiveViewId } from '../use_active_view_id';
import { getViews } from 'store';

test('use active view id should return a viewId', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const views = getViews(mockWidgetSdkData.widgetSdkData, DEFAULT_DATASHEET_ID);
  const viewId = views?.[0]?.id;
  mockWidgetSdkData.dispatch(StoreActions.setPageParams({
    viewId
  }));

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useActiveViewId(), { wrapper });

  expect(result.current).toBe(viewId);
});
