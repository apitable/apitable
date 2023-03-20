import { renderHook } from '@testing-library/react-hooks';
import { useRecordsAll } from '../use_records_all';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { IRecordMap } from '@apitable/core';

test('use records all should return a correct result', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
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
  const { result } = renderHook(() => useRecordsAll(), { wrapper });

  expect(result.current!).toBeInstanceOf(Array);
  expect(result.current!.length).toBe(2);
});
