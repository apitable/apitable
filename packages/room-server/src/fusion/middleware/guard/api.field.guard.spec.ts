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
import { ApiException } from '../../../shared/exception';
import { ApiFieldGuard } from './api.field.guard';

describe('ApiDatasheetGuard', () => {
  let app: NestFastifyApplication;
  let guard: ApiFieldGuard;
  // let request;
  let context: any;
  let memberRepository: any;
  beforeAll(async() => {
    jest.setTimeout(60000);
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
    guard = new ApiFieldGuard(memberRepository);
  });

  afterAll(async() => {
    await app.close();
  });

  describe('canActivate', () => {
    it('missing spaceId, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        params: {
          datasheetId: 'abc'
        },
      });
      const error = ApiException.tipError(ApiTipConstant.api_params_instance_space_id_error);
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });

    it('missing datasheetId, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        params: {
          spaceId: 'abc',
        },
      });
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });

    it('invalid datasheetId, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: null,
        params: {
          spaceId: 'bbb',
        },
      });
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });

    it('datasheetId is not in space, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: { spaceId: 'aaa' },
        user: {
          id: 'dafad',
        },
        params: {
          spaceId: 'bbb',
          datasheetId: 'aaa',
        },
      });
      (memberRepository.selectSpaceIdsByUserId as jest.Mock).mockReturnValueOnce(['bbb']);
      const error = ApiException.tipError(ApiTipConstant.api_datasheet_not_visible);
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });

    it('do not have permission to visit space, return 400 code', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        datasheet: 'aaa',
        user: {
          id: 'abadf',
        },
        params: {
          spaceId: 'aaa',
          datasheetId: 'aaa',
        },
      });
      (memberRepository.selectSpaceIdsByUserId as jest.Mock).mockReturnValueOnce(['bbb']);
      const error = ApiException.tipError(ApiTipConstant.api_forbidden_because_of_not_in_space);
      return guard.canActivate(context).catch(e => {
        return expect(e).toStrictEqual(error);
      });
    });
  });
});
