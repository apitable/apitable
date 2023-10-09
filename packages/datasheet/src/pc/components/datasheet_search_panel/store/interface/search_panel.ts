import { IMeta, INode, IParent } from '@apitable/core';
import { ICommonNode } from 'pc/components/datasheet_search_panel/folder_content';

export interface ISearchPanelState {
  currentMeta: IMeta | null;
  loading: boolean;
  currentDatasheetId: string;
  currentViewId: string;
  showSearch: boolean;
  currentFormId?: string;
  parents: IParent[];
  searchValue: string;
  onlyShowEditableNode: boolean;
  nodes: ICommonNode[];
  searchResult: { folders: INode[]; files: INode[] } | string;
  currentFolderId: string;
  currentMirrorId: string;
  folderLoaded: boolean;
}
