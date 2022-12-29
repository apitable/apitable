import { ConfigConstant } from '@apitable/core';
import * as React from 'react';
import { ExpandAction } from './tree_view';

export interface ITreeViewContext {
  module: ConfigConstant.Modules;
  icons: {
    switcherIcon: React.ReactNode;
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
  toggleExpansion: (nodeId: string) => void;
  selectNode: (e: React.MouseEvent, nodeId: string, multiple?: boolean) => boolean;
  onDoubleClick?: (e: React.MouseEvent, data: { key: string, level: string }) => void;
  dragStart: (treeNode: any) => void;
  dragOver: (treeNode: any) => void;
  drop: (treeNode: any) => void;
  onRightClick?: (e: React.MouseEvent, data: any) => void;
}

const TreeViewContext = React.createContext({} as ITreeViewContext);

export default TreeViewContext;