import { useEffect, useMemo } from 'react';
import throttle from 'lodash/throttle';
import { Api, ConfigConstant } from '@apitable/core';
import * as React from 'react';
import { ISearchPanelState } from 'pc/components/datasheet_search_panel/store/interface/search_panel';
import { useSelector } from 'react-redux';
import { usePrevious } from 'ahooks';

interface IParams {
  folderId: string;
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>
  localState: ISearchPanelState
}

export const useSearch = ({ localDispatch, folderId, localState }: IParams) => {
  const spaceId = useSelector(state => state.space.activeId!);
  const previousCurrentFolderId = usePrevious(localState.currentFolderId);

  const search = useMemo(() => {
    return throttle((spaceId: string, val: string) => {
      Api.searchNode(spaceId, val.trim()).then(res => {
        const { data, success } = res.data;
        if (success) {
          const folders = data.filter(node => node.type === ConfigConstant.NodeType.FOLDER);
          const files = data.filter(node => node.type === ConfigConstant.NodeType.DATASHEET);
          localDispatch({ showSearch: true, currentFolderId: folderId });
          if (!folders.length && !files.length) {
            localDispatch({ searchResult: val });
            return;
          }
          localDispatch({ searchResult: { folders, files }});
        }
      });
    }, 500);
  }, [folderId]);

  useEffect(() => {
    if (!localState.searchValue) {
      localDispatch({ showSearch: false });
      return;
    }
    (previousCurrentFolderId === localState.currentFolderId || folderId === localState.currentFolderId) && search(spaceId, localState.searchValue);
    // eslint-disable-next-line
  }, [search, spaceId, localState.searchValue, localState.currentFolderId, folderId]);

  return {
    search,
  };
};
