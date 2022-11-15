import { REQUEST } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
// import '@apitable/i18n-lang';
import { AppModule } from 'app.module';
import { ApiException } from '../../exception/api.exception';
import { ValidationPipe } from 'shared/middleware/pipe/validation.pipe';
import { RecordQueryRo } from '../../../fusion/ros/record.query.ro';
import { ApiTipConstant } from '@apitable/core';

describe('ValidationPipe', () => {
  let app;
  let pipe: ValidationPipe;
  let request;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    request = app.resolve(REQUEST);
    pipe = new ValidationPipe(request);
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
