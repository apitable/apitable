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
import { HttpModule } from '@nestjs/axios';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { RecordQueryRo } from 'fusion/ros/record.query.ro';
import { ApiException } from 'shared/exception';
import { ValidationPipe } from 'fusion/middleware/pipe/validation.pipe';
import supertest from 'supertest';

describe('ValidationPipe', () => {
  let app: NestFastifyApplication;
  let pipe: ValidationPipe;
  let request;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    request = supertest(app.getHttpServer());
    pipe = new ValidationPipe(request as any);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('validateInvalidOrderParam', () => {
    it('sort "" not error', () => {
      return pipe.transform({ sort: '{}' }, {
        type: 'query',
        metatype: RecordQueryRo,
      }).then(data => {
        return expect(data.sort).toEqual(null);
      });
    });

    it('sort "null" not error', () => {
      return pipe.transform({ sort: 'null' }, {
        type: 'query',
        metatype: RecordQueryRo,
      }).then(data => {
        return expect(data.sort).toEqual(null);
      });
    });
    it('sort.field "" error', () => {
      return pipe.transform({ sort: '{"order":"desc","field":""}' }, {
        type: 'query',
        metatype: RecordQueryRo,
      }).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_param_sort_field_not_exists));
      });
    });
    it('sort.field null error', () => {
      return pipe.transform({ sort: '{"order":"desc","field":"null"}' }, {
        type: 'query',
        metatype: RecordQueryRo,
      }).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_param_sort_field_not_exists));
      });
    });
    it('sort.order null error', () => {
      return pipe.transform({ sort: '{"order":"null","field":"aa"}' }, {
        type: 'query',
        metatype: RecordQueryRo,
      }).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_params_invalid_order_sort));
      });
    });
    it('sort.order "" error', () => {
      return pipe.transform({ sort: '{"order":"","field":"aa"}' }, {
        type: 'query',
        metatype: RecordQueryRo,
      }).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_params_invalid_order_sort));
      });
    });
    it('sort.order "aa" error', () => {
      return pipe.transform({ sort: '{"order":"aa","field":"aa"}' }, {
        type: 'query',
        metatype: RecordQueryRo,
      }).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_params_invalid_order_sort));
      });
    });
  });
});
