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

import { FieldType, INumberField } from '@apitable/core';
import { NumberField } from 'fusion/field/number.field';

describe('BaseNumberField', () => {
  let fieldClass: NumberField;
  let field: INumberField;

  beforeAll(() => {
    fieldClass = new NumberField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Number',
      type: FieldType.Number,
      property: { precision: 0, defaultValue: undefined },
    };
  });

  describe('validate', () => {
    it('null--should return null', () => {
      expect(() => fieldClass.validate(null, field, { field: 'fldpRxaCC8Mhe' })).not.toThrow();
    });

    it('not number--should throw error', () => {
      expect(() => fieldClass.validate('null', field, { field: 'fldpRxaCC8Mhe' }))
        .toThrow(/^api_param_number_field_type_error$/);
    });
  });
});
