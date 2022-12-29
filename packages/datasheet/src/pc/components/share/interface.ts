import { ConfigConstant } from '@apitable/core';

export interface IShareSpaceInfo {
  shareId: string;
  spaceName: string;
  spaceId: string;
  allowSaved: boolean;
  allowApply: boolean;
  allowEdit: boolean;
  lastModifiedAvatar: string;
  lastModifiedBy: string;
  hasLogin: boolean;
  isDeleted?: boolean;
  isFolder: boolean;
}

export interface INodeTree {
  nodeId: string;
  nodeName: string;
  children: INodeTree[];
  type: ConfigConstant.NodeType;
  icon: string;
  shareType?: ConfigConstant.NodeType;
}
