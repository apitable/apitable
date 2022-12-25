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

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IAuthHeader } from '../../interfaces';

/**
 * @deprecated deprecated, use RestService instead.
 */
@Injectable()
export class JavaService {
  public static readonly SUCCESS_CODE = 200;
  private headers: any;
  constructor(private readonly httpService: HttpService) {}

  private getHeaders() {
    return {
      ...(this.headers || {}),
      'X-Internal-Request':'yes',
    };
  }
  public async post(url: string, data: any, options?: any): Promise<any> {
    const response = await this.httpService.post(url, data, {
      headers: this.getHeaders(), ...options }).toPromise();
    return response!.data;
  }

  public async get(url: string, params?: any, options?: any): Promise<any> {
    const response = await this.httpService.get(url, { params, headers: this.getHeaders(), ...options }).toPromise();
    return response!.data;
  }
  /**
   *
   * @param auth verfication
   * @param options other header parameters
   * @return
   * @author Zoe Zheng
   * @date 2020/8/12 10:53 AM
   */
  public setHeaders(auth: IAuthHeader, options?: any): this {
    if (auth.cookie) {
      this.headers = {
        Cookie: auth.cookie,
        ...options,
      };
    }
    if (auth.token) {
      this.headers = {
        Authorization: auth.token,
        ...options,
      };
    }
    return this;
  }
}
