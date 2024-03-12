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

import { IFieldPermissionMap, IPermissions } from '@apitable/core';

/**
 * @deprecated server response data
 */
export interface IAxiosResponseData<T> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}

export interface INodePermissionBase {
  hasRole: boolean;
  userId?: string;
  uuid?: string;
  role: string;
  nodeFavorite?: boolean;
  fieldPermissionMap?: IFieldPermissionMap;
  isGhostNode?: boolean;
  isDeleted?: boolean;
}

export type NodePermission = INodePermissionBase & IPermissions;
export type UserNodePermissionMap = { [userId: string]: NodePermission };

export interface IUserBaseInfo {
  userId: string;
  uuid: string;
}

export interface IAuthHeader {
  cookie?: string;
  token?: string;
  internal?: boolean;
  userId?: string;
}

export interface IApiRequestDetail {
  ua: string;
  referer?: string;
}

export interface IApiResponseDetail {
  code: number;
  message: string;
  stack?: any;
}

/**
 * the structure of attachments that need to be submit to the backend server
 */
export interface IOpAttach {
  /**
   * attachment token
   */
  token: string;
  /**
   * attachment name
   */
  name: string;
}

/**
 * datasheet attachment cite request object
 */
export interface IOpAttachCiteRo {
  /**
   * Node ID
   */
  nodeId: string;
  /**
   * tokens would be the same while using the same attachment
   */
  addToken?: IOpAttach[];
  /**
   * tokens would be the same while using the same attachment
   */
  removeToken?: IOpAttach[];
}

/**
 * Create notification request object
 */
export interface INotificationCreateRo {
  /**
   * space ID
   */
  spaceId?: string;
  /**
   * user ID
   */
  toUserId?: string[];
  /**
   * Notification Body, extra fields are in body.extra
   */
  body?: any;
  /**
   * node ID
   */
  nodeId?: string;
  /**
   * template ID
   */
  templateId: string;
  /**
   * from user ID
   */
  fromUserId?: string;
}

export interface IApiUsage {
  isAllowOverLimit?: boolean;

  /**
   * @deprecated This property is deprecated. Use the `apiCallUsedNumsCurrentMonth` instead.
   */
  apiUsageUsedCount?: number;
  apiCallUsedNumsCurrentMonth?: number;

  /**
   * @deprecated This property is deprecated. Use the `apiCallNumsPerMonth` instead.
   */
  maxApiUsageCount?: number;
  apiCallNumsPerMonth?: number;
}
