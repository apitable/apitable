import { INodeMeta, IPermissions, Role } from '@apitable/core';
import { ApiProperty } from '@nestjs/swagger';
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

export class NodeBaseInfo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nodeName: string;
  @ApiProperty()
  icon: string;
}

export class NodeDetailInfo extends FieldPermissionMap {
  node: NodeInfo;
}
