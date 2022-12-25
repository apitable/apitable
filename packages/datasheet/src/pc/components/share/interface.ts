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
