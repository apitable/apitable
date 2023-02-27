import { renderHook } from '@testing-library/react-hooks';
import { useRecord } from 'hooks/use_record';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { IRecordMap } from '@apitable/core';
import { Record } from 'model';

describe('use record should return a correct result', () => {
  test('return a record entity', () => {
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
    const { result } = renderHook(() => useRecord('rec1111'), { wrapper });
  
    expect(result.current).toBeInstanceOf(Record);
    expect(result.current.id).toBe('rec1111');
  });

  test('return a undefined', () => {
    const wrapper = createSimpleWrapper();
    const { result } = renderHook(() => useRecord('rec1111'), { wrapper });
    expect(result.current).toBe(undefined);
  });
});
