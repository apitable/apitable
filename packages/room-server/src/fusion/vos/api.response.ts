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

import { ConfigConstant } from '@apitable/core';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IHttpSuccessResponse } from 'shared/interfaces';

export class ApiResponse<T> implements IHttpSuccessResponse<T> {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Is it successful',
  })
  success!: boolean;

  @ApiProperty({
    type: Number,
    example: 200,
    description: 'Response Status Code',
  })
  code!: number;

  @ApiProperty({
    type: String,
    example: 'SUCCESS',
    description: 'Response Status Code Description',
  })
  message!: string;

  @ApiProperty({
    description: 'Response Data',
  })
  data!: T;

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse<T>()
      .setCode(HttpStatus.OK)
      .setSuccess(true)
      .setData(data)
      .setMessage(message ? message : ConfigConstant.DefaultStatusMessage.OK_MSG);
  }

  static error<T>(message: string, code?: number, data?: T) {
    return new ApiResponse<T>()
      .setCode(code ? code : HttpStatus.INTERNAL_SERVER_ERROR)
      .setMessage(message)
      .setSuccess(false)
      .setData(data as any);
  }

  getCode(): number {
    return this.code;
  }

  setCode(code: number): ApiResponse<T> {
    this.code = code;
    return this;
  }

  getSuccess(): boolean {
    return this.success;
  }

  setSuccess(success: boolean): ApiResponse<T> {
    this.success = success;
    return this;
  }

  getMessage(): string {
    return this.message;
  }

  setMessage(message: string): ApiResponse<T> {
    this.message = message;
    return this;
  }

  getData(): T | T[] {
    return this.data;
  }

  setData(data: T): ApiResponse<T> {
    this.data = data;
    return this;
  }
}
