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
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { ApiDatasheetGuard } from 'fusion/middleware/guard/api.datasheet.guard';
import { ApiException } from '../../../shared/exception';

describe('ApiDatasheetGuard', () => {
  let app: NestFastifyApplication;
  let guard: ApiDatasheetGuard;
  // let request;
  let context: any;
  let memberRepository: any;
  beforeAll(async() => {
    jest.setTimeout(300000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    // request = app.resolve(REQUEST);
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnThis(),
    };
    memberRepository = {
      selectSpaceIdsByUserId: jest.fn().mockReturnThis(),
    };
    guard = new ApiDatasheetGuard(memberRepository);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('canActivate', () => {
    it('datasheetId--null--should return error', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        params: {
          datasheetId: null,
        },
      });
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });
    it('request datasheet null with error', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: null,
      });
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });
    it('request datasheet not in space error', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: 'aaa',
        user: {
          spaceId: ['aa']
        },
        params: {
          datasheetId: 'aaa',
        },
      });
      (memberRepository.selectSpaceIdsByUserId as jest.Mock).mockReturnValueOnce(['bbb']);
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_visible);
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });
  });
});
