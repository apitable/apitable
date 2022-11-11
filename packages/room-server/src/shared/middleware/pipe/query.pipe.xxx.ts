// import '@vikadata/i18n-lang';
import { REQUEST } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiTipConstant, FieldType, IMeta, ViewType } from '@apitable/core';
import { AppModule } from 'app.module';
import { OrderEnum } from '../../enums';
import { ApiException } from '../../exception/api.exception';
import { QueryPipe } from 'shared/middleware/pipe/query.pipe';

describe('QueryPipe', () => {
  let app;
  let pipe: QueryPipe;
  let request;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    request = app.resolve(REQUEST);
    pipe = new QueryPipe(request);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('validateExpression', () => {
    it('should true', function() {
      expect(true);
    });
    it('sort.field error--zh-CN', () => {
      const error = ApiException.tipError(ApiTipConstant.api_param_sort_field_not_exists);
      expect(() => {
        pipe.validateSort([{ order: OrderEnum.DESC, field: 'aa' }], {
          Number: { id: 'aa', name: 'number', type: FieldType.Number, property: { precision: 0, defaultValue: null }
          },
        });
      }).toThrow(error);
    });
    it('viewId not exists error--zh-CN', () => {
      const error = ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists);
      const meta: IMeta = {
        fieldMap: {
          fldg3EBXhzE8K: {
            id: 'fldg3EBXhzE8K',
            name: 'Status',
            type: 3,
            property: {
              options: [
                {
                  id: 'optOR6LHdzUBK',
                  name: 'Recorded',
                  color: 37,
                },
                {
                  id: 'optSgtz1OJbZt',
                  name: '[Ding]Noticed the developer to fix it',
                  color: 37,
                },
                {
                  id: 'optu8X6R40HSx',
                  name: 'fixing',
                  color: 25,
                },
                {
                  id: 'opt6BeeiJSwtz',
                  name: 'fixed',
                  color: 3,
                },
                {
                  id: 'optvyQBhNkSnG',
                  name: '[Ding]Noticed the pm for acceptance',
                  color: 4,
                },
                {
                  id: 'opt1vtk8Fj7Uv',
                  name: 'acceptance success',
                  color: 44,
                },
                {
                  id: 'optCGYmfqVJAl',
                  name: 'acceptance failed',
                  color: 27,
                },
                {
                  id: 'optKP3PtCM0Er',
                  name: 'no need to repair',
                  color: 5,
                },
                {
                  id: 'optM5X0bE5g1R',
                  name: 'can not recurrent it',
                  color: 6,
                },
                {
                  id: 'optu8lGuBMgrq',
                  name: 'closed',
                  color: 7,
                },
                {
                  id: 'opt4COW4DaMYg',
                  name: 'confirmed',
                  color: 8,
                },
                {
                  id: 'optayaCVVRPpa',
                  name: 'stopped',
                  color: 2,
                },
              ],
            },
          },
        },
        views: [{ id: 'bbbb', type: ViewType.Grid, columns: [], name: 'aaa', frozenColumnCount: 0, rows: [] }],
        widgetPanels: [{ id: 'wplAcHJtZO9f8', name: 'widget pannel', widgets: [{ id: 'wdtiJjVmNFcFmNtQFA', height: 224, y: 0 }] }],
      };
      expect(() => {
        pipe.validateViewId('aa', meta);
      }).toThrow(error);
    });
  });
});
