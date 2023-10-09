import { INode, IParent } from '@apitable/core';
import { ICommonNode } from '../../folder_content';

export interface ISearchPanelMainState {
  showSearch: boolean;
  parents: IParent[];
  searchValue: string;
  onlyShowEditableNode: boolean;
  needPermission?: 'editable' | 'manageable'
  nodes: ICommonNode[];
  searchResult: { folders: INode[]; files: INode[] } | string;
  currentFolderId: string;
  currentFormId: string;
  currentMirrorId: string;
  folderLoaded: boolean;
}
