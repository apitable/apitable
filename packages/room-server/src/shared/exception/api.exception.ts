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

import { HttpException } from '@nestjs/common';
import { ApiTipConfig, ApiTipConstant, Strings, t } from '@apitable/core';
import { ServerException } from 'shared/exception/server.exception';
import { IApiErrorTip } from '../interfaces';
import { CommonException } from './common.exception';

export type ApiTipId = keyof typeof ApiTipConstant;

/**
 * API Tip constants
 */
export interface IApiTip {
  // error code
  code: number;
  // error ID
  id: string;
  // whether or not record the count of using
  isRecordTimes?: boolean;
  // error message, refer to the ID of strings
  message?: string;
  // http status code
  statusCode: number;
}

/**
 * <p>
 * Fusion API Exception
 * </p>
 * @author Zoe zheng
 * @date 2020/10/13 6:37 PM
 */
export class ApiException extends HttpException {
  private readonly extra: { [key: string]: any };
  private readonly tip: IApiTip;
  // private readonly code: number;

  constructor(tipId: ApiTipId, extra?: any) {
    super(ApiTipConfig.api.tips[tipId].id, ApiTipConfig.api.tips[tipId].statusCode);
    this.tip = ApiTipConfig.api.tips[tipId];
    this.extra = extra;
  }

  public static tipError(tipId: ApiTipId, extra?: { [key: string]: any }) {
    return new ApiException(tipId, extra);
  }

  /**
   * error message
   */
  public getMessage(): string {
    return this.message;
  }

  /**
   * extra information
   */
  public getExtra() {
    return this.extra;
  }

  /**
   * tips
   */
  public getTip(): IApiTip {
    return this.tip;
  }

  // keep the previous error message
  static init(code: number, message: string) {
    return new CommonException(code, message);
  }

  static error(tips: IApiErrorTip[] | IApiErrorTip) {
    const error: IApiErrorTip = Array.isArray(tips) ? tips[0]! : tips;
    const tip = ApiTipConfig[error.tipId];
    let message: string = ApiException.message(error.tipId, error?.value, error?.property);
    if (Array.isArray(tips)) {
      const messages = tips.map(v => {
        return ApiException.message(v.tipId, v?.value, v?.property);
      });
      message = messages.join(',');
    }
    return new ServerException(ApiException.init(tip.code, message), tip.statusCode);
  }

  static message(tipId: string, value?: any, property?: any) {
    return t(Strings[tipId], { value, property });
  }
}
