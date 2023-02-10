/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
