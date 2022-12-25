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

import { RedisService } from '@apitable/nestjs-redis';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { I18nService } from 'nestjs-i18n';
import sha1 from 'sha1';
import { NodeRateLimiterMiddleware } from 'shared/middleware/node.rate.limiter.middleware';
import { NODE_LIMITER_PREFIX } from '../common';
import { IBaseRateLimiter } from '../interfaces';
import Mock = jest.Mock;

describe('FusionApiRateLimiter', () => {
  let app: NestFastifyApplication;
  let rateLimiter: NodeRateLimiterMiddleware;
  let redisService: RedisService;
  let i18nService: I18nService;
  let envConfigService: any;
  let callHandler: Mock;
  let res: any;

  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    redisService = app.get(RedisService);
    i18nService = app.get(I18nService);
    envConfigService = {
      getRoomConfig: jest.fn().mockReturnThis(),
    };
    rateLimiter = new NodeRateLimiterMiddleware(redisService, envConfigService, i18nService);
    callHandler = jest.fn();
  });

  afterAll(async() => {
    await app.close();
  });

  beforeEach(async() => {
    res = {
      setHeader: jest.fn(),
      end: jest.fn(),
      write: jest.fn(),
    };

    await clearRedis();
  });

  async function clearRedis() {
    await redisService.getClient().flushdb();
  }

  async function waitForAsyncProcessing(seconds = 0.2) {
    await new Promise((r) => setTimeout(r, seconds * 1000));
  }

  describe('datasheet-limit', () => {

    it('node-limit return 429', async() => {
      for (let i = 0; i < 3; i++) {
        (envConfigService.getRoomConfig as jest.Mock).mockReturnValueOnce({
          points: 1,
          duration: 120,
        });
        rateLimiter.use(
          {
            originalUrl: '/fusion/v1/nodes/dst1********',
            headers: {
              authorization: 'Bearer aaa1',
            },
          },
          res,
          callHandler,
        );
      }
      await waitForAsyncProcessing();

      const times = await redisService.getClient().get(NODE_LIMITER_PREFIX + ':dst1********:' + sha1('aaa1'));
      expect(times).toEqual('3');
      expect(res.statusCode).toEqual(429);
    });

    it('datasheet-limit return 429', async() => {
      for (let i = 0; i < 3; i++) {
        (envConfigService.getRoomConfig as jest.Mock).mockReturnValueOnce({
          points: 1,
          duration: 120,
        });
        rateLimiter.use(
          {
            originalUrl: '/fusion/v1/datasheets/dst********/records',
            headers: {
              authorization: 'Bearer aaa',
            },
          },
          res,
          callHandler,
        );
      }
      await waitForAsyncProcessing();

      const times = await redisService.getClient().get(`${NODE_LIMITER_PREFIX}:dst********:${sha1('aaa')}`);
      expect(times).toEqual('3');
      expect(res.statusCode).toEqual(429);
    });

    it('spaces-user-limit return 429', async() => {
      for (let i = 0; i < 3; i++) {
        (envConfigService.getRoomConfig as jest.Mock).mockReturnValueOnce({
          points: 1,
          duration: 120,
        });
        rateLimiter.use(
          {
            originalUrl: '/fusion/v1/spaces',
            headers: {
              authorization: 'Bearer aaa2',
            },
          },
          res,
          callHandler,
        );
      }
      await waitForAsyncProcessing();

      const times = await redisService.getClient().get(NODE_LIMITER_PREFIX + ':user:' + sha1('aaa2'));
      expect(times).toEqual('3');
      expect(res.statusCode).toEqual(429);
    });

    it('spaces-ids-limit return 429', async() => {
      for (let i = 0; i < 3; i++) {
        (envConfigService.getRoomConfig as jest.Mock).mockReturnValueOnce({
          points: 1,
          duration: 120,
        });
        rateLimiter.use(
          {
            originalUrl: '/fusion/v1/spaces/spc******/nodes',
            headers: {
              authorization: 'Bearer aaa3',
            },
          },
          res,
          callHandler,
        );
      }
      await waitForAsyncProcessing();

      const times = await redisService.getClient().get(NODE_LIMITER_PREFIX + ':spc******:' + sha1('aaa3'));
      expect(times).toEqual('3');
      expect(res.statusCode).toEqual(429);
    });
    it('space-node-limit return 429', async() => {
      for (let i = 0; i < 3; i++) {
        (envConfigService.getRoomConfig as jest.Mock).mockReturnValueOnce({
          points: 1,
          duration: 120,
        });
        rateLimiter.use(
          {
            originalUrl: '/fusion/v1//spaces/spc1******/nodes/dst2********',
            headers: {
              authorization: 'Bearer aaa4',
            },
          },
          res,
          callHandler,
        );
      }
      await waitForAsyncProcessing();

      const times = await redisService.getClient().get(NODE_LIMITER_PREFIX + ':dst2********:' + sha1('aaa4'));
      expect(times).toEqual('3');
      expect(res.statusCode).toEqual(429);
    });

    it('white-List-limit return 429', async() => {
      for (let i = 0; i < 3; i++) {
        const whiteList = new Map<string, IBaseRateLimiter>();
        whiteList.set('aaa5', { points: 1, duration: 120 });
        (envConfigService.getRoomConfig as jest.Mock).mockReturnValueOnce({
          points: 5,
          duration: 120,
          whiteList
        });
        rateLimiter.use(
          {
            originalUrl: '/fusion/v1//spaces/spc1******/nodes/dst3********',
            headers: {
              authorization: 'Bearer aaa5',
            },
          },
          res,
          callHandler,
        );
      }
      await waitForAsyncProcessing();

      const times = await redisService.getClient().get(NODE_LIMITER_PREFIX + ':dst3********:' + sha1('aaa5'));
      expect(times).toEqual('3');
      expect(res.statusCode).toEqual(429);
    });

    it('white-List-limit return 200', async() => {
      for (let i = 0; i < 3; i++) {
        const whiteList = new Map<string, IBaseRateLimiter>();
        whiteList.set('aaa6', { points: 3, duration: 120 });
        (envConfigService.getRoomConfig as jest.Mock).mockReturnValueOnce({
          points: 1,
          duration: 120,
          whiteList
        });
        rateLimiter.use(
          {
            originalUrl: '/fusion/v1//spaces/spc1******/nodes/dst4********',
            headers: {
              authorization: 'Bearer aaa6',
            },
          },
          res,
          callHandler,
        );
      }
      await waitForAsyncProcessing();

      const times = await redisService.getClient().get(NODE_LIMITER_PREFIX + ':dst4********:' + sha1('aaa6'));
      expect(times).toEqual('3');
      expect(res.statusCode).toEqual(undefined);
    });
  });
});

