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

export const useGetNodesMap = (customPageId: string) => {

  const spaceNodesMap = useAppSelector((state) => {
    const nodeItem = state.catalogTree.treeNodesMap[customPageId] || state.catalogTree.privateTreeNodesMap[customPageId];
    return {
      [customPageId]: nodeItem
    };
  });

  const templateId = useAppSelector((state) => state.pageParams.templateId);

  const shareNodeTree = useAppSelector((state) => state.templateCentre.directory?.nodeTree);

  return useMemo(() => {
    if (!templateId) return spaceNodesMap;

    return transform(shareNodeTree);
  }, [spaceNodesMap, templateId, shareNodeTree]);
};
