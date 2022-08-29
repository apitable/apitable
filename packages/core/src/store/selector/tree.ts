import { INode, INodesMapItem } from '../interface';
/**
 * 扁平化树（将树结构转换成一维数组）
 * @param nodeTree INode类型的树
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
