/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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