export enum ServerErrorCode {
  // node 服务端异常为 5 位数字, java 服务端异常为 3~4 位数字
  ServerError = 50000,
  Deny = 50001,
  Reject = 50002, // transform 错误被 reject
  BaseRevisionMaxExceed = 50003, // baseRevision 大于服务端 revision
  BaseRevisionDiffExceed = 50004, // baseRevision 与服务端差距太大
  ChangesetLengthError = 50005, // 获取到的 ChangesetLength revisions 不一致
  MetaApplyError = 50006, // meta changeset 应用时发生错误
  NoRoom = 50007, // 房间未生成

  MessageDuplicate = 423, // changeset messageId 重复
}

export enum ErrorCode {
  Unknown = 'F0001',
  TableDeleted = 'F0002',
  RecordDeleted = 'F0003',
  FieldDeleted = 'F0004',
  ViewDeleted = 'F0005',
  RequestTimeout = 'F1001',

  ResponseInvalidMessage = 'F2001',
  ResponseUnexpectedResponse = 'F2002',

  InvalidOperation = 'F3001',
  CommandExecuteFailed = 'F3002',
  CollaFollowRejected = 'F3003',
  EngineCreateFailed = 'F3004',
  /**
   * 本地文档版本与服务器最新版本差距超过阈值
   */
  CollaRevGap = 'F3005',
  CollaSyncError = 'F3006',
  CollaModalError = 'F3007',
  ModelInvalidJSON = 'F4001',

  /**
   * 不支持类型错误码
   */
  NotSupportAction = 'F5001',

  /**
   * 权限不足
   */
  PermissionDenied = 'F6001',
}

export enum ErrorType {

  /**
   * 未知错误
   */
  UnknownError = 'Error.Unknown',

  Warning = 'Error.Warning',

  /**
   * 请求时出错
   */
  RequestError = 'Error.Request',

  /**
   * 响应请求时出错
   */
  ResponseError = 'Error.Response',

  /**
   * 协同错误
   */
  CollaError = 'Error.Colla',

  /**
   * 数据错误
   */
  ModelError = 'Error.Model',

  /**
   * 服务端返回的 Error
   */
  ServerError = 'Error.Sever',

  /**
   * 不支持的Action
   */
  NotSupportError = 'Error.NotSupport',

  /**
   * 权限不足
   */
  PermissionDeniedError = 'Error.PermissionDenied',
}

export enum ModalType {
  Error = 'error',
  Success = 'success',
  Warning = 'warning',
  Info = 'info',
}

export enum OnOkType {
  Refresh = 'Refresh',
  BackWorkBench = 'BackWorkBranch'
}

export interface IError {
  type: ErrorType;
  code: ErrorCode | ServerErrorCode | string;
  message: string;
  title?: string;
  okText?: string;
  modalType?: ModalType;
  onOkType?: OnOkType;
  isShowQrcode?: boolean;
}
