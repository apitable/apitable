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

import { UserEntity } from 'user/entities/user.entity';
import { NodeRepository } from 'node/repositories/node.repository';
import { UnitMemberRepository } from 'unit/repositories/unit.member.repository';
import { DeveloperService } from 'developer/services/developer.service';
import { RestService } from 'shared/services/rest/rest.service';
import request from 'supertest';

import { getDefaultHeader } from './fusion-api.util';
import DoneCallback = jest.DoneCallback;
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { initHttpHook } from 'shared/adapters/adapters.init';
import { GlobalExceptionFilter } from 'shared/filters';
import { I18nService } from 'nestjs-i18n';
import { HttpResponseInterceptor } from 'shared/interceptor';
import { AppModule } from '../src/app.module';
import fastifyMultipart from 'fastify-multipart';

describe('FusionController (e2e) | create datasheet', () => {
  let app: NestFastifyApplication;
  let developerService: DeveloperService;
  let restService: RestService;
  let nodeRepository: NodeRepository;
  let memberRepository: UnitMemberRepository;
  const spaceId = 'spcjXzqVrjaP3';

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, WinstonModule],
    }).compile();
    const fastifyAdapter = new FastifyAdapter();
    fastifyAdapter.register(fastifyMultipart);
    const app = module.createNestApplication<NestFastifyApplication>(fastifyAdapter);
    const logger = module.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(logger);
    initHttpHook(app);
    const i18nService = app.get<I18nService>(I18nService);
    // Global Exception Handler
    app.useGlobalFilters(new GlobalExceptionFilter(i18nService));
    // app.useGlobalFilters(new GlobalExceptionFilter(logger));
    // Global Interceptor Handler(return standard response body if success)
    app.useGlobalInterceptors(new HttpResponseInterceptor());
    // Global Validator, return custom parameter validation error
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    developerService = app.get<DeveloperService>(DeveloperService);
    restService = app.get<RestService>(RestService);
    nodeRepository = app.get<NodeRepository>(NodeRepository);
    memberRepository = app.get<UnitMemberRepository>(UnitMemberRepository);
  });

  beforeEach(() => {
    jest.setTimeout(60000);
    const user = genUserEntity();
    jest.spyOn(developerService, 'getUserInfoByApiKey').mockImplementation((_apiKey) =>
      Promise.resolve(user));
    jest.spyOn(memberRepository, 'selectSpaceIdsByUserId').mockImplementation(() => Promise.resolve([spaceId]));
    jest.spyOn(restService, 'getApiUsage').mockImplementation(
      () => Promise.resolve({ isAllowOverLimit: true })
    );
    jest.spyOn(nodeRepository, 'getNodeInfo').mockImplementation((nodeId) => {
      let nodeInfo: any;
      if ('fodn173Q0e8nC' === nodeId) {
        nodeInfo = {
          type: 1,
          nodeId: 'fodn173Q0e8nC',
          spaceId,
        };
      } else if ('fodn43234423423' === nodeId) {
        nodeInfo = {
          type: 1,
          nodeId: 'fodn173Q0e8nC',
          spaceId: 'abcjXzqVrjaP3',
        };
      } else if ('dstfCEKoPjXSJ8jdSj' === nodeId) {
        nodeInfo = {
          type: 2,
          nodeId: 'dstfCEKoPjXSJ8jdSj',
          spaceId,
          parentId: 'fodn173Q12324',
          // parentId: 'fodn173Q0e8nC'
        };
      } else if ('dstPwrsxL326rTvqKw' === nodeId) {
        nodeInfo = {
          type: 2,
          nodeId: 'dstfCEKoPjXSJ8jdSj',
          spaceId: 'abcjXzqVrjaP3',
          parentId: 'fodn173Q0e8nC',
        };
      }
      return Promise.resolve(nodeInfo);
    });
  });

  afterAll(async() => {
    await app.close();
  });

  const genUserEntity = (): UserEntity => {
    const user = new UserEntity();
    user.nikeName = 'vika';
    user.id = '1';
    return user;
  };

  const mockRequest = (ro: {name: string, folderId?: string, preNodeId?: string}, done: DoneCallback, errorMsg?: string) => {
    return request(app.getHttpServer())
      .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
      .set(getDefaultHeader())
      .send(ro)
      .end((_err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ code: 400, message: errorMsg, success: false });
        done();
      });
  };

  it('not authorization, should return 401', (done) => {
    return request(app.getHttpServer())
      .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
      .end((_err, res) => {
        expect(res.status).toEqual(401);
        done();
      });
  });

  it('space not exist/ no space permission, should return 403', (done) => {
    return request(app.getHttpServer())
      .post('/fusion/v1/spaces/111/datasheets')
      .set(getDefaultHeader())
      .end((_err, res) => {
        expect(res.status).toEqual(403);
        expect(res.body).toEqual({ code: 403, message: 'Forbidden', success: false });
        done();
      });
  });

  describe('invalid datasheet params', () => {
    it('missing required params(name), should return 400 code', (done) => {
      return request(app.getHttpServer())
        .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
        .set(getDefaultHeader())
        .end((_err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({ code: 400, message: '[datasheet] should contains name', success: false });
          done();
        });
    });

    it('name is oversize, should return 400 code', (done) => {
      let name = '';
      for (let i = 0; i < 12; i++) {
        name += Math.random().toString(36).substring(2);
      }
      return request(app.getHttpServer())
        .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
        .set(getDefaultHeader())
        .send({ name })
        .end((_err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            code: 400,
            message: "[name]'s length could not exceed 100",
            success: false,
          });
          done();
        });
    });

    it('folder is not exist, should return 400 code, invalid folderId', (done) => {
      return mockRequest({
        name: 'test',
        folderId: 'abc',
      }, done, '[folderId] is not valid');
    });

    it('folder not in the space, should return 400 code, invalid folderId', (done) => {
      return mockRequest({
        name: 'test',
        folderId: 'fodn43234423423',
      }, done, '[folderId] is not valid');
    });

    it('preNode is not exist, should return 400 code, invalid preNodeId', (done) => {
      return mockRequest({
        name: 'test',
        preNodeId: 'dstfC',
      }, done, '[preNodeId] is not valid');
    });

    it('preNode is not in the space, should return 400 code, invalid preNodeId', (done) => {
      return mockRequest({
        name: 'test',
        preNodeId: 'dstPwrsxL326rTvqKw',
      }, done, '[preNodeId] is not valid');
    });

    it('preNode is not in the folder, should return 400 code, invalid preNodeId', (done) => {
      return mockRequest({
        name: 'test',
        folderId: 'fodn173Q0e8nC',
        preNodeId: 'dstfCEKoPjXSJ8jdSj',
      }, done, '[preNodeId] is not valid');
    });
  });

  describe('invalid fields params', () => {
    it('missing field.name, should return 400 code', (done) => {
      const ro = {
        name: 'test',
        fields: [
          {
            type: 'Text',
          },
        ],
      };
      return request(app.getHttpServer())
        .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
        .set(getDefaultHeader())
        .send(ro)
        .end((_err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({ code: 400, success: false, message: '[field] should contains name' });
          done();
        });
    });

    it('duplicate field.name, should return 400 code', (done) => {
      const ro = {
        name: 'test',
        fields: [
          {
            name: 'abc',
            type: 'Text',
          },
          {
            name: 'abc',
            type: 'Text',
          },
        ],
      };
      return request(app.getHttpServer())
        .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
        .set(getDefaultHeader())
        .send(ro)
        .end((_err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({ code: 400, success: false, message: '[field.name] should be unique' });
          done();
        });
    });

    it('missing field.type, should return 400 code', (done) => {
      const ro = {
        name: 'test',
        desc: '',
        fields: [
          {
            name: 'abc',
            property: {},
          },
        ],
      };
      return request(app.getHttpServer())
        .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
        .set(getDefaultHeader())
        .send(ro)
        .end((_err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({ code: 400, success: false, message: '[field] should contains type' });
          done();
        });
    });

    it('invalid field.type, should return 400 code', (done) => {
      const ro = {
        name: 'test',
        desc: '',
        fields: [
          {
            name: 'abc',
            type: 'radom',
            property: {},
          },
        ],
      };
      return request(app.getHttpServer())
        .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
        .set(getDefaultHeader())
        .send(ro)
        .end((_err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({ code: 400, success: false, message: '[fields[abc].type] is not valid' });
          done();
        });
    });

    it('invalid field.property, should return 400 code', (done) => {
      const ro = {
        name: 'test',
        desc: '',
        fields: [
          {
            name: 'abc',
            type: 'Number',
            property: {},
          },
        ],
      };
      return request(app.getHttpServer())
        .post(`/fusion/v1/spaces/${spaceId}/datasheets`)
        .set(getDefaultHeader())
        .send(ro)
        .end((_err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            code: 400,
            success: false,
            message: '[fields[abc].property] is not valid',
          });
          done();
        });
    });
  });

  describe('success request', () => {
    it('create datasheet only with name', (done) => {
      done();
    });

    it('create datasheet with name and description', (done) => {
      done();
    });

    it('create datasheet with name and fields', (done) => {
      done();
    });
  });
});
