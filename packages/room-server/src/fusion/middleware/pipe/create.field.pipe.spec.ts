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

import { ApiTipConstant, FieldType, FilterConjunction, FOperator, IMeta } from '@apitable/core';
import '@apitable/i18n-lang';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { FieldCreateRo } from 'fusion/ros/field.create.ro';
import { DATASHEET_META_HTTP_DECORATE } from 'shared/common';
import { ApiException } from 'shared/exception';
import { CreateFieldPipe } from './create.field.pipe';

const mockMeta: IMeta = {
  fieldMap: {
    fld7: {
      id: 'fld7',
      name: 'Field 7',
      type: FieldType.Checkbox,
      property: {
        icon: 'smile',
      },
    },
  },
  views: [],
};

describe('CreateFieldPipe', () => {
  let app: NestFastifyApplication;
  let pipe: CreateFieldPipe;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    pipe = new CreateFieldPipe({
      [DATASHEET_META_HTTP_DECORATE]: mockMeta,
    } as any);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('validate field', () => {
    it('missing field name, should return 400 code', () => {
      const ro: FieldCreateRo = new FieldCreateRo('', 'Text');
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'name' });
      expect(() => {
        pipe.validate(ro);
      }).toThrow(error);
    });

    it('name is oversize, should return 400 code', () => {
      const error = ApiException.tipError(ApiTipConstant.api_params_max_length_error, { property: 'name', value: 100 });
      expect(() => {
        const name = 'fasdfdsfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffabc';
        const ro: FieldCreateRo = new FieldCreateRo(name, '');
        pipe.transform(ro);
      }).toThrow(error);
    });

    it('invalid field type, should return 400 code', () => {
      const ro: FieldCreateRo = new FieldCreateRo('abc', 'Textt');
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'type', value: ro.type });
      expect(() => {
        pipe.validate(ro);
      }).toThrow(error);
    });

    it('invalid field property, should return 400 code', () => {
      const field: FieldCreateRo = new FieldCreateRo('abc', 'number');
      field.property = {};
      const error = ApiException.tipError(ApiTipConstant.api_params_invalid_value, { property: 'property', value: field.property });
      expect(() => {
        pipe.validate(field);
      }).toThrow(error);
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

    test('transform lookup property with filter info', () => {
      const field: FieldCreateRo = new FieldCreateRo('lookup', 'MagicLookUp');
      field.property = {
        relatedLinkFieldId: 'fld1',
        targetFieldId: 'fld2',
        filterInfo: {
          conjunction: FilterConjunction.And,
          conditions: [
            {
              fieldId: 'fld7',
              operator: FOperator.Is,
              value: ['abc'],
            },
          ] as any,
        },
      };
      pipe.transformProperty(field);
      expect(field).toHaveProperty(['property', 'filterInfo', 'conditions', 0, 'fieldType'], FieldType.Checkbox);
    });

    test('transform lookup property with filter info, field not exist', () => {
      const field: FieldCreateRo = new FieldCreateRo('lookup', 'MagicLookUp');
      field.property = {
        relatedLinkFieldId: 'fld1',
        targetFieldId: 'fld2',
        filterInfo: {
          conjunction: FilterConjunction.And,
          conditions: [
            {
              fieldId: 'fld87',
              operator: FOperator.Is,
              value: ['abc'],
            },
          ] as any,
        },
      };
      expect(() => {
        pipe.transformProperty(field);
      }).toThrow(ApiException.tipError(ApiTipConstant.api_param_filter_field_not_exists, { fieldId: 'fld87' }));
    });
  });
});
