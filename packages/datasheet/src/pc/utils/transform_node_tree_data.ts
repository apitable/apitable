import { ConfigConstant, INode } from '@apitable/core';

export interface ISelectTreeNode {
  pId: string;
  id: string;
  value: string;
  title: string;
  isLeaf: boolean;
}

export const transformNodeTreeData = (data: INode[]) => {
  if (!Array.isArray(data)) {
    // Invalid data format, return empty array
    console.log('Invalid transform node tree data');
    return [];
  }
  return data.reduce((prev, node) => {
    if (
      (node.type !== ConfigConstant.NodeType.FOLDER &&
      node.type !== ConfigConstant.NodeType.ROOT) ||
      !node.permissions.childCreatable
    ) {
      // Skip nodes that are not folders、roots or cannot have children
      return prev;
    }
    const newNode = {
      id: node.nodeId,
      pId: node.parentId,
      value: node.nodeId,
      title: node.nodeName,
      isLeaf: !node.hasChildren,
    };
    let result: ISelectTreeNode[] = [];
    if (node.hasChildren && Array.isArray(node.children)) {
      result = transformNodeTreeData(node.children);
    }
    prev.push(newNode, ...result);
    return prev;
  }, [] as ISelectTreeNode[]);
};