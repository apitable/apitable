import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useAppSelector } from 'pc/store/react-redux';
import { embedPageAtom } from '../store/embed_page_desc_atom';

export const useGetInfo = () => {
  const { embedPageId } = useAppSelector((state) => state.pageParams);
  const treeNodesMap = useAppSelector((state) => state.catalogTree.treeNodesMap);
  const node = treeNodesMap[embedPageId!];
  const [embedPage, setEmbedPage] = useAtom(embedPageAtom);

  useEffect(() => {
    if (!node?.permissions) return;
    setEmbedPage((pre) => ({
      ...pre,
      permission: node.permissions,
      url: node?.extra ? JSON.parse(node?.extra).embedPage.url : '',
    }));
  }, [setEmbedPage, node?.permissions, node?.extra]);

  return {
    url: embedPage?.url || '',
    ...node,
  };
};
