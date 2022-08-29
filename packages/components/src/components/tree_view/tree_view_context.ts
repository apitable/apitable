import React from 'react';
import { ExpandAction } from './tree_view';

export enum Modules {
  FAVORITE = 'FAVORITE',
  CATALOG = 'CATALOG',
  SHARE = 'SHARE',
  TEAM_TREE = 'TEAM_TREE',
}
export interface ITreeViewContext {
  module: Modules;
  icons: {
    switcherIcon: React.ReactNode;
    switcherLoadingIcon: React.ReactNode;
  };
  indent: number;
  multiple: boolean;
  draggable: boolean;
  dragOverNodeId: string;
  highlightNodeId: string;
  loadingNodeId: string;
  dragNodeId: string;
  expandAction: ExpandAction;
  renderTreeItem: (child: React.ReactElement, index: number, level: string) => React.ReactNode;
  isExpanded: (id: string) => boolean;
  isSelected: (id: string) => boolean;
  isFocused: (id: string) => boolean;
  focus: (e: React.MouseEvent, nodeId: string) => void;
  toggleExpansion: (nodeId: string, isAuto?: boolean) => void;
  selectNode: (e: React.MouseEvent, nodeId: string, multiple?: boolean) => boolean;
  dragStart: (treeNode: any) => void;
  dragOver: (treeNode: any) => void;
  drop: (treeNode: any) => void;
  onRightClick?: (e: React.MouseEvent, data: any) => void;
}

const TreeViewContext = React.createContext({} as ITreeViewContext);

export default TreeViewContext;