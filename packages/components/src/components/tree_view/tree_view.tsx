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

import React, { FC, useCallback, useState, useEffect, Fragment } from 'react';
import TreeViewContext, { Modules } from './tree_view_context';
import { TriangleRightFilled } from '@apitable/icons';
import { TreeItem } from './tree_item';
import { isEqual, isNull } from 'lodash';
import styled, { createGlobalStyle } from 'styled-components';
import { black } from 'colors';

export type ExpandAction = false | 'click';
export interface ITreeViewProps {
  module: Modules;
  className?: string;
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  switcherIcon?: React.ReactNode;
  switcherLoadingIcon?: React.ReactNode;
  indent?: number;
  multiple?: boolean;
  expandAction?: ExpandAction;
  draggable?: boolean;
  treeData?: any[];
  loadData?: (nodeId: string) => Promise<any>;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onSelect?: (e: React.MouseEvent, selectedKeys: string[] | string) => void;
  onFocus?: (e: React.MouseEvent, nodeId: string) => void;
  onExpand?: (nodeIds: string[]) => void;
  onRightClick?: (e: React.MouseEvent, nodeId: string) => void;
  onLoad?: () => void;
  onDragOver?: (info: any) => void;
  onDrop?: (info: any) => void;
}

const TreeViewRoot = styled.ul`
  &.treeViewRoot {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const TreeView: FC<React.PropsWithChildren<ITreeViewProps>> = React.memo(
  ({
    module,
    switcherIcon = <TriangleRightFilled size={12} color={black[300]} />,
    switcherLoadingIcon,
    expandedKeys = null,
    defaultExpandedKeys = null,
    selectedKeys = null,
    defaultSelectedKeys = null,
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
    children,
  }) => {
    /**
     * Expanded nodes collection
    */
    const [expandedIds, setExpandedIds] = useState<string[]>(expandedKeys || defaultExpandedKeys || []);
    /**
     * Selected node collection
    */
    const [selectedIds, setSelectedIds] = useState<string[]>(selectedKeys || defaultSelectedKeys || []);
    /**
     * Node currently focused
     */
    const [focusedNodeId, setFocusedNodeId] = useState('');
    /**
     * The node ID passed by when dragging a node
     */
    const [dragOverNodeId, setDragOverNodeId] = useState<string>('');
    /**
     * The dragged node
     */
    const [dragNodeId, setDragNodesId] = useState<string>('');
    /**
     * Nodes to highlight
    */
    const [highlightNodeId, setHighlightNodeId] = useState<string>('');
    /**
     * Currently loading data nodes
     */
    const [loadingNodeId, setLoadingNodeId] = useState<string>('');
    const [cacheExpandedIds, setCacheExpandedId] = useState<string[]>([]);

    useEffect(() => {
      if (isNull(expandedKeys)) { return; }
      if (isEqual(expandedKeys, expandedIds)) { return; }
      const filterNodeIds = expandedKeys.filter(expandedKey => !cacheExpandedIds.includes(expandedKey));
      for (const id of filterNodeIds) {
        toggleExpansion(id);
      }
      setExpandedIds(expandedKeys);
      setCacheExpandedId(expandedKeys);
      // eslint-disable-next-line
    }, [expandedKeys]);

    useEffect(() => {
      if (isNull(selectedKeys)) { return; }
      if (isEqual(selectedIds, selectedKeys)) { return; }
      setSelectedIds(selectedKeys);
    }, [selectedKeys, selectedIds]);

    const isExpanded = useCallback(
      (id: string) => (expandedIds?.length ? expandedIds.indexOf(id) !== -1 : false),
      [expandedIds],
    );

    const isSelected = useCallback(
      (id: string) => (selectedIds?.length ? selectedIds.indexOf(id) !== -1 : false),
      [selectedIds],
    );

    const isFocused = (id: string) => focusedNodeId === id;

    const focus = (e: React.MouseEvent, id: string) => {
      if (id) {
        setFocusedNodeId(id);
        onFocus && onFocus(e, id);
      }
    };

    const toggleExpansion = (nodeId: string = focusedNodeId, isAuto = true): Promise<any> | undefined => {
      let newExpandedIds: string[];
      /**
       * Determine whether the current operation is an expand operation or a close operation to generate a new set of expanded nodes
      */
      if (expandedIds.includes(nodeId)) {
        newExpandedIds = expandedIds.filter(id => id !== nodeId);
      } else {
        newExpandedIds = expandedIds.concat(nodeId);
      }
      /**
       * When manually clicking the expand button
       */
      if (!isAuto) {
        setExpandedIds(newExpandedIds);
        onExpand && onExpand(newExpandedIds);
      }

      /**
       * Asynchronous loading of node data
       */
      if (!expandedIds.includes(nodeId) && loadData) {
        setLoadingNodeId(nodeId);
        return loadData(nodeId).then(() => {
          setExpandedIds(newExpandedIds);
          onLoad && onLoad();
          setLoadingNodeId('');
        });
      }

      return undefined;
    };

    const renderTreeItem = (child: any, index: number, level = '0') => {
      const pos = `${level}-${index}`;
      const cloneProps = {
        pos,
      };

      return React.cloneElement(child, cloneProps);
    };

    const singleSelectHandler = (e: React.MouseEvent, nodeId: string) => {
      const newSelected = multiple ? [nodeId] : [nodeId];
      onSelect && onSelect(e, newSelected);
      setSelectedIds(newSelected);
    };

    const renderTree = (children: any, parentNode = null, level = '0') => {
      return children.map((node: any, index: number) => {
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
          pos={`${level}-${index}`}
          parentNode={parentNode}
        />;
      });
    };

    const selectNode = (e: React.MouseEvent, nodeId: string, multiple = false) => {
      if (nodeId) {
        if (multiple) {
          // TODO: Multiple selection operation
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

    const dragStart = (treeNode: any) => {
      setDragNodesId(treeNode.id);
    };

    const dragOver = (treeNode: any) => {
      onDragOver && onDragOver({ dragNodeId, targetNodeId: treeNode.id, ...treeNode });
    };

    const drop = (treeNode: any) => {
      onDrop && onDrop(treeNode);
      resetState();
    };

    const resetState = () => {
      setDragOverNodeId('');
      setDragNodesId('');
      setHighlightNodeId('');
    };

    const GlobalStyle: any = createGlobalStyle`
      * {
        box-sizing: border-box;
      }
    `;

    return (
      <Fragment>
        <GlobalStyle />
        <TreeViewContext.Provider
          value={{
            module,
            icons: { switcherIcon, switcherLoadingIcon },
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
            dragStart,
            dragOver,
            drop,
          }}
        >
          <TreeViewRoot
            role="tree"
            className='treeViewRoot'
            aria-labelledby="tree_label"
            onKeyDown={keyDownHandler}
            tabIndex={0}
          >
            {treeData ? renderTree(treeData) : React.Children.map(children, renderTreeItem)}
          </TreeViewRoot>
        </TreeViewContext.Provider>
      </Fragment>
    );
  },
);
