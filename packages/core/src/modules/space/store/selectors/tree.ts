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

import { INode, INodesMapItem } from '../../../../exports/store/interfaces';
/**
 * flat tree(transfer tree structure to one dimension array)
 * 
 * @param nodeTree tree type of INode 
 */
export const flatNodeTree = (nodeTree: INode[]) => {
  return nodeTree.reduce((prev, item) => {
    const nodeItem: INodesMapItem = { ...item, errType: null, children: item.children?.map(child => child.nodeId) || [] };
    prev.push(nodeItem);
    if (Array.isArray(item.children) && item.children.length > 0) {
      prev.push(...flatNodeTree(item.children));
    }
    return prev;
  }, [] as INodesMapItem[]);
};
