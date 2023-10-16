import { getDatasheetMeta } from '../api';
import { Url } from '@apitable/core';
import { ISearchPanelState } from '../store/interface/search_panel';
import urlcat from 'urlcat';
import useSWR from 'swr';
import { useEffect } from 'react';
import { insertViewNode } from 'pc/components/data_source_selector/utils/insert_view_nodes';

const getApiKey = (datasheetId: string, needFetchDatasheetMeta: boolean) => {
  if (!needFetchDatasheetMeta || !datasheetId) return;
  return urlcat(Url.READ_DATASHEET_META, { dstId: datasheetId });
};

interface IParams {
  localState: ISearchPanelState;
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>;
  needFetchDatasheetMeta: boolean;
}

export const useFetchDatasheetMeta = ({ localState, needFetchDatasheetMeta, localDispatch }: IParams) => {
  const { data, mutate, isValidating } = useSWR(
    getApiKey(localState.currentDatasheetId, needFetchDatasheetMeta),
    () => getDatasheetMeta(localState.currentDatasheetId),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (!data || !needFetchDatasheetMeta) {
      return;
    }

    insertViewNode({
      currentMeta: data,
      nodes: localState.nodes,
      currentDatasheetId: localState.currentDatasheetId,
      localDispatch,
    });
  }, [data, localDispatch]);

  return { data, mutate, isValidating };
};
