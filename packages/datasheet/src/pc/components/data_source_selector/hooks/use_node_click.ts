import * as React from 'react';
import { ISearchPanelState } from '../store/interface/search_panel';
import { useFetchDatasheetMeta } from './use_fetch_datasheet_meta';

interface IParams {
  localState: ISearchPanelState;
  localDispatch: React.Dispatch<Partial<ISearchPanelState>>;
  needFetchDatasheetMeta: boolean;
}

export const useNodeClick = ({ localDispatch, localState, needFetchDatasheetMeta }: IParams) => {
  const { data: datasheetMetaData } = useFetchDatasheetMeta({ localState, localDispatch, needFetchDatasheetMeta });

  const onNodeClick = (nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder' | 'Form' | 'Automation', id: string) => {
    switch (nodeType) {
      case 'Automation': {
        if (localState.currentAutomationId !== id) {
          localDispatch({
            loading: true,
          });
          localDispatch({ currentAutomationId: id });
        }
        break;
      }
      case 'Form': {
        _onFormClick(id);
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

  const _onMirrorClick = (id: string) => {
    if (localState.currentMirrorId !== id) {
      localDispatch({
        loading: true,
      });
      localDispatch({ currentMirrorId: id });
    }
  };

  const _onFormClick = (id: string) => {
    if (localState.currentFormId !== id) {
      localDispatch({ currentFormId: id });
    }
  };

  const _onViewClick = (id: string) => {
    const hasView = datasheetMetaData?.views.some((view) => view.id === id);

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
      currentDatasheetId: '',
    });
  };

  const _onDatasheetClick = (id: string) => {
    if (localState.currentDatasheetId === id) {
      return;
    }

    localDispatch({
      currentDatasheetId: id,
      currentViewId: '',
    });
  };

  return {
    onNodeClick,
  };
};
