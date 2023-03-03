import { renderHook } from '@testing-library/react-hooks';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { ActionConstants, IRecordMap, StoreActions } from '@apitable/core';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { useSelection } from '../use_selection';
import { getPrimaryFieldId } from 'store';

test('use selection should return a range', () => {
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID)!;
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
  mockWidgetSdkData.dispatch({
    type: ActionConstants.SET_SELECTION,
    datasheetId: DEFAULT_DATASHEET_ID,
    payload: {
      activeCell: {
        fieldId: primaryFieldId,
        recordId: 'rec1111'
      },
      ranges: [{ start: {
        fieldId: primaryFieldId,
        recordId: 'rec1111'
      }, end: {
        fieldId: primaryFieldId,
        recordId: 'rec2222'
      }}],
    },
  });
  mockWidgetSdkData.dispatch(StoreActions.setPageParams({
    datasheetId: DEFAULT_DATASHEET_ID
  }));

  const wrapper = createSimpleWrapper({ widgetState: mockWidgetSdkData.widgetSdkData });
  const { result } = renderHook(() => useSelection(), { wrapper });

  expect(result.current!.fieldIds[0]).toBe(primaryFieldId);
  expect(result.current!.recordIds[0]).toBe('rec1111');
  expect(result.current!.recordIds[1]).toBe('rec2222');
});
