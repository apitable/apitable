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

import { FieldType, ITextField } from '@apitable/core';
import { TextField } from 'fusion/field/text.field';

describe('BaseTextField', () => {
  let fieldClass: TextField;
  let field: ITextField;
  beforeAll(() => {
    fieldClass = new TextField();
    field = {
      id: 'fldpRxaCC8Mhe',
      name: 'Text',
      type: FieldType.Text,
      property: null,
    };
  });

  describe('validate', () => {
    it('null--should return null', () => {
      expect(() => fieldClass.validate(null, field)).not.toThrow();
    });
    it('not text--should throw an error', () => {
      expect(() => fieldClass.validate(1, field)).toThrow(/^api_param_text_field_type_error$/);
    });
  });
});
