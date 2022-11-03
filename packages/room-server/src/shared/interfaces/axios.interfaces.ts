import { IPermissions, IFieldPermissionMap } from '@apitable/core';

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

export interface IUserBaseInfo {
  userId: string;
  uuid: string;
}

export interface IAuthHeader {
  cookie?: string;
  token?: string;
  internal?: boolean;
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
