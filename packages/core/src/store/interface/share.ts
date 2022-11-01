import * as actions from '../action_constants';
import { NodeType } from 'config/constant';

export interface IShareNodeTree {
  nodeId: string;
  nodeName: string;
  icon: string;
  type: number;
  children: any[];
}

export interface IShareInfo {
  allowApply?: boolean;
  allowEdit?: boolean;
  allowSaved?: boolean;
  hasLogin?: boolean;
  isDeleted?: boolean;
  isFolder?: boolean;
  lastModifiedAvatar?: string;
  lastModifiedBy?: string;
  nodeTree?: any[]
  shareId?: string;
  shareNodeIcon?: string;
  shareNodeId?: string;
  shareNodeName?: string;
  shareNodeType?: NodeType;
  spaceId?: string | null;
  spaceName?: string;
  allowCopyDataToExternal?: string;
  allowDownloadAttachment?: string;
  featureViewManualSave?: boolean
}

export interface IShareInfoAction {
  type: typeof actions.SET_SHARE_INFO;
  payload: IShareInfo;
}
