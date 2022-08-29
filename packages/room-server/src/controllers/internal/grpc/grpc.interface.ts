import { ICollaborator, IResourceRevision } from '@vikadata/core';

export interface INodeCopyRo {
  /**
   * 原始数表ID
   */
  nodeId: string;
  /**
   * 复制的数表ID
   */
  copyNodeId: string;
  /**
   * 需要转换的关联列ID
   */
  fieldIds: string[];
  /**
   * 用户ID
   */
  userId: string;
  /**
   * uuid
   */
  uuid: string;
}

export interface INodeDeleteRo {
  /**
   * 删除的节点ID
   */
  deleteNodeId: string[];
  /**
   * 删除节点关联节点ID
   */
  linkNodeId: string[];

  /**
   * 用户ID
   */
  userId: string;
  /**
   * uuid
   */
  uuid: string;
}

export interface IWatchRoomRo {
  roomId: string;
  clientId: string;
  cookie: string;
  socketIds: string[];
  shareId?: string;
}

export interface IWatchRoomVo {
  resourceRevisions: IResourceRevision[];
  collaborators: ICollaborator[];
  collaborator: ICollaborator;
}

export interface ILeaveRoomRo {
  clientId: string;
}
