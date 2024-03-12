import { usePrevious } from 'ahooks';
import throttle from 'lodash/throttle';
import { useEffect, useMemo } from 'react';
import * as React from 'react';
import { Api, ConfigConstant, INode, Selectors } from '@apitable/core';
import { ISearchPanelState } from 'pc/components/datasheet_search_panel/store/interface/search_panel';
import { useAppSelector } from 'pc/store/react-redux';
import { ISearchShowOption } from '../datasheet_search_panel';

interface IParams {
  folderId: string;
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>;
  localState: ISearchPanelState;
  options ?: ISearchShowOption
}

export const useSearch = ({ localDispatch, folderId, localState, options }: IParams) => {
  const spaceId = useAppSelector((state) => state.space.activeId!);
  const previousCurrentFolderId = usePrevious(localState.currentFolderId);
  const activeNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const activeNodePrivate = useAppSelector((state) =>
    state.catalogTree.treeNodesMap[activeNodeId]?.nodePrivate || state.catalogTree.privateTreeNodesMap[activeNodeId]?.nodePrivate
  );

  const search = useMemo(() => {
    return throttle((spaceId: string, val: string) => {
      Api.searchNode(spaceId, val.trim(), activeNodePrivate ? 3 : 1).then((res) => {
        const { data, success } = res.data;
        if (success) {
          const folders = data.filter((node) => node.type === ConfigConstant.NodeType.FOLDER);
          const files: INode[] = [];
          if(
            options?.showDatasheet !== false
          ){
            const dstFiles= data.filter((node) =>
              node.type === ConfigConstant.NodeType.DATASHEET);
            files.push(...dstFiles);
          }
          if(
            options?.showForm
          ) {
            const formList= data.filter((node) =>
              node.type === ConfigConstant.NodeType.FORM);
            files.push(...formList);
          }
          localDispatch({ showSearch: true, currentFolderId: folderId });
          if (!folders.length && !files.length) {
            localDispatch({ searchResult: val });
            return;
          }
          localDispatch({ searchResult: { folders, files } });
        }
      });
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, localDispatch, activeNodePrivate]);

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
