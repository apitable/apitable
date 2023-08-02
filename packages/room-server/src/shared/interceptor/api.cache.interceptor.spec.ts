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
import { ApiCacheInterceptor } from 'shared/interceptor/api.cache.interceptor';

describe('ApiCacheInterceptor', () => {
  let interceptor: ApiCacheInterceptor;
  let cacheManager: any;
  let reflector: any;
  let context: any;
  beforeAll(() => {
    cacheManager = jest.fn().mockReturnThis();
    reflector = jest.fn().mockReturnThis();
    interceptor = new ApiCacheInterceptor(cacheManager, reflector);
    context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnThis(),
    };
  });

  describe('isRequestCacheable', () => {
    it('post request method--should return false', () => {
      const mockTrue = { isApiCacheEnabled: true };
      jest.mock('app.environment', () => mockTrue);
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        method: 'POST',
      });
      const result = interceptor.isRequestCacheable(context);
      expect(result).toEqual(false);
    });

    it('patch method--should return false', () => {
      const mockTrue = { isApiCacheEnabled: true };
      jest.mock('app.environment', () => mockTrue);
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        method: 'PATCH',
      });
      const result = interceptor.isRequestCacheable(context);
      expect(result).toEqual(false);
    });

    it('put method--should return false', () => {
      const mockTrue = { isApiCacheEnabled: true };
      jest.mock('app.environment', () => mockTrue);
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValueOnce({
        method: 'PUT',
      });
      const result = interceptor.isRequestCacheable(context);
      expect(result).toEqual(false);
    });

    it('only get method--should return false', () => {
      const mockTrue = { isApiCacheEnabled: true };
      jest.mock('app.environment', () => mockTrue);
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({
        method: 'GET',
        headers: {}
      });
      const result = interceptor.isRequestCacheable(context);
      expect(result).toEqual(false);
    });

    it('get method with header--should return true', () => {
      const mockTrue = { isApiCacheEnabled: true };
      jest.mock('app.environment', () => mockTrue);
      (context.switchToHttp().getRequest as jest.Mock).mockReturnValue({
        method: 'GET',
        headers: {
          'x-max-age': 10
        }
      });
      const result = interceptor.isRequestCacheable(context);
      expect(result).toEqual(false);
    });
  });
});
