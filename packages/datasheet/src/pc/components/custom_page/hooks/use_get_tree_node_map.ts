import { useMemo } from 'react';
import { DEFAULT_PERMISSION, IPermissions, ITemplateTree } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';

function transform(tree: ITemplateTree | undefined): any {
  const result: { [nodeId: string]: ITemplateTree & { permissions: IPermissions; role: 'templateVisitor' } } = {};

  if (typeof tree === 'undefined') return {};

  function traverse(node: ITemplateTree) {
    result[node.nodeId] = { ...node, permissions: DEFAULT_PERMISSION, role: 'templateVisitor' };
    node.children.forEach((child) => traverse(child));
  }

  traverse(tree);

  return result;
}

export const useGetTreeNodeMap = () => {
  const spaceTreeNodesMap = useAppSelector((state) => {
    return state.catalogTree.treeNodesMap;
  });

  const templateId = useAppSelector((state) => state.pageParams.templateId);

  const shareNodeTree = useAppSelector((state) => state.templateCentre.directory?.nodeTree);

  const treeNodesMap = useMemo(() => {
    if (!templateId) return spaceTreeNodesMap;

    return transform(shareNodeTree);
  }, [spaceTreeNodesMap, templateId, shareNodeTree]);

  return treeNodesMap;
};
