import { IBaseException } from './base.exception';

/**
 * 数表权限异常
 * 4000
 */
export class PermissionException implements IBaseException {

  private static AllValues: { [name: string]: PermissionException } = {};

  // 异常分类定义 Begin
  static readonly NODE_NOT_EXIST = new PermissionException(600, '节点不存在');
  static readonly ACCESS_DENIED = new PermissionException(601, '无权限访问');
  static readonly OPERATION_DENIED = new PermissionException(602, '无权限操作');

  // 异常分类定义 End

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