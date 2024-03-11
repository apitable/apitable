import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useAppSelector } from 'pc/store/react-redux';
import { CustomPageAtom } from '../store/custon_page_desc_atom';
import { useGetNodesMap } from './use_get_tree_node_map';

export const useGetInfo = () => {
  const { customPageId } = useAppSelector((state) => state.pageParams);
  const nodeMap = useGetNodesMap(customPageId!);
  const node = nodeMap[customPageId!];
  const [embedPage, setEmbedPage] = useAtom(CustomPageAtom);

  const _url = node?.extra ? JSON.parse(node?.extra).embedPage.url : '';

  useEffect(() => {
    setEmbedPage((pre) => ({
      ...pre,
      permission: node?.permissions || {},
      url: _url,
    }));
  }, [setEmbedPage, node?.permissions, _url]);

  return {
    url: embedPage?.url || _url || '',
    ...node,
  };
};
