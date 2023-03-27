import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { IRecordMap, StoreActions } from '@apitable/core';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { useActiveCell } from '../use_active_cell';
import { getPrimaryFieldId } from 'store';

test('use active cell should return a ICell', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID)!;
  const recordMap: IRecordMap = {
    rec1111: {
      id: 'rec1111',
      data: {},
      commentCount: 0
    }
  };
  mockWidgetSdkData.addRecords(recordMap);
  mockWidgetSdkData.dispatch(StoreActions.setActiveCell(DEFAULT_DATASHEET_ID, {
    recordId: 'rec1111',
    fieldId: primaryFieldId
  }));
  mockWidgetSdkData.dispatch(StoreActions.setPageParams({
    datasheetId: DEFAULT_DATASHEET_ID
  }));

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useActiveCell(), { wrapper });

  expect(result.current!.fieldId).toBe(primaryFieldId);
  expect(result.current!.recordId).toBe('rec1111');
});
