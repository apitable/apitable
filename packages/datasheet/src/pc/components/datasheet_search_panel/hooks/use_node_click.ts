import { SecondConfirmType } from 'pc/components/datasheet_search_panel/datasheet_search_panel';
import { Api, StoreActions } from '@apitable/core';
import { useDispatch } from 'react-redux';
import { ISearchPanelState } from 'pc/components/datasheet_search_panel/store/interface/search_panel';
import * as React from 'react';

interface IParams {
  localState: ISearchPanelState
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>
  secondConfirmType?: SecondConfirmType

  searchDatasheetMetaData(datasheetId: string): void
}

export const useNodeClick = ({ localDispatch, localState, searchDatasheetMetaData, secondConfirmType }: IParams) => {
  const dispatch = useDispatch();

  const onNodeClick = (nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder', id: string) => {
    switch (nodeType) {
      case 'Datasheet': {
        _onDatasheetClick(id);
        break;
      }
      case 'Folder': {
        _onFolderClick(id);
        break;
      }
      case 'Mirror': {
        _onMirrorClick(id);
        break;
      }
      case 'View': {
        _onViewClick(id);
        break;
      }
    }
  };

  const fetchFolderData = (folderId: string) => {
    localDispatch({
      loading: true,
    });
    localDispatch({ folderLoaded: false });
    // 初始化时就会加载这部分数据
    Promise.all([Api.getParents(folderId), Api.getChildNodeList(folderId)])
      .then(list => {
        const [parentsRes, childNodeListRes] = list;
        if (parentsRes.data.success) {
          localDispatch({ parents: parentsRes.data.data });
        }

        if (childNodeListRes.data.success) {
          const nodes = childNodeListRes.data.data || [];
          localDispatch({ nodes, showSearch: false });
        }
      })
      .catch()
      .then(() => {
        localDispatch({
          loading: false,
        });
        localDispatch({ folderLoaded: true });
      });
  };

  const _onMirrorClick = (id: string) => {
    if (localState.currentMirrorId !== id) {
      localDispatch({
        loading: true,
      });
      localDispatch({ currentMirrorId: id });
      dispatch(StoreActions.fetchMirrorPack(id) as any);
    }
  };

  const _onViewClick = (id: string) => {
    const hasView = localState.currentMeta?.views.some(view => view.id === id);
    if (hasView) {
      localDispatch({
        currentViewId: id,
      });
    }
  };

  const _onFolderClick = (id: string) => {
    localDispatch({
      currentFolderId: id,
      currentViewId: '',
      currentMeta: null,
      currentDatasheetId: '',
    });
    fetchFolderData(id);
  };

  const _onDatasheetClick = (id: string) => {
    if (localState.currentDatasheetId === id) {
      return;
    }

    switch (secondConfirmType) {
      case SecondConfirmType.Widget:
        localDispatch({
          loading: true,
          currentDatasheetId: id,
        });
        return;
      case SecondConfirmType.Form:
        localDispatch({
          loading: true,
          currentMeta: null,
          currentViewId: '',
        });
        searchDatasheetMetaData(id);
        return;
      case SecondConfirmType.Chat:
        localDispatch({
          currentDatasheetId: id,
        });
        searchDatasheetMetaData(id);
        return;
    }
    localDispatch({
      loading: true,
      currentDatasheetId: id,
    });

    dispatch(StoreActions.fetchDatasheet(id) as any);
  };

  return {
    onNodeClick,
    fetchFolderData,
  };
};
