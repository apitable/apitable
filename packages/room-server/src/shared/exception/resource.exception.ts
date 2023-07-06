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
 * Resource Exception
 *
 * @export
 * @class ResourceException
 * @implements {IBaseException}
 */
export class ResourceException implements IBaseException {
  private static AllValues: { [name: string]: ResourceException } = {};

  // Exception Type ------------------------------
  static readonly WIDGET_NOT_EXIST = new ResourceException(401, 'Widget not found');
  static readonly FETCH_WIDGET_ERROR = new ResourceException(402, 'Get widget error');
  static readonly WIDGET_NUMBER_LIMIT = new ResourceException(462, 'The number of widget has reached the upper limit, and the creation failed');

  // Exception Type ------------------------------

  private constructor(public readonly code: number, public readonly message: string) {
    ResourceException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
