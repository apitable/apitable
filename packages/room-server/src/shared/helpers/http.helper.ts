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

import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { AxiosResponse } from 'axios';
import { Observable, lastValueFrom } from 'rxjs';
import { CommonException, ServerException } from 'shared/exception';
import { IHttpSuccessResponse } from 'shared/interfaces';
import { IAuthHeader } from 'shared/interfaces/axios.interfaces';

/**
 * set auth headers
 * @param cookie Cookie KEY
 * @param token Authorization Header
 */
export function createAuthHeaders({ cookie, token }: IAuthHeader): any {
  if (cookie) {
    return {
      Cookie: cookie,
    };
  }

  if (token) {
    return {
      Authorization: token,
    };
  }
}

export function withSpaceIdHeader(header: any, spaceId?: string) {
  return spaceId ? { ...header, 'X-Space-Id': spaceId } : header;
}

/**
 * get the specified value from the cookie string
 *
 * @param cookie
 * @param key
 */
export const getValueFromCookie = (cookie: string, key: string): string | null => {
  if (cookie.length > 0) {
    const ca = cookie.split(';');
    for (const i of ca) {
      const c = i.trim();
      if (c.includes(key)) {
        return c.slice(key.length + 1, c.length);
      }
    }
    return null;
  }
  return null;
};

export const getRequestLanguage = (headers: any): string => {
  const lang = headers['accept-language'];
  if (isEmpty(lang)) {
    return 'zh-CN';
  }
  return lang.split(',')[0].trim();
};

export const getResponseData = async (res: Observable<AxiosResponse<any>>): Promise<any> => {
  const response = await lastValueFrom(res);
  if (response.status != 200) {
    throw new ServerException(CommonException.SERVER_ERROR);
  }
  const restResponse = response.data as IHttpSuccessResponse<any>;
  if (!restResponse.success) {
    throw new Error(restResponse.message);
  }
  return restResponse!.data;
};