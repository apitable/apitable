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
import { HttpStatus } from '@nestjs/common';

/**
 * Server Exception
 */
export class ServerException extends Error {
  /**
   * Error code
   */
  private readonly code: number;
  /**
   * http status code
   */
  private readonly statusCode: number;

  constructor(baseException: IBaseException, statusCode?: number) {
    super(baseException.getMessage());
    this.code = baseException.getCode();
    this.statusCode = statusCode ? statusCode : HttpStatus.OK;
  }

  getCode(): number {
    return this.code;
  }

  getMessage(): string {
    return this.message;
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}
