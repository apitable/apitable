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

import { INodeMeta, IPermissions, Role } from '@apitable/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldPermissionMap } from './datasheet.model';

export class NodeInfo implements INodeMeta {
  id!: string;
  name!: string;
  description!: string;
  parentId!: string;
  icon!: string;
  nodeShared!: boolean;
  nodePermitSet!: boolean;
  revision!: number;
  spaceId!: string;
  role!: Role;
  permissions!: IPermissions;
  nodeFavorite!: boolean;
  extra?: any;
  isGhostNode?: boolean;
  nodePrivate!: boolean;
}

export class NodeBaseInfo {
  @ApiProperty()
    id!: string;
  @ApiProperty()
    nodeName!: string;
  @ApiProperty()
    icon!: string;
  @ApiPropertyOptional()
    revision?: number;
  @ApiProperty()
    parentId!: string;
}

export class NodeDetailInfo extends FieldPermissionMap {
  node!: NodeInfo;
}
