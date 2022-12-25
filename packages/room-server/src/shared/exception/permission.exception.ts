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
 * Datasheet Permission Exception
 * 4000
 */
export class PermissionException implements IBaseException {
  private static AllValues: { [name: string]: PermissionException } = {};

  // Exception Type =================================================================
  static readonly SPACE_NOT_EXIST = new PermissionException(404, 'Space not found');
  static readonly NO_ALLOW_OPERATE = new PermissionException(411, 'User not in space');
  static readonly NODE_NOT_EXIST = new PermissionException(600, 'Node not found');
  static readonly ACCESS_DENIED = new PermissionException(601, 'Access denied');
  static readonly OPERATION_DENIED = new PermissionException(602, 'Operation denied');
  // Exception Type =================================================================

  private constructor(public readonly code: number, public readonly message: string) {
    PermissionException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
