import { renderHook } from '@testing-library/react-hooks';
import { APIMetaViewType } from '@apitable/core';
import { useViewMeta } from 'hooks/use_view_meta';
import { getViews } from 'store';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { createSimpleWrapper } from './simple_context_wrapper';

test('use view meta should return the correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const views = getViews(mockWidgetSdkData.widgetSdkData as any)!;

  const view = views[0]!;

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useViewMeta(view.id), { wrapper });
  expect(result.current.id).toBe(view.id);
  expect(result.current.type).toBe(APIMetaViewType.Grid);
});
