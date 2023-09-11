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

import * as React from 'react';
import { ConfigConstant } from '@apitable/core';
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
  onDoubleClick?: (e: React.MouseEvent, data: { key: string; level: string }) => void;
  dragStart: (treeNode: any) => void;
  dragOver: (treeNode: any) => void;
  drop: (treeNode: any) => void;
  onRightClick?: (e: React.MouseEvent, data: any) => void;
}

const TreeViewContext = React.createContext({} as ITreeViewContext);

export default TreeViewContext;
