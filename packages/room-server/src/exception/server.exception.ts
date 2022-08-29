import { IBaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

/**
 * 自定义服务异常
 */
export class ServerException extends Error {
  /**
   * 错误状态码
   */
  private readonly code: number;
  /**
   * http status 自定义状态码
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
