import { ICollaborator, IResourceRevision } from '@apitable/core';

export interface INodeCopyRo {
  /**
   * original node ID
   */
  nodeId: string;
  /**
   * copied node ID
   */
  copyNodeId: string;
  /**
   * reference field IDs that need to be transformed
   */
  fieldIds: string[];
  /**
   * user ID
   */
  userId: string;
  /**
   * uuid
   */
  uuid: string;
}

export interface INodeDeleteRo {
  /**
   * deleted Node ID
   */
  deleteNodeId: string[];
  /**
   * the deleted node's reference node's ID
   */
  linkNodeId: string[];

  /**
   * user ID
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
