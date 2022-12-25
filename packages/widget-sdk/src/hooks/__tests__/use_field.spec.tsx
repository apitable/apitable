/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
