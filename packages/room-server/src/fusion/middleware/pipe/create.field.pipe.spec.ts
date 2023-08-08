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

import { ApiTipConstant } from '@apitable/core';
import '@apitable/i18n-lang';
import { FieldCreateRo } from 'fusion/ros/field.create.ro';
import { ApiException } from 'shared/exception';
import { CreateFieldPipe } from './create.field.pipe';

describe('CreateFieldPipe', () => {
  let pipe: CreateFieldPipe;
  beforeAll(() => {
    pipe = new CreateFieldPipe({} as any, {} as any);
  });

  describe('validate field', () => {
    it('missing field name, should return 400 code', async() => {
      const ro: FieldCreateRo = new FieldCreateRo('', 'Text');
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'name' });
      await expect(async() => {
        await pipe.validate(ro);
      }).rejects.toThrow(error);
    });

    it('name is oversize, should return 400 code', async() => {
      const error = ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'name', value: 100 });
      await expect(async() => {
        const name = 'fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        const ro: FieldCreateRo = new FieldCreateRo(name, '');
        await pipe.transform(ro);
      }).rejects.toThrow(error);
    });

    it('invalid field type, should return 400 code', async() => {
      const ro: FieldCreateRo = new FieldCreateRo('abc', 'Textt');
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'type', value: ro.type });
      await expect(async() => {
        await pipe.validate(ro);
      }).rejects.toThrow(error);
    });

    it('invalid field property, should return 400 code', async() => {
      const field: FieldCreateRo = new FieldCreateRo('abc', 'number');
      field.property = {};
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'property', value: field.property });
      await expect(async() => {
        await pipe.validate(field);
      }).rejects.toThrow(error);
    });
  });

  describe('transformProperty', () => {
    it('transform number property, should change precision from string to number', () => {
      const field: FieldCreateRo = new FieldCreateRo('abc', 'Number');
      field.property = {
        defaultValue: '1.0',
        precision: 2,
      };
      pipe.transformProperty(field);
      expect(field).toHaveProperty(['property', 'precision'], 2.0);
      expect(field).not.toHaveProperty(['property', 'precision'], '2.0');
    });
  });
});
