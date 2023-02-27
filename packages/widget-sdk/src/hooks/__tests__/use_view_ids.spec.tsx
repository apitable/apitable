import { renderHook } from '@testing-library/react-hooks';
import { useViewIds } from '../use_view_ids';
import { getViews } from 'store';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { createSimpleWrapper } from './simple_context_wrapper';

test('use view ids should return the correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const views = getViews(mockWidgetSdkData.widgetSdkData as any)!;

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useViewIds(), { wrapper });
  expect(result.current!).toBeInstanceOf(Array);
  expect(result.current!.length).toBe(views.length);
});
