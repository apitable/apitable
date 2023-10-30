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

import { IBaseException } from './base.exception';

/**
 * Limit Exception
 */
export class LimitException implements IBaseException {
  private static AllValues: { [name: string]: LimitException } = {};

  // Exception Type =================================================================
  // 1501 is a public code. This code can be used when the front end does not require specific prompts.
  static readonly OVER_LIMIT= new LimitException(1501, 'exceed over limit');

  static readonly CREDIT_OVER_LIMIT= new LimitException(1504, 'credit over limit');

  // Exception Type =================================================================

  private constructor(public readonly code: number, public readonly message: string) {
    LimitException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
