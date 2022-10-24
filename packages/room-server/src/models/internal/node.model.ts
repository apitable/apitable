import { INodeMeta, Role, IPermissions } from '@apitable/core';
import { FieldPermissionMap } from './datasheet.model';

export class NodeInfo implements INodeMeta {
  id: string;
  name: string;
  description: string;
  parentId: string;
  icon: string;
  nodeShared: boolean;
  nodePermitSet: boolean;
  revision: number;
  spaceId: string;
  role: Role;
  permissions: IPermissions;
  nodeFavorite: boolean;
  extra?: any;
  isGhostNode?: boolean;
}

export class NodeDetailInfo extends FieldPermissionMap {
  node: NodeInfo;
}