import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Api, ConfigConstant, StoreActions, Selectors } from '@apitable/core';
import { ISearchPanelState } from 'pc/components/datasheet_search_panel/store/interface/search_panel';
import { useAppSelector } from 'pc/store/react-redux';
import { ISearchOptions, SecondConfirmType } from '../interface';

interface IParams {
  localState: ISearchPanelState;
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>;
  secondConfirmType?: SecondConfirmType;
  searchDatasheetMetaData(datasheetId: string): void;
}

export const useNodeClick = ({ localDispatch, localState, searchDatasheetMetaData, secondConfirmType }: IParams) => {
  const dispatch = useDispatch();
  const activeNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const activeNodePrivate = useAppSelector((state) =>
    state.catalogTree.treeNodesMap[activeNodeId]?.nodePrivate || state.catalogTree.privateTreeNodesMap[activeNodeId]?.nodePrivate
  );

  const onNodeClick = (nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder' | 'Form', id: string) => {
    switch (nodeType) {
      case 'Form': {
        if (localState.currentFormId === id) {
          return;
        }
        if (localState.currentDatasheetId === id) {
          return;
        }
        localDispatch({
          loading: true,
          currentFormId: id,
        });
        break;
      }
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

  const fetchFolderData = (folderId: string, options?: ISearchOptions) => {
    localDispatch({
      loading: true,
    });
    localDispatch({ folderLoaded: false });
    // 初始化时就会加载这部分数据
    Promise.all([Api.getParents(folderId), Api.getChildNodeList(folderId, undefined, activeNodePrivate ? 3 : undefined)])
      .then((list) => {
        const [parentsRes, childNodeListRes] = list;
        if (parentsRes.data.success) {
          localDispatch({ parents: parentsRes.data.data });
        }

        if (childNodeListRes.data.success) {
          const nodes = childNodeListRes.data.data || [];
          if (options) {
            const filteredNodes = nodes.filter((item) => {
              if (item.type === ConfigConstant.NodeType.DATASHEET) {
                return options.showDatasheet;
              }
              if (item.type === ConfigConstant.NodeType.FORM) {
                return options.showForm;
              }
              if (item.type === ConfigConstant.NodeType.MIRROR) {
                return options.showMirror;
              }
              if (item.type === ConfigConstant.NodeType.VIEW) {
                return options.showView;
              }
              if (item.type === ConfigConstant.NodeType.FOLDER) {
                return true;
              }
              return false;
            });
            localDispatch({ nodes: filteredNodes, showSearch: false });
          }
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
    const hasView = localState.currentMeta?.views.some((view) => view.id === id);
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
      case SecondConfirmType.AIForm:
        localDispatch({
          currentDatasheetId: id,
        });
        return;
      case SecondConfirmType.Form:
        localDispatch({
          loading: true,
          currentMeta: null,
          currentFormId: id,
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
