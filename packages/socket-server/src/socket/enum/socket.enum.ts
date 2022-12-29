export enum SocketEventEnum {
  CONNECTION = 'connection',
  DISCONNECTION = 'disconnect',
  DISCONNECTING = 'disconnecting',
  CLUSTER_SOCKET_ID_EVENT = 'clusterSocketIDEvent',
}
export enum ServerErrorCode {
  // node-server 5 digits for server-side exceptions, 3~4 digits for java server-side exceptions
  ServerError = 50000,
  NetworkError = 50001,
  Reject = 50002, // transform error rejected
  BaseRevisionMaxExceed = 50003, // baseRevision larger than server side revision
  BaseRevisionDiffExceed = 50004, // baseRevision too big a gap with the server side
  ChangesetLengthError = 50005, // acquired changeset length revisions inconsistency
  MetaApplyError = 50006, // meta changeset an error occurred during application
  NoRoom = 50007, // room not generated

  MessageDuplicate = 423, // changeset messageId repeat
}

export enum ServerErrorType {
  ERROR = 'ERROR',
}
