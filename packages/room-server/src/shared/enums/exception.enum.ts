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

export enum ApiExceptionEnum {
  /**
   * unauthorized, httpStatus code is 401
   */
  UNAUTHORIZED_ERROR,
  /**
   * parameters exception, httpStatus is 200, code is 400
   */
  VALIDATION,
  /**
   * datasheet not exist, httpStatus is 200, code is 301
   */
  DST_NOT_EXISTS,
  /**
   * exceed API request limit, httpStatus is 403, code is 403
   */
  API_LIMIT_EXCEEDED,
  /**
   * Failed to connect backend server, httpStatus is 500, code is 500
   */
  CONNECT_BACKEND_SERVER_ERROR,
  /**
   * server error, http status is 200, code is 500
   */
  SERVER_ERROR,
  /**
   * insert data error
   */
  INSERT_ERROR,
  /**
   * edit data error
   */
  EDIT_ERROR,
  /**
   * delete data error
   */
  DELETE_ERROR,
  /**
   * no permission of the node
   */
  NODE_OPERATION_DENIED,
}
