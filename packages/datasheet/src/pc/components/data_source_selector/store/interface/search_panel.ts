import { INode, IParent } from '@apitable/core';
import { ICommonNode } from 'pc/components/datasheet_search_panel/folder_content';

export interface ISearchPanelState {
  loading: boolean;
  currentDatasheetId: string;
  currentViewId: string;
  currentFormId: string;
  currentAutomationId: string;
  showSearch: boolean;
  parents: IParent[];
  searchValue: string;
  onlyShowEditableNode: boolean;
  nodes: ICommonNode[];
  searchResult: { folders: INode[]; files: INode[] } | string;
  currentFolderId: string;
  currentMirrorId: string;
}
