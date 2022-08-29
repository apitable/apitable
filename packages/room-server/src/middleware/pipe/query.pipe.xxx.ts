// import '@vikadata/i18n-lang';
import { REQUEST } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { FieldType, IMeta, ViewType } from '@vikadata/core';
import { AppModule } from 'app.module';
import { OrderEnum } from 'enums';
import { ApiException } from 'exception/api.exception';
import { QueryPipe } from 'middleware/pipe/query.pipe';

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
      const error = ApiException.tipError('api_param_sort_field_not_exists');
      expect(() => {
        pipe.validateSort([{ order: OrderEnum.DESC, field: 'aa' }], {
          自增数字: { id: 'aa', name: '自增数字', type: FieldType.Number, property: { precision: 0, defaultValue: null }
          },
        });
      }).toThrow(error);
    });
    it('viewId不存在 error--zh-CN', () => {
      const error = ApiException.tipError('api_query_params_view_id_not_exists');
      const meta: IMeta = {
        fieldMap: {
          fldg3EBXhzE8K: {
            id: 'fldg3EBXhzE8K',
            name: '状态',
            type: 3,
            property: {
              options: [
                {
                  id: 'optOR6LHdzUBK',
                  name: '已记录',
                  color: 37,
                },
                {
                  id: 'optSgtz1OJbZt',
                  name: '[钉]已通知研发修复',
                  color: 37,
                },
                {
                  id: 'optu8X6R40HSx',
                  name: '修复中',
                  color: 25,
                },
                {
                  id: 'opt6BeeiJSwtz',
                  name: '已修复,待验收',
                  color: 3,
                },
                {
                  id: 'optvyQBhNkSnG',
                  name: '[钉]已通知产品验收',
                  color: 4,
                },
                {
                  id: 'opt1vtk8Fj7Uv',
                  name: '验收通过',
                  color: 44,
                },
                {
                  id: 'optCGYmfqVJAl',
                  name: '验收不通过',
                  color: 27,
                },
                {
                  id: 'optKP3PtCM0Er',
                  name: '无需修复',
                  color: 5,
                },
                {
                  id: 'optM5X0bE5g1R',
                  name: '无法复现',
                  color: 6,
                },
                {
                  id: 'optu8lGuBMgrq',
                  name: '关闭',
                  color: 7,
                },
                {
                  id: 'opt4COW4DaMYg',
                  name: '已确认',
                  color: 8,
                },
                {
                  id: 'optayaCVVRPpa',
                  name: '暂不修复',
                  color: 2,
                },
              ],
            },
          },
        },
        views: [{ id: 'bbbb', type: ViewType.Grid, columns: [], name: 'aaa', frozenColumnCount: 0, rows: [] }],
        widgetPanels: [{ id: 'wplAcHJtZO9f8', name: '组件面板', widgets: [{ id: 'wdtiJjVmNFcFmNtQFA', height: 224, y: 0 }] }],
      };
      expect(() => {
        pipe.validateViewId('aa', meta);
      }).toThrow(error);
    });
  });
});
