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

import { ConfigConstant } from '../config';
import type { ITreeNode, ITreeNodesMap, INode, INodesMapItem } from 'exports/store/interfaces';

// Collect the ids of all nodes under the specified node (including itself)
export const collectProperty = (treeNodesMap: ITreeNodesMap, rootId: string) => {
  const node = treeNodesMap[rootId];
  if (!node) { return [rootId]; }
  const findId = (node: INodesMapItem) => {
    return node.children.reduce((prev, nodeId) => {
      prev.push(nodeId);
      if (treeNodesMap[nodeId]) {
        prev.push(...findId(treeNodesMap[nodeId]!));
      }
      return prev;
    }, [] as string[]);
  };
  return [node.nodeId, ...findId(node)];
};

/**
 * Find the specified node
 * @param tree directory tree
 * @param nodeId Node ID to look up
 */
export const findNode = (tree: ITreeNode[], nodeId: string): ITreeNode | null => {
  return tree.reduce<ITreeNode | null>((preValue, item) => {
    if (preValue) {
      return preValue;
    }
    if (item.nodeId === nodeId) {
      return item;
    }
    if (item.children) {
      return findNode(item.children, nodeId);
    }
    return null;
  }, null);
};

/**
 * Generate expansion paths based on nodes
 * @param tree directory tree
 * @param expandedKeys array of expanded nodes
 * @param nodeId node ID
 */
export function genarateExpandedKeys(treeNodesMap: ITreeNodesMap, expandedKeys: string[], nodeId: string) {
  const expanded: string[] = [];
  while (treeNodesMap[nodeId]!.parentId !== '0') {
    const parentId = treeNodesMap[nodeId]!.parentId;
    if (!expandedKeys.includes(parentId) && treeNodesMap[parentId]!.type !== ConfigConstant.NodeType.ROOT) {
      expanded.push(parentId);
    }
    nodeId = parentId;
  }
  return expanded.reverse();
}

/**
 * Flatten the tree (convert the tree structure into a one-dimensional array)
 * @param nodeTree tree of type INode
 */
export const flatNodeTree = (nodeTree: INode[]) => {
  return nodeTree.reduce((prev, item) => {
    prev.push(item);
    if (Array.isArray(item.children) && item.children.length > 0) {
      prev.push(...flatNodeTree(item.children));
    }
    return prev;
  }, [] as INode[]);
};

// Get the expansion path
export const getExpandNodeIds = (data: ITreeNodesMap, nodeId: string, end: any = null, favoriteTreeNodeIds: string[] = []) => {
  const expandNodeIds: string[] = [];
  // If the chain is found to be broken when searching up the chain recursively, give up this operation directly
  if (!data[nodeId]) { return []; }
  if (data[nodeId]!.type === ConfigConstant.NodeType.ROOT) {
    return expandNodeIds;
  }
  if (favoriteTreeNodeIds.includes(nodeId)) return expandNodeIds;
  const parentNodeId = data[nodeId]!.parentId;
  if (parentNodeId !== end) {
    expandNodeIds.push(parentNodeId, ...getExpandNodeIds(data, parentNodeId, end, favoriteTreeNodeIds));
  }
  return expandNodeIds;
};
