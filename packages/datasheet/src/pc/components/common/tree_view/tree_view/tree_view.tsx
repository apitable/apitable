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

import { ConfigConstant } from '@apitable/core';
import { isEqual, xor } from 'lodash';
import * as React from 'react';
import { forwardRef, memo, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import DefaultSwitcherIcon from 'static/icon/datasheet/rightclick/rightclick_icon_retract.svg';
import { TreeItem } from '../tree_item';
import TreeViewContext from '../tree_view_context';

export type ExpandAction = false | 'click';

export interface ITreeViewProps {
  module: ConfigConstant.Modules;
  className?: string;
  expandedKeys?: string[];
  selectedKeys?: string[];
  switcherIcon?: React.ReactNode;
  indent?: number;
  multiple?: boolean;
  expandAction?: ExpandAction;
  draggable?: boolean;
  treeData?: any[];
  loadData?: (nodeId: string) => Promise<any>;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onSelect?: (e: React.MouseEvent, selectedKeys: string[] | string) => void;
  onDoubleClick?: (e: React.MouseEvent, data: { key: string, level: string }) => void;
  onFocus?: (e: React.MouseEvent, nodeId: string) => void;
  onExpand?: (nodeIds: string[]) => void;
  onRightClick?: (e: React.MouseEvent, nodeId: string) => void;
  onLoad?: () => void;
  onDragOver?: (info: any) => void;
  onDrop?: (info: any) => void;
  children: ReactNode;
}

export interface ITreeViewRef {
  setLoadingNodeId(nodeId: string): void;
}

export const TreeViewBase: React.ForwardRefRenderFunction<ITreeViewRef, ITreeViewProps> = ({
  module,
  className,
  switcherIcon = <DefaultSwitcherIcon />,
  expandedKeys = [],
  selectedKeys = [],
  treeData,
  indent = 24,
  expandAction = false,
  multiple = false,
  draggable = false,
  loadData,
  onKeyDown,
  onSelect,
  onFocus,
  onExpand,
  onRightClick,
  onLoad,
  onDragOver,
  onDrop,
  onDoubleClick,
  children,
}, ref) => {
  const expandedIdsRef = useRef<string[]>(expandedKeys || []);
  const selectedIdsRef = useRef<string[]>(selectedKeys || []);
  const [focusedNodeId, setFocusedNodeId] = useState('');
  const [dragOverNodeId, setDragOverNodeId] = useState<string>('');
  const [dragNodeId, setDragNodesId] = useState<string>('');
  const [highlightNodeId, setHighlightNodeId] = useState<string>('');
  const [loadingNodeId, setLoadingNodeId] = useState<string>('');

  useImperativeHandle(ref, () => ({
    setLoadingNodeId: (nodeId: string) => setLoadingNodeId(nodeId)
  }));

  useEffect(() => {
    const difference = xor(expandedKeys, expandedIdsRef.current);
    difference.forEach(nodeId => toggleExpansion(nodeId, true));
    // eslint-disable-next-line
  }, [expandedKeys]);

  useEffect(() => {
    if (isEqual(selectedIdsRef.current, selectedKeys)) {
      return;
    }
    selectedIdsRef.current = selectedKeys;
  }, [selectedKeys]);

  const isExpanded = useCallback(
    (id: string) => expandedIdsRef.current.indexOf(id) !== -1,
    []
  );

  const isSelected = useCallback(
    (id: string) => selectedIdsRef.current.indexOf(id) !== -1,
    []
  );

  const isFocused = (id: string) => focusedNodeId === id;

  const focus = (e: React.MouseEvent, id: string) => {
    if (id) {
      setFocusedNodeId(id);
      onFocus && onFocus(e, id);
    }
  };

  /**
   * Expand/Collapse Nodes
   * @param nodeId 
   * @param passive Is it a passive operation
   */
  const toggleExpansion = (nodeId: string = focusedNodeId, passive = false): Promise<any> | undefined => {
    // Putting away operations
    if (expandedIdsRef.current.includes(nodeId)) {
      const newExpandedIds = expandedIdsRef.current.filter(id => id !== nodeId);
      expandedIdsRef.current = newExpandedIds;
      if (!passive) {
        onExpand?.(newExpandedIds);
      }
      return;
    }

    // Expand operation
    const newExpandedIds = expandedIdsRef.current.concat(nodeId);
    setLoadingNodeId(nodeId);
    expandedIdsRef.current = newExpandedIds;
    return loadData?.(nodeId).then((res) => {
      if (!passive) {
        onExpand?.(newExpandedIds);
      }
      if (res) onLoad?.();
      setLoadingNodeId('');
    });
  };

  const renderTreeItem = (child, index: number, level = '0') => {
    const pos = `${level}-${index}`;
    const cloneProps = {
      pos,
    };

    return React.cloneElement(child, cloneProps);
  };

  const singleSelectHandler = (e, nodeId: string) => {
    const newSelected = [nodeId];
    onSelect && onSelect(e, nodeId);
    selectedIdsRef.current = newSelected;
  };

  const renderTree = (children, parentNode = null, level = '0') => {
    return children.map((node, index) => {
      if (node.children && node.children.length) {
        return <TreeItem
          key={node.nodeId}
          nodeId={node.nodeId}
          label={node.label}
          pos={`${level}-${index}`}
          parentNode={parentNode}
        >
          {renderTree(node.children, node, level)}
        </TreeItem>;
      }
      return <TreeItem
        key={node.nodeId}
        nodeId={node.nodeId}
        label={node.label}
        parentNode={parentNode}
      />;
    });
  };

  const selectNode = (e: React.MouseEvent, nodeId: string, multiple = false) => {
    if (nodeId) {
      if (multiple) {
        // TODO: Multi-select operation
      } else {
        singleSelectHandler(e, nodeId);
      }
      return true;
    }
    return false;
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    onKeyDown && onKeyDown(e);
  };

  const dragStart = treeNode => {
    setDragNodesId(treeNode.id);
  };

  const dragOver = treeNode => {
    onDragOver && onDragOver({ dragNodeId, targetNodeId: treeNode.id, ...treeNode });
  };

  const drop = treeNode => {
    onDrop && onDrop(treeNode);
    resetState();
  };

  const resetState = () => {
    setDragOverNodeId('');
    setDragNodesId('');
    setHighlightNodeId('');
  };

  return (

    <TreeViewContext.Provider
      value={{
        module,
        icons: { switcherIcon },
        indent,
        multiple,
        draggable,
        dragOverNodeId,
        highlightNodeId,
        dragNodeId,
        loadingNodeId,
        expandAction: expandAction as ExpandAction,
        isExpanded,
        isSelected,
        isFocused,
        focus,
        toggleExpansion,
        renderTreeItem,
        selectNode,
        onRightClick,
        onDoubleClick,
        dragStart,
        dragOver,
        drop,
      }}
    >
      <ul
        role="tree"
        aria-labelledby="tree_label"
        className={`${className} treeViewRoot`}
        onKeyDown={keyDownHandler}
        tabIndex={0}
      >
        {treeData ? renderTree(treeData) : React.Children.map(children, renderTreeItem)}
      </ul>
    </TreeViewContext.Provider>

  );
};

export const TreeView = memo(forwardRef<ITreeViewRef, ITreeViewProps>(TreeViewBase));
