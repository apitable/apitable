import { INode, INodesMapItem } from '../interface';
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
