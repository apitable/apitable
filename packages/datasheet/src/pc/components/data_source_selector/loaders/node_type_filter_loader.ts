import { ConfigConstant } from '@apitable/core';

export const nodeTypeFilterLoader = (node, nodeTypes) => {
  const _nodeTypes = [ConfigConstant.NodeType.FOLDER, ...nodeTypes];
  return _nodeTypes.includes(node.type);
};
