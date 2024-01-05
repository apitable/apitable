import { getNodeDescription } from 'api/node/api';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useAppSelector } from 'pc/store/react-redux';
import { embedPageAtom } from '../store/embed_page_desc_atom';

export const useGetDesc = () => {
  const { embedPageId } = useAppSelector((state) => state.pageParams);
  const { data } = useSWR(embedPageId, () => getNodeDescription(embedPageId));
  const [, setEmbedPage] = useAtom(embedPageAtom);

  useEffect(() => {
    if (!data || typeof data !== 'string') return;
    setEmbedPage((pre) => ({
      ...pre,
      desc: data,
    }));
  }, [data, setEmbedPage]);
};
