import { useAtom } from 'jotai';
import { useEffect } from 'react';
import useSWR from 'swr';
import { getNodeDescription } from 'api/node/api';
import { useAppSelector } from 'pc/store/react-redux';
import { CustomPageAtom } from '../store/custon_page_desc_atom';

export const useGetDesc = (fetch: boolean = true) => {
  const { embedPageId } = useAppSelector((state) => state.pageParams);
  const { data, mutate } = useSWR(embedPageId, () => getNodeDescription(embedPageId));
  const [, setEmbedPage] = useAtom(CustomPageAtom);

  useEffect(() => {
    if (!fetch) return;
    setEmbedPage((pre) => ({
      ...pre,
      desc: data,
    }));
  }, [data, setEmbedPage, fetch]);

  return {
    mutate: embedPageId ? mutate : () => {},
  };
};
