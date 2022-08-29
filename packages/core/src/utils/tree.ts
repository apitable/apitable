import { ConfigConstant } from '../config';
import { ITreeNode, ITreeNodesMap, INode, INodesMapItem } from 'store/interface';

// 收集指定节点下的所有节点的id(包含自身)
export const collectProperty = (treeNodesMap: ITreeNodesMap, rootId: string) => {
  const node = treeNodesMap[rootId];
  if (!node) { return [rootId]; }
  const findId = (node: INodesMapItem) => {
    return node.children.reduce((prev, nodeId) => {
      prev.push(nodeId);
      if (treeNodesMap[nodeId]) {
        prev.push(...findId(treeNodesMap[nodeId]));
      }
      return prev;
    }, [] as string[]);
  };
  return [node.nodeId, ...findId(node)];
};

/**
 * 查找指定的节点
 * @param tree 目录树
 * @param nodeId 要查找的节点ID
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
 * 根据节点生成展开路径
 * @param tree 目录树
 * @param expandedKeys 已展开结点的数组
 * @param nodeId 节点ID
 */
export function genarateExpandedKeys(treeNodesMap: ITreeNodesMap, expandedKeys: string[], nodeId: string) {
  const expanded: string[] = [];
  while (treeNodesMap[nodeId].parentId !== '0') {
    const parentId = treeNodesMap[nodeId].parentId;
    if (!expandedKeys.includes(parentId) && treeNodesMap[parentId].type !== ConfigConstant.NodeType.ROOT) {
      expanded.push(parentId);
    }
    nodeId = parentId;
  }
  return expanded.reverse();
}

/**
 * 扁平化树（将树结构转换成一维数组）
 * @param nodeTree INode类型的树
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

// 获取展开路径
export const getExpandNodeIds = (data: ITreeNodesMap, nodeId: string, end: any = null, favoriteTreeNodeIds: string[] = []) => {
  const expandNodeIds: string[] = [];
  // 如果在递归向上查找链条时，发现链条是断开的，直接放弃本次操作
  if (!data[nodeId]) { return []; }
  if (data[nodeId].type === ConfigConstant.NodeType.ROOT) {
    return expandNodeIds;
  }
  if (favoriteTreeNodeIds.includes(nodeId)) return expandNodeIds;
  const parentNodeId = data[nodeId].parentId;
  if (parentNodeId !== end) {
    expandNodeIds.push(parentNodeId, ...getExpandNodeIds(data, parentNodeId, end, favoriteTreeNodeIds));
  }
  return expandNodeIds;
};
