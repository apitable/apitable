export enum SocketEventEnum {
  CONNECTION = 'connection',
  DISCONNECTION = 'disconnect',
  DISCONNECTING = 'disconnecting',
}
export enum ServerErrorCode {
  // node 服务端异常为 5 位数字, java 服务端异常为 3~4 位数字
  ServerError = 50000,
  NetworkError = 50001,
  Reject = 50002, // transform 错误被 reject
  BaseRevisionMaxExceed = 50003, // baseRevision 大于服务端 revision
  BaseRevisionDiffExceed = 50004, // baseRevision 与服务端差距太大
  ChangesetLengthError = 50005, // 获取到的 ChangesetLength revisions 不一致
  MetaApplyError = 50006, // meta changeset 应用时发生错误
  NoRoom = 50007, // 房间未生成

  MessageDuplicate = 423, // changeset messageId 重复
}

export enum ServerErrorType {
  ERROR = 'ERROR',
}
