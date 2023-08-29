import { HttpException, HttpStatus } from '@nestjs/common';
import { LimitException } from 'shared/exception';

export class OverLimitException extends HttpException {

  private readonly _ex: LimitException;

  constructor(exception: LimitException) {
    super(exception.getMessage(), HttpStatus.FORBIDDEN);
    this._ex = exception;
  }

  get ex(): LimitException {
    return this._ex;
  }
}