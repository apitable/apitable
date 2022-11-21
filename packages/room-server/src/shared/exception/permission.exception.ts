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
