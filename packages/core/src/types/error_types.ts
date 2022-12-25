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

export enum ServerErrorCode {
  // The node server exception is 5 digits, and the java server exception is 3~4 digits
  ServerError = 50000,
  Deny = 50001,
  Reject = 50002, // transform error is rejected
  BaseRevisionMaxExceed = 50003, // baseRevision is greater than server revision
  BaseRevisionDiffExceed = 50004, // The gap between baseRevision and server is too big
  ChangesetLengthError = 50005, // The obtained ChangesetLength revisions are inconsistent
  MetaApplyError = 50006, // An error occurred while applying the meta changeset
  NoRoom = 50007, // room not generated

  MessageDuplicate = 423, // changeset messageId duplicate
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
   * The difference between the local document version and the latest server version exceeds the threshold
   */
  CollaRevGap = 'F3005',
  CollaSyncError = 'F3006',
  CollaModalError = 'F3007',
  ModelInvalidJSON = 'F4001',

  /**
   * Type error codes are not supported
   */
  NotSupportAction = 'F5001',

  /**
   * Insufficient permissions
   */
  PermissionDenied = 'F6001',
}
export enum ErrorType {

  /**
   * unknown mistake
   */
  UnknownError = 'Error.Unknown',

  Warning = 'Error.Warning',

  /**
   * An error occurred while requesting
   */
  RequestError = 'Error.Request',

  /**
   * Error responding to request
   */
  ResponseError = 'Error.Response',

  /**
   * Collaboration error
   */
  CollaError = 'Error.Colla',

  /**
   * data error
   */
  ModelError = 'Error.Model',

  /**
   * Error returned by the server
   */
  ServerError = 'Error.Sever',

  /**
   * Unsupported Action
   */
  NotSupportError = 'Error.NotSupport',

  /**
   * Insufficient permissions
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
