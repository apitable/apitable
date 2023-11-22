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
 * Common Exception
 */
export class CommonException implements IBaseException {
  private static AllValues: { [name: string]: CommonException } = {};

  static readonly COMMON_ERROR_CODE = 500;

  // Exception type --------------------------------
  static readonly UNAUTHORIZED = new CommonException(201, 'unauthorized');
  static readonly SERVER_ERROR = new CommonException(500, 'Server Error');
  static readonly ROBOT_FORM_CHECK_ERROR = new CommonException(444, 'Robot form validation error');
  static readonly ROBOT_CREATE_OVER_MAX_COUNT_LIMIT = new CommonException(445, 'exceed the limit number of robot');
  static readonly ROBOT_ACTION_CREATE_OVER_MAX_COUNT_LIMIT = new CommonException(446, 'exceed the limit number of robot action');

  static readonly NODE_SHARE_NO_ALLOW_EDIT = new CommonException(601, 'It is not allowed to edit');

  static readonly AUTOMATION_NOT_ACTIVE = new CommonException(1106, 'The automation not activated');

  static readonly AUTOMATION_TRIGGER_NOT_EXIST = new CommonException(1107, 'The automation trigger not exits');

  static readonly AUTOMATION_TRIGGER_INVALID = new CommonException(1108, 'The automation trigger invalid');

  // Exception type --------------------------------

  public constructor(
    public readonly code: number,
    public readonly message: string,
  ) {
    CommonException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
