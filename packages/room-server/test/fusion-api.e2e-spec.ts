import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { expect } from 'chai';
import { AppModule } from 'app.module';
import { initHttpHook } from 'shared/adapters/adapters.init';
import { GlobalExceptionFilter } from '../src/shared/filters';
import { HttpResponseInterceptor } from '../src/shared/interceptor';
import { ValidationPipe } from 'shared/middleware/pipe/validation.pipe';
import { LoggerModule } from 'shared/logger/winston.module';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'shared/logger/winston.constants';
import fastifyMultipart from 'fastify-multipart';
import { EnvConfigKey } from '../src/shared/common';
import { IOssConfig } from '../src/shared/interfaces';
import { EnvConfigService } from 'shared/services/config/env.config.service';

export function successExpect(response: any, result: any) {
  expect(response.statusCode).to.be.eql(200);
  expect(result.code).to.be.eql(200);
  expect(result.message).to.be.eql('SUCCESS');
  expect(result.success).to.be.eql(true);
}

export function createSuccessExpect(response: any, result: any) {
  expect(response.statusCode).to.be.eql(201);
  expect(result.code).to.be.eql(200);
  expect(result.message).to.be.eql('SUCCESS');
  expect(result.success).to.be.eql(true);
}

export function getDefaultHeader(app) {
  return {
    Authorization: 'Bearer usk8qo1Dk9PbecBlaqFIvbb',
  };
}

export async function initNestTestApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule, LoggerModule],
  }).compile();
  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.register(fastifyMultipart);
  const app = module.createNestApplication<NestFastifyApplication>(fastifyAdapter);
  const logger = module.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  initHttpHook(app);
  // 全局异常处理
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  // 全局注册拦截器(成功返回格式)
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  // 全局验证器,自定义参数异常的返回
  app.useGlobalPipes(new ValidationPipe({ enableErrorDetail: true }));
  await app.init();
  await app
    .getHttpAdapter()
    .getInstance()
    .ready();
  return app;
}

describe('FusionApi (e2e)', () => {
  let app;
  let lastModifiedAt;
  let host;

  beforeEach(() => {
    jest.setTimeout(60000);
    lastModifiedAt = Date.now();
  });

  beforeAll(async() => {
    app = await initNestTestApp();
    const oss = app.get(EnvConfigService).getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    host = oss.host;
  });

  afterAll(async() => {
    await app.close();
  });

  it('fusionApi (未登录)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
      })
      .then(response => {
        expect(response.statusCode).to.be.eql(403);
        expect(response.json(response.payload)).to.deep.eql({
          success: false,
          code: 403,
          message: '未登录',
        });
      });
  });

  it('fusionApi (token格式错误)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        headers: {
          Authorization: 'bearer uskpJ1Y2L9yrESOsCHZ',
        },
      })
      .then(response => {
        expect(response.statusCode).to.be.eql(403);
        expect(response.json(response.payload)).to.deep.eql({
          success: false,
          code: 403,
          message: '未登录',
        });
      });
  });

  it('fusionApi (url不存在)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/',
        headers: {
          Authorization: 'bearer uskpJ1Y2L9yrESOsCHZ',
        },
      })
      .then(response => {
        expect(response.statusCode).to.be.eql(404);
        expect(response.json(response.payload)).to.deep.eql({
          success: false,
          code: 404,
          message: '接口不存在',
        });
      });
  });

  it('/fusionApi (api超出限制 )', () => {
    return app
      .inject({
        method: 'POST',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        headers: getDefaultHeader(app),
      })
      .then(response => {
        expect(response.statusCode).to.be.eql(200);
        expect(response.json(response.payload)).to.deep.eql({
          success: false,
          code: 214,
          message: 'api使用次数超出限制',
        });
      });
  });

  it('/fusionApi (请求方式错误 )', () => {
    return app
      .inject({
        method: 'POST',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        headers: getDefaultHeader(app),
      })
      .then(response => {
        expect(response.statusCode).to.be.eql(400);
        expect(response.json(response.payload)).to.deep.eql({
          success: false,
          code: 400,
          message: '参数异常',
        });
      });
  });

  it('/records (GET node不存在)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpce/records',
        headers: getDefaultHeader(app),
      })
      .then(response => {
        expect(response.statusCode).to.be.eql(200);
        expect(response.json(response.payload)).to.deep.eql({
          success: false,
          code: 601,
          message: '无法访问节点',
        });
      });
  });

  it('/records (GET 分页)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        query: {
          pageSize: 2,
          maxRecords: 4,
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.pageSize).to.be.eql(2);
        expect(result.data.total).to.be.eql(4);
        expect(result.data.records.length).to.be.eql(2);
      });
  });

  it('/records (GET 值为null或者勾选为false不返回字段)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        query: {
          // 第5条和第二条，顺序应该按照record的顺序
          recordIds: ['rec4fYoknscKV', 'recB06ir98QqB'],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields).to.not.have.property('标题');
        expect(result.data.records[0].fields).to.not.have.property('单选😭');
        expect(result.data.records[0].fields).to.not.have.property('多选😊');
        expect(result.data.records[1].fields).to.not.have.property('多行文本');
      });
  });

  it('/records (GET 关联和引用字段标准输出)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        query: {
          // 第一条
          recordIds: ['recx0QrYegGss'],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields['神奇关联-单选']).to.deep.eql(['recmXbcelpy6M']);
        expect(result.data.records[0].fields['神奇引用-问题']).to.deep.eql(['reccjQeTeqR8M']);
        expect(result.data.records[0].fields['神奇引用-回答']).to.deep.eql(['老师']);
        expect(result.data.records[0].fields['神奇引用-用户'][0].unitId).to.be.eql('1236159947884990467');
        expect(result.data.records[0].fields['神奇引用-用户'][0].unitType).to.be.eql(3);
        expect(result.data.records[0].fields['神奇引用-用户'][0].unitName).to.be.eql('陈伯超');
        expect(result.data.records[0].fields['神奇引用-用户'][0].avatar).to.include(host);
        expect(result.data.records[0].fields['神奇关联-多选']).to.deep.eql(['reck6eAsAwA0M', 'recnKNri2b8p5']);
        expect(result.data.records[0].fields['神奇引用-问题-多选']).to.deep.eql(['recQ7Yl20yw2X', 'recQ7Yl20yw2X']);
        expect(result.data.records[0].fields['神奇引用-回答-多选']).to.deep.eql(['10', '22']);
        expect(result.data.records[0].fields['神奇引用-用户-多选']).to.deep.eql([
          {
            unitId: '1236181428773851139',
            unitType: 3,
            unitName: '郑旭',
            avatar: 'https://s1.vika.cn/public/2020/08/04/8a3920feee944af093bbd2d53100ac36',
          },
          {
            unitId: '1236181428773851139',
            unitType: 3,
            unitName: '郑旭',
            avatar: 'https://s1.vika.cn/public/2020/08/04/8a3920feee944af093bbd2d53100ac36',
          },
        ]);
      });
  });

  it('/records (GET 关联和引用字段字符串输出)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        query: {
          // 第一条
          recordIds: ['recx0QrYegGss'],
          cellFormat: 'string',
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields['神奇关联-单选']).to.deep.eql('1');
        expect(result.data.records[0].fields['神奇引用-问题']).to.deep.eql('请问你的职业是？');
        expect(result.data.records[0].fields['神奇引用-回答']).to.deep.eql('老师');
        expect(result.data.records[0].fields['神奇引用-用户']).to.deep.eql('陈伯超');
        expect(result.data.records[0].fields['神奇关联-多选']).to.deep.eql('2, 3');
        expect(result.data.records[0].fields['神奇引用-问题-多选']).to.deep.eql('请问你的年龄？, 请问你的年龄？');
        expect(result.data.records[0].fields['神奇引用-回答-多选']).to.deep.eql('10, 22');
        expect(result.data.records[0].fields['神奇引用-用户-多选']).to.deep.eql('郑旭, 郑旭');
      });
  });

  it('/records (GET 创建人)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        query: {
          // 第一条
          recordIds: ['recx0QrYegGss'],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields.创建人.uuid).to.be.eql('3e2f7d835958472ab43a623f15dec64f');
        expect(result.data.records[0].fields.创建人.name).to.be.eql('陈伯超');
        expect(result.data.records[0].fields.创建人.avatar).to.include(host);
      });
  });

  it('/records (PATCH 修改人/修改时间)', () => {
    const dateTime = Date.now();
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第二条
              recordId: 'recB06ir98QqB',
              fields: {
                日期: dateTime,
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        expect(result.data.records[0].fields.更新时间).to.be.within(lastModifiedAt, Date.now());
        successExpect(response, result);
        expect(result.data.records[0].fields.修改人).to.deep.eql({
          uuid: '6117483ce3e341cfa5c8fe6d0e02cd46',
          name: '郑旭',
          avatar: 'https://s1.vika.cn/public/2020/08/04/8a3920feee944af093bbd2d53100ac36',
        });
        expect(result.data.records[0].fields.日期).to.deep.eql(dateTime);
      });
  });

  it('/records (GET fields/cellFormat参数过滤)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        query: {
          pageSize: 2,
          maxRecords: 2,
          fields: ['自增数字', '成员'],
          cellFormat: 'string',
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data).to.deep.eql({
          pageNum: 1,
          records: [
            {
              recordId: 'recx0QrYegGss',
              createdAt: 1599187790000,
              fields: {
                自增数字: '1',
                成员: '陈伯超, 郑旭, 邓贵恒',
              },
            },
            {
              recordId: 'recB06ir98QqB',
              createdAt: 1599187790000,
              fields: {
                自增数字: '2',
                成员: '陈伯超',
              },
            },
          ],
          pageSize: 2,
          total: 2,
        });
      });
  });
});
