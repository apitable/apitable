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

import { ApiTipConstant, CellFormatEnum, FieldKeyEnum } from '@apitable/core';
import { HttpModule } from '@nestjs/axios';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { RecordQueryRo } from 'fusion/ros/record.query.ro';
import { ApiException } from 'shared/exception';
import { ValidationPipe } from 'fusion/middleware/pipe/validation.pipe';
import { OrderEnum } from 'shared/enums';

describe('ValidationPipe', () => {
  let app: NestFastifyApplication;
  let pipe: ValidationPipe;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    pipe = new ValidationPipe();
  });

  afterAll(async() => {
    await app.close();
  });

  describe('validateInvalidOrderParam', () => {
    it('sort "" not error', async() => {
      const data = await pipe.transform(
        { sort: '{}' },
        {
          type: 'query',
          metatype: RecordQueryRo,
        },
      );
      expect(data.sort).toEqual(null);
    });

    it('sort "null" not error', async() => {
      const data = await pipe.transform(
        { sort: 'null' },
        {
          type: 'query',
          metatype: RecordQueryRo,
        },
      );
      expect(data.sort).toEqual(null);
    });

    it('sort.order null error', async() => {
      expect.assertions(1);
      try {
        return await pipe.transform(
          { sort: '{"order":"null","field":"aa"}' },
          {
            type: 'query',
            metatype: RecordQueryRo,
          },
        );
      } catch (e) {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_params_invalid_order_sort));
      }
    });

    it('sort.order "" error', async() => {
      expect.assertions(1);
      try {
        return await pipe.transform(
          { sort: '{"order":"","field":"aa"}' },
          {
            type: 'query',
            metatype: RecordQueryRo,
          },
        );
      } catch (e) {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_params_invalid_order_sort));
      }
    });

    it('sort.order "aa" error', async() => {
      expect.assertions(1);
      try {
        return await pipe.transform(
          { sort: '{"order":"aa","field":"aa"}' },
          {
            type: 'query',
            metatype: RecordQueryRo,
          },
        );
      } catch (e) {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_params_invalid_order_sort));
      }
    });
  });

  describe('transform array param', () => {
    test('transform sort, comma separated', async() => {
      const data = await pipe.transform(
        { sort: '{"field":"key","order":"asc"},{"field":"key2","order":"desc"}' },
        {
          type: 'query',
          metatype: RecordQueryRo,
        },
      );
      expect(data).toEqual({
        cellFormat: CellFormatEnum.JSON,
        fieldKey: FieldKeyEnum.NAME,
        pageNum: 1,
        pageSize: 100,
        sort: [
          {
            field: 'key',
            order: OrderEnum.ASC,
          },
          {
            field: 'key2',
            order: OrderEnum.DESC,
          },
        ],
      });
    });

    test('transform sort[]', async() => {
      const data = await pipe.transform(
        { 'sort[]': ['{"field":"key","order":"asc"}', '{"field":"key2","order":"desc"}'] },
        {
          type: 'query',
          metatype: RecordQueryRo,
        },
      );
      expect(data).toEqual({
        cellFormat: CellFormatEnum.JSON,
        fieldKey: FieldKeyEnum.NAME,
        pageNum: 1,
        pageSize: 100,
        sort: [
          {
            field: 'key',
            order: OrderEnum.ASC,
          },
          {
            field: 'key2',
            order: OrderEnum.DESC,
          },
        ],
      });
    });

    test('transform recordIds[]', async() => {
      const data = await pipe.transform(
        { 'recordIds[]': ['rec1', 'rec2'] },
        {
          type: 'query',
          metatype: RecordQueryRo,
        },
      );
      expect(data).toEqual({
        cellFormat: CellFormatEnum.JSON,
        fieldKey: FieldKeyEnum.NAME,
        pageNum: 1,
        pageSize: 100,
        recordIds: ['rec1', 'rec2'],
      });
    });

    test('transform fields[]', async() => {
      const data = await pipe.transform(
        { 'fields[]': ['fld1', 'fld2'] },
        {
          type: 'query',
          metatype: RecordQueryRo,
        },
      );
      expect(data).toEqual({
        cellFormat: CellFormatEnum.JSON,
        fieldKey: FieldKeyEnum.NAME,
        pageNum: 1,
        pageSize: 100,
        fields: ['fld1', 'fld2'],
      });
    });
  });
});
