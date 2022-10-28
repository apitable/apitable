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
  static readonly NODE_SHARE_NO_ALLOW_EDIT = new CommonException(601, 'It is not allowed to edit');
  // Exception type --------------------------------

  public constructor(public readonly code: number, public readonly message: string) {
    CommonException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
