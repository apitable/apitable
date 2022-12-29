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
