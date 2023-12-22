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

import { useAppSelector } from 'pc/store/react-redux';

export function useRootManageable(): {
  rootManageable: boolean;
  isRootNodeId: (nodeId: string) => boolean;
  } {
  const spacePermissions = useAppSelector((state) => state.spacePermissionManage.spaceResource?.permissions);
  const isSpaceAdmin = spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
  const spaceFeatures = useAppSelector((state) => state.space.spaceFeatures);
  const rootManageable = Boolean(isSpaceAdmin || spaceFeatures?.rootManageable);

  const rootId = useAppSelector((state) => state.catalogTree.rootId);
  const topLevelIds = useAppSelector((state) => state.catalogTree.treeNodesMap[rootId]?.children || []);

  const isRootNodeId = (nodeId: string) => topLevelIds.includes(nodeId);

  return {
    rootManageable,
    isRootNodeId,
  };
}
