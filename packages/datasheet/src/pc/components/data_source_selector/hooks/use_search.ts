import { usePrevious } from 'ahooks';
import throttle from 'lodash/throttle';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Api, ConfigConstant, INode } from '@apitable/core';
import { IViewNode } from 'pc/components/data_source_selector/folder_content';
import { useLoader } from 'pc/components/data_source_selector/hooks/use_loader';
import { ISearchPanelState } from '../store/interface/search_panel';

interface IParams {
  folderId: string;
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>;
  localState: ISearchPanelState;
}

export const useSearch = ({ localDispatch, folderId, localState }: IParams) => {
  const spaceId = useSelector((state) => state.space.activeId!);
  const previousCurrentFolderId = usePrevious(localState.currentFolderId);
  const { nodeTypeFilterLoader } = useLoader();

  const search = useMemo(() => {
    return throttle((spaceId: string, val: string) => {
      Api.searchNode(spaceId, val.trim()).then((res) => {
        const { data, success } = res.data;
        if (success) {
          const nodes = nodeTypeFilterLoader(data);
          const { folders, files } = nodes.reduce<{
            folders: (INode | IViewNode)[];
            files: (INode | IViewNode)[];
              }>(
              (collect, node) => {
                if (node.type === ConfigConstant.NodeType.FOLDER) {
                  collect.folders.push(node);
                } else {
                  collect.files.push(node);
                }
                return collect;
              },
              { folders: [], files: [] },
              );

          localDispatch({ showSearch: true, currentFolderId: folderId });
          if (!folders.length && !files.length) {
            localDispatch({ searchResult: val });
            return;
          }
          localDispatch({ searchResult: { folders, files } as any });
        }
      });
    }, 500);
  }, [folderId, localDispatch]);

  useEffect(() => {
    if (!localState.searchValue) {
      localDispatch({ showSearch: false });
      return;
    }

    if (previousCurrentFolderId === localState.currentFolderId || folderId === localState.currentFolderId) {
      search(spaceId, localState.searchValue);
    }

    // eslint-disable-next-line
  }, [search, spaceId, localState.searchValue, localState.currentFolderId, folderId]);

  return {
    search,
  };
};
