import { renderHook } from '@testing-library/react-hooks';
import { useField } from 'hooks/use_field';
import { FieldType, getFieldTypeString } from 'core';
import { Field } from 'model';
import { createSimpleWrapper } from './simple_context_wrapper';
import { MockWidgetSdkData } from '__tests__/mocks/mock_data';
import { DEFAULT_DATASHEET_ID } from '__tests__/mocks/mock_datasheet';
import { getPrimaryFieldId } from 'store';

test('use field should return a field entity', () => {
  const wrapper = createSimpleWrapper();
  const mockWidgetSdkData = MockWidgetSdkData.simpleDatasheetExample();
  const primaryFieldId = getPrimaryFieldId(mockWidgetSdkData.widgetSdkData as any, DEFAULT_DATASHEET_ID);

  const { result } = renderHook(() => useField(primaryFieldId), { wrapper });

  expect(result.current!).toBeInstanceOf(Field);
  expect(result.current!.type).toBe(getFieldTypeString(FieldType.SingleText));
  expect(result.current!.id).toBe(primaryFieldId);
});
