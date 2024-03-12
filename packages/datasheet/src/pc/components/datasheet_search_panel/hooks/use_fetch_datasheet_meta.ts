import { useEffect } from 'react';
import useSWR from 'swr';
import urlcat from 'urlcat';
import { Url } from '@apitable/core';
import { getDatasheetMeta } from '../api';
import { ISearchPanelState } from '../store/interface/search_panel';

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
    if (!data) {
      return;
    }

    localDispatch({
      currentMeta: data,
      // loading: false,
      // currentDatasheetId: datasheetId,
    });
    if (data.views?.length) {
      localDispatch({
        currentViewId: data.views[0].id,
      });
    }
  }, [data, localDispatch]);

  return { data, mutate, isValidating };
};
