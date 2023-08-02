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
import { DatasheetCreateRo } from 'fusion/ros/datasheet.create.ro';
import { DatasheetFieldCreateRo } from 'fusion/ros/datasheet.field.create.ro';
import { ApiException } from 'shared/exception';
import { CreateDatasheetPipe } from './create.datasheet.pipe';

describe('CreateDatasheetPipe', () => {
  let pipe: CreateDatasheetPipe;

  beforeAll(() => {
    pipe = new CreateDatasheetPipe({} as any);
  });

  describe('transform', () => {
    it('name is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'name', value: 100 });
      expect(() => {
        const name = 'fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        const ro: DatasheetCreateRo = new DatasheetCreateRo(name, '');
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('description is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'description', value: 500 });
      expect(() => {
        const content = 'fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        let desc = content;
        for (let i = 1; i < 5; i++) {
          desc = `${content}${desc}`;
        }
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', desc);
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('missing field name, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'field.name' });
      const field: DatasheetFieldCreateRo = {
        name: '',
        type: 'Text'
      };
      const fields: DatasheetFieldCreateRo[] = [field];
      expect(() => {
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', '');
        ro.fields = fields;
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('field name is not unique, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_must_unique, { property: 'field.name' });
      const field: DatasheetFieldCreateRo = {
        name: 'abc',
        type: 'Text'
      };
      const fields: DatasheetFieldCreateRo[] = [field, field];
      expect(() => {
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', '');
        ro.fields = fields;
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('fields is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_max_count_error, { property: 'fields', value: 200 });
      const field: DatasheetFieldCreateRo = {
        name: 'abc',
        type: 'Text'
      };
      const fields: DatasheetFieldCreateRo[] = [];
      for (let i = 1; i < 202; i++) {
        const name = `abc${i}`;
        fields.push({ name, type: field.type });
      }
      expect(() => {
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', '');
        ro.fields = fields;
        pipe.transform(ro);
      }).toThrow(error);
    });

  });

  describe('transformProperty', () => {

    it('transform number property, should change precision from string to number', () => {
      let fields: any[] = [{
        name: 'abc',
        type: 'Number',
        property: {
          defaultValue: '1.0',
          precision: '2.0',
        }
      }];
      fields = pipe.transformProperty(fields);
      const field: any = fields[0];
      expect(field).toHaveProperty(['property', 'precision'], 2.0);
      expect(field).not.toHaveProperty(['property', 'precision'], '2.0');
    });
  });

  describe('validate primary field type', () => {
    it('the primary field.type is invalid, should return 400 code', () => {
      const type = 'SingleSelect';
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_primary_field_type_error, { value: type });
      expect(() => {
        pipe.validatePrimaryFieldType(type);
      }).toThrow(error);
    });

  });

  describe('validate fields', () => {

    it('field.name is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'field.name', value: 100 });
      expect(() => {
        const fieldName = 'fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        const fields: DatasheetFieldCreateRo[] = [{
          name: fieldName,
          type: 'Text'
        }];
        const ro: DatasheetCreateRo = new DatasheetCreateRo('abc', '');
        ro.fields = fields;
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('invalid field type, should return 400 code', () => {
      const fields: DatasheetFieldCreateRo[] = [{
        name: 'abc',
        type: 'Textt'
      }];
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value
        , { property: `fields[${fields[0]!.name}].type`, value: fields[0]!.type });
      expect(() => {
        pipe.validateFields(fields);
      }).toThrow(error);
    });

    it('invalid field property, should return 400 code', () => {
      const fields: DatasheetFieldCreateRo[] = [{
        name: 'abc',
        type: 'number',
        property: {}
      }];
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value
        , { property: `fields[${fields[0]!.name}].property`, value: fields[0]!.property });
      expect(() => {
        pipe.validateFields(fields);
      }).toThrow(error);
    });

  });

});
