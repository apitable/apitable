import { IBaseException } from './base.exception';

/**
 * 资源相关异常组
 *
 * @export
 * @class ResourceException
 * @implements {IBaseException}
 */
export class ResourceException implements IBaseException {
  private static AllValues: { [name: string]: ResourceException } = {};

  // 异常分类定义 Begin
  static readonly WIDGET_NOT_EXIST = new ResourceException(401, '组件不存在');
  static readonly FETCH_WIDGET_ERROR = new ResourceException(402, '获取组件信息失败');
  // 异常分类定义 End

  private constructor(public readonly code: number, public readonly message: string) {
    ResourceException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
