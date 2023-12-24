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
import '@apitable/i18n-lang';
import { RestService } from 'shared/services/rest/rest.service';
import { ApiException, CommonException, ServerException } from '../../../shared/exception';
import { ApiUsageGuard } from './api.usage.guard';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';

describe('ApiUsageGuard', () => {
  let app: NestFastifyApplication;
  let guard: ApiUsageGuard;
  let restService: RestService;
  let context: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnThis(),
    };
    restService = app.get(RestService);
    guard = app.get(ApiUsageGuard);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('canActivate', () => {
    it('usage--call backend error--should return error', () => {
      jest.spyOn(restService, 'getApiUsage').mockImplementationOnce(
        () => {
          throw new ServerException(CommonException.SERVER_ERROR);
        },
      );
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_server_error));
      });
    });
    it('usage not isAllowOverLimit throws an error', () => {
      jest.spyOn(restService, 'getApiUsage').mockImplementationOnce(
        () => Promise.resolve({
          isAllowOverLimit: false,
          maxApiUsageCount: 2,
          apiCallUsedNumsCurrentMonth: 2,
          apiUsageUsedCount: 4,
          apiCallNumsPerMonth: 4
        }),
      );
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_forbidden_because_of_usage));
      });
    });
    it('java api not response throws an error', () => {
      jest.spyOn(restService, 'getApiUsage').mockImplementationOnce(
        (): any => {
          return null;
        },
      );
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_forbidden));
      });
    });
  });
});
