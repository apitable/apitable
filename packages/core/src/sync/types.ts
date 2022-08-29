import { ILocalChangeset, IRemoteChangeset } from 'engine/ot';
import { IApiWrapper, IFieldPermission, IFieldRoleSetting, IWatchResult, Role } from 'store';
import { ModalType, OnOkType } from 'types';
/**
 * 主动发出的请求消息类型
 */
export enum SyncRequestTypes {
  /**
   * 建立长连接通道
   */
  WATCH_ROOM = 'WATCH_ROOM',

  /**
   * 离开协作房间
   */
  LEAVE_ROOM = 'LEAVE_ROOM',

  /**
   * Room 中的消息
   * 可以一次性发送多条 changeset
   */
  CLIENT_ROOM_CHANGE = 'CLIENT_ROOM_CHANGE',

  /**
   * NEST 服务的 ROOM 消息
   */
  NEST_ROOM_CHANGE = 'NEST_ROOM_CHANGE',
}

/**
 * 广播的消息类型
 */
export enum BroadcastTypes {

  /**
   * 房间内其他用户操作了 changeset
   * 因为相对于客户端来说，是服务端主动推给他的，所以以 Server 开头
   */

  SERVER_ROOM_CHANGE = 'SERVER_ROOM_CHANGE',

  /**
   * 有新激活协作人
   */
  ACTIVATE_COLLABORATOR = 'ACTIVATE_COLLABORATOR',

  /**
   * 有新激活协作（多）人
   */
  ACTIVATE_COLLABORATORS = 'ACTIVATE_COLLABORATORS',

  /**
   * 有协作人被取消激活
   */
  DEACTIVATE_COLLABORATOR = 'DEACTIVATE_COLLABORATOR',

  /**
   * 有用户更新了光标
   */
  ENGAGEMENT_CURSOR = 'ENGAGEMENT_CURSOR',

  /**
   * 节点分享被关闭
   */
  NODE_SHARE_DISABLED = 'NODE_SHARE_DISABLED',

  /**
   * 字段权限开启
   */
  FIELD_PERMISSION_ENABLE = 'FIELD_PERMISSION_ENABLE',

  /**
   * 字段权限变更
   */
  FIELD_PERMISSION_CHANGE = 'FIELD_PERMISSION_CHANGE',

  /**
   * 字段权限关闭
   */
  FIELD_PERMISSION_DISABLE = 'FIELD_PERMISSION_DISABLE',

  /**
   * 字段配置属性变更
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

// 前端请求数据类型
export type IBaseClientVarsExtraData = {
  baseRev?: number;
  /**
   * openType = 1时让后端区分请求，不在最近浏览文档中显示
   */
  openType?: number;
} | {
  baseRev?: number;
  /**
   * 有该字段，ClientVars 会带回指定的 tableId 的快照
   */
  tableId: string;
  /**
   * 有该字段和有分块数据的情况下，后端会先返回指定view的前xxx行数据
   */
  viewId?: string;
  /**
   * openType = 1时让后端区分请求，不在最近浏览文档中显示
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

// 广播数据类型
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
  // 服务异常
  SERVER_ERROR = 4000,
  // 消息重复
  MSG_ID_DUPLICATE = 4001,
  // 提交版本冲突
  CONFLICT = 4002,
  // 提交版本超限
  REVISION_OVER_LIMIT = 4003,
  // 提交版本错误
  REVISION_ERROR = 4004,
  // 更新列头失败
  APPLY_META_ERROR = 4005,
  // 结构丢失
  META_LOST_ERROR = 4006,
  // 版本号不匹配
  MATCH_VERSION_ERROR = 4007,
  // 空间容量超出限制
  SPACE_CAPACITY_OVER_LIMIT = 4008,
  // 单元格数据格式写入错误
  DATA_FORMAT_ERROR = 4009
}
