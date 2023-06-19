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
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RestService } from 'shared/services/rest/rest.service';
import { Logger } from 'winston';
import { ApiException, CommonException, ServerException } from '../../../shared/exception';
import { ApiUsageGuard } from './api.usage.guard';

describe('ApiUsageGuard', () => {
  let app: NestFastifyApplication;
  let guard: ApiUsageGuard;
  let logger: Logger;
  let restService: RestService;
  let datasheetService: DatasheetService;
  let context: any;
  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    logger = await app.resolve(WINSTON_MODULE_PROVIDER);
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnThis(),
    };
    restService = app.get(RestService);
    datasheetService = app.get(DatasheetService);
    guard = new ApiUsageGuard(logger, restService, datasheetService);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('canActivate', () => {
    it('usage--call backend error--should return error', () => {
      jest.spyOn(restService, 'getApiUsage').mockImplementationOnce(
        (): Promise<string[]> => {
          throw new ServerException(CommonException.SERVER_ERROR);
        },
      );
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(ApiException.tipError(ApiTipConstant.api_server_error));
      });
    });
    it('usage not isAllowOverLimit throws an error', () => {
      jest.spyOn(restService, 'getApiUsage').mockImplementationOnce(
        (): any => {
          return {
            data: {
              isAllowOverLimit: false,
              maxApiUsageCount: 2,
              apiUsageUsedCount: 4
            }
          };
        },
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
