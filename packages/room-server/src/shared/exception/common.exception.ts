import { IBaseException } from './base.exception';

/**
 * 公用异常
 */
export class CommonException implements IBaseException {
  private static AllValues: { [name: string]: CommonException } = {};

  static readonly COMMON_ERROR_CODE = 500;

  // 异常分类定义 Begin
  static readonly UNAUTHORIZED = new CommonException(201, '未授权或者访问失效');
  static readonly SERVER_ERROR = new CommonException(500, '服务器异常');
  static readonly ROBOT_FORM_CHECK_ERROR = new CommonException(444, '机器人表单校验失败');
  static readonly ROBOT_CREATE_OVER_MAX_COUNT_LIMIT = new CommonException(445, '机器人数量超过上限');
  static readonly NODE_SHARE_NO_ALLOW_EDIT = new CommonException(601, '分享人已关闭外部编辑权限');

  // 异常分类定义 End

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
