import { OtErrorCode } from '@vikadata/core';
import { IBaseException } from './base.exception';

/**
 * 处理changeset的异常
 */
export class OtException implements IBaseException {

  private static AllValues: { [name: string]: OtException } = {};

  // 异常分类定义 Begin
  static readonly OPERATION_ABNORMAL = new OtException(OtErrorCode.SERVER_ERROR, 'Operation Abnormal');
  static readonly REVISION_ERROR = new OtException(OtErrorCode.REVISION_ERROR, 'Version Error');
  static readonly MATCH_VERSION_ERROR = new OtException(OtErrorCode.MATCH_VERSION_ERROR, 'Submit Version Do not Match');
  static readonly META_LOST_ERROR = new OtException(OtErrorCode.META_LOST_ERROR, 'Metadata Lost');
  static readonly APPLY_META_ERROR = new OtException(OtErrorCode.APPLY_META_ERROR, 'Transform Metadata Error');
  static readonly REVISION_CONFLICT = new OtException(OtErrorCode.CONFLICT, 'Version Conflict');
  static readonly REVISION_OVER_LIMIT = new OtException(OtErrorCode.REVISION_OVER_LIMIT, '发现新版本，请刷新页面');
  static readonly MSG_ID_DUPLICATE = new OtException(OtErrorCode.MSG_ID_DUPLICATE, 'Message Duplicate');
  static readonly SPACE_CAPACITY_OVER_LIMIT = new OtException(OtErrorCode.SPACE_CAPACITY_OVER_LIMIT, '您的附件使用量已经超出「公测版」限制');
  static readonly DATA_FORMAT_ERROR = new OtException(OtErrorCode.DATA_FORMAT_ERROR, '当前写入的数据格式错误');

  // 异常分类定义 End

  constructor(public readonly code: number, public readonly message: string) {
    OtException.AllValues[message] = this;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }
}
