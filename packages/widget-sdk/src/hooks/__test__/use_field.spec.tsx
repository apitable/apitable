import { renderHook } from '@testing-library/react-hooks';
import { useField } from 'hooks/use_field';
import { ConfigConstant, FieldType, TextField, getFieldTypeString } from 'core';
import { Field } from 'model';
import { createSimpleWrapper } from './simple_context_wrapper';

const field = TextField.createDefault({});
const fieldId = field.id;
jest.mock('../../store/selector', () => {
  const originalModule = jest.requireActual('../../store/selector');
  return {
    __esModule: true, // this property makes it work
    ...originalModule,
    getFieldMap: jest.fn(() => ({
      [fieldId]: field,
    })),
    getFieldPermissionMap: jest.fn(() => ({
      [fieldId]: {
        role: ConfigConstant.Role.Manager,
        setting: { formSheetAccessible: true },
        permission: {
          editable: true,
          readable: true,
        },
        manageable: true,
      }
    })),
    getWidgetDatasheet: jest.fn((state) => state.datasheetMap['dstMock'].datasheet)
  };
});
test('use field should return a field entity', () => {
  const wrapper = createSimpleWrapper();

  const { result } = renderHook(() => useField(fieldId), { wrapper });

  expect(result.current!).toBeInstanceOf(Field);
  expect(result.current!.type).toBe(getFieldTypeString(FieldType.Text));
  expect(result.current!.id).toBe(fieldId);
});
