import { renderHook } from '@testing-library/react-hooks';
import { useViewsMeta } from 'hooks/use_views_meta';
import { getViews } from 'store';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { createSimpleWrapper } from './simple_context_wrapper';

test('use views meta should return the correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const views = getViews(mockWidgetSdkData.widgetSdkData as any)!;

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useViewsMeta(), { wrapper });
  expect(result.current!).toBeInstanceOf(Array);
  expect(result.current!.length).toBe(views.length);
});
