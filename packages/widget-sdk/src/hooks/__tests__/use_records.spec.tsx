import { renderHook } from '@testing-library/react-hooks';
import { useRecords } from 'hooks/use_records';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { getViews } from 'store';
import { IRecordMap } from '@apitable/core';

jest.mock('../../view_computed', () => {
  const originalModule = jest.requireActual('../../view_computed');
  return {
    __esModule: true, // this property makes it work
    ...originalModule,
    useReferenceCount: () => {}
  };
});

test('use records should return the correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const views = getViews(mockWidgetSdkData.widgetSdkData as any)!;
  const viewId = views[0]!.id;
  const recordMap: IRecordMap = {
    rec1111: {
      id: 'rec1111',
      data: {},
      commentCount: 0
    },
    rec2222: {
      id: 'rec2222',
      data: {},
      commentCount: 0
    }
  };
  mockWidgetSdkData.addRecords(recordMap);

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useRecords(viewId), { wrapper });

  expect(result.current!).toBeInstanceOf(Array);
  expect(result.current!.length).toBe(2);
});
