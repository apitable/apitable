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

import { ILocalChangeset, IRemoteChangeset } from 'engine/ot';
import { IApiWrapper, IFieldPermission, IFieldRoleSetting, IWatchResult } from '../exports/store/interfaces';
import { Role } from 'config/constant';
import { ModalType, OnOkType } from 'types';
/**
 * The type of request message that is sent out actively
 */
export enum SyncRequestTypes {
  /**
   * Establish a long connection channel
   */
  WATCH_ROOM = 'WATCH_ROOM',

  /**
   * leave the collaboration room
   */
  LEAVE_ROOM = 'LEAVE_ROOM',

  /**
   * Messages in Room
   * Can send multiple changesets at one time
   */
  CLIENT_ROOM_CHANGE = 'CLIENT_ROOM_CHANGE',

  /**
   * ROOM message for NEST service
   */
  NEST_ROOM_CHANGE = 'NEST_ROOM_CHANGE',
}

/**
 * Type of message to broadcast
 */
export enum BroadcastTypes {
  /**
   * Other users in the room operated changeset
   * Because compared to the client, it is actively pushed by the server, so it starts with Server
   */

  SERVER_ROOM_CHANGE = 'SERVER_ROOM_CHANGE',

  /**
   * There are newly activated collaboration (multiple) people
   */
  ACTIVATE_COLLABORATORS = 'ACTIVATE_COLLABORATORS',

  /**
   * A collaborator has been deactivated
   */
  DEACTIVATE_COLLABORATOR = 'DEACTIVATE_COLLABORATOR',

  /**
   * A user updated the cursor
   */
  ENGAGEMENT_CURSOR = 'ENGAGEMENT_CURSOR',

  /**
   * Node sharing is turned off
   */
  NODE_SHARE_DISABLED = 'NODE_SHARE_DISABLED',

  /**
   * Field permission is enabled
   */
  FIELD_PERMISSION_ENABLE = 'FIELD_PERMISSION_ENABLE',

  /**
   * Field permission change
   */
  FIELD_PERMISSION_CHANGE = 'FIELD_PERMISSION_CHANGE',

  /**
   * Field permission off
   */
  FIELD_PERMISSION_DISABLE = 'FIELD_PERMISSION_DISABLE',

  /**
   * Field configuration property changes
   */
  FIELD_PERMISSION_SETTING_CHANGE = 'FIELD_PERMISSION_SETTING_CHANGE',
}

export type INewChangesData = {
  type: BroadcastTypes.SERVER_ROOM_CHANGE;
  changesets: IRemoteChangeset[];
};

export type INodeShareDisabledData = {
  type: BroadcastTypes.NODE_SHARE_DISABLED;
  shareIds: string[];
};

export type IFieldPermissionMessage = {
  datasheetId: string;
  fieldId: string;
  operator: string;
  changeTime: number;
  role?: Role;
  setting?: IFieldRoleSetting;
  permission?: IFieldPermission;
};

// Front-end request data type
export type IBaseClientVarsExtraData =
  | {
      baseRev?: number;
      /**
       * When openType = 1, let the backend distinguish the request, not show in the recently viewed document
       */
      openType?: number;
    }
  | {
      baseRev?: number;
      /**
       * With this field, ClientVars will bring back a snapshot of the specified tableId
       */
      tableId: string;
      /**
       * In the case of this field and block data, the backend will first return the first xxx rows of data of the specified view
       */
      viewId?: string;
      /**
       * When openType = 1, let the backend distinguish the request, not show in the recently viewed document
       */
      openType?: number;
    };

export interface ICursorInfoRequestData {
  datasheetId: string;
  viewId: string;
  fieldId: string;
  recordId: string;
  time: number;
}

// broadcast data type
export interface IEngagementCursorData {
  type: BroadcastTypes.ENGAGEMENT_CURSOR;
  cursorInfo: ICursorInfoRequestData;
  socketId: string;
}

export interface IMemberInfo {
  colorId: number;
  userId: string;
  createTime: number;
  touchTime: number;
}

export interface IResourceOperation {
  type: SyncRequestTypes;
  roomId: string;
  resourceIds: string[];
}

export interface ISocketResponseData extends IApiWrapper {
  data?: INewChangesData;
  title?: string;
  okText?: string;
  modalType?: ModalType;
  onOkType?: OnOkType;
  isShowQrcode?: boolean;
}

export interface IWatchResponse extends IApiWrapper {
  data?: IWatchResult;
}

export interface IClientRoomMessage {
  type: SyncRequestTypes.CLIENT_ROOM_CHANGE;
  roomId: string;
  changesets: ILocalChangeset[];
  shareId?: string;
}

export enum OtErrorCode {
  // server exception
  SERVER_ERROR = 4000,
  // message repeats
  MSG_ID_DUPLICATE = 4001,
  // commit version conflict
  VERSION_CONFLICT = 4002,
  // Commit version overrun
  REVISION_OVER_LIMIT = 4003,
  // commit version error
  REVISION_ERROR = 4004,
  // Failed to update column header
  APPLY_META_ERROR = 4005,
  // structure is missing
  META_LOST_ERROR = 4006,
  // version numbers do not match
  MATCH_VERSION_ERROR = 4007,
  // The space capacity exceeds the limit
  SPACE_CAPACITY_OVER_LIMIT = 4008,
  // cell data format write error
  DATA_FORMAT_ERROR = 4009,
  // operation conflict
  OPERATION_CONFLICT = 4010,
}
