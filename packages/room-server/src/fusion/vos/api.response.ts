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
  success: boolean;

  @ApiProperty({
    type: Number,
    example: 200,
    description: 'Response Status Code',
  })
  code: number;

  @ApiProperty({
    type: String,
    example: 'SUCCESS',
    description: 'Response Status Code Description',
  })
  message: string;

  @ApiProperty({
    description: 'Response Data',
  })
  data: T;

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
      .setData(data);
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
