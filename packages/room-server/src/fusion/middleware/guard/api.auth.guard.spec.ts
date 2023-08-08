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
import { ApiException } from '../../../shared/exception';
import { ApiAuthGuard } from './api.auth.guard';

describe('ApiAuthGuard', () => {
  let guard: ApiAuthGuard;
  // let request;
  let context: any;
  beforeEach(() => {
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnThis(),
    };
    guard = new ApiAuthGuard();
  });

  describe('canActivate', () => {
    it('request user null error', () => {
      const error = ApiException.tipError(ApiTipConstant.api_unauthorized);
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        user: null,
      });
      try {
        guard.canActivate(context);
      } catch (e) {
        expect(e).toStrictEqual(error);
      }
    });
    it('request user not null with true', () => {
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        user: 'aaa',
      });
      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
