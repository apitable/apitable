import { IPermissions, IFieldPermissionMap } from '@apitable/core';

/**
 * @deprecated 服务端响应结果
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
 * op中需要提交给java计算附件资源的结构
 */
export interface IOpAttach {
  /**
   * 附件token
   */
  token: string;
  /**
   * 附件名称
   */
  name: string;
}

/**
 * 数表附件计算提交ro
 */
export interface IOpAttachCiteRo {
  /**
   * 节点ID
   */
  nodeId: string;
  /**
   * 相同附件需重复传token
   */
  addToken?: IOpAttach[];
  /**
   * 相同附件需重复传token
   */
  removeToken?: IOpAttach[];
}

/**
 * 数表附件计算提交ro
 */
export interface INotificationCreateRo {
  /**
   * 空间ID
   */
  spaceId?: string;
  /**
   * 用户ID
   */
  toUserId?: string[];
  /**
   * 通知消息体,额外字段:body.extra
   */
  body?: any;
  /**
   * 节点ID
   */
  nodeId?: string;
  /**
   * 通知模版ID
   */
  templateId: string;
  /**
   * 发送通知的用户ID
   */
  fromUserId?: string;
}
