import React, { FC, useCallback, useState, useEffect, Fragment } from 'react';
import TreeViewContext, { Modules } from './tree_view_context';
import { TriangleRight16Filled, LoadingFilled } from '@vikadata/icons';
import { TreeItem } from './tree_item';
import { isEqual, isNull } from 'lodash';
import styled, { createGlobalStyle } from 'styled-components';
import { black, deepPurple } from 'colors';

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

export const TreeView: FC<ITreeViewProps> = React.memo(
  ({
    module,
    className,
    switcherIcon = <TriangleRight16Filled size={16} color={black[300]} />,
    switcherLoadingIcon = <LoadingFilled size={16} color={deepPurple[500]} />,
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
    /* 已展开节点的集合 */
    const [expandedIds, setExpandedIds] = useState<string[]>(expandedKeys || defaultExpandedKeys || []);
    /* 已选中的节点/节点集合 */
    const [selectedIds, setSelectedIds] = useState<string[]>(selectedKeys || defaultSelectedKeys || []);
    /* 当前聚焦的节点 */
    const [focusedNodeId, setFocusedNodeId] = useState('');
    /* 拖拽节点时，经过的节点ID */
    const [dragOverNodeId, setDragOverNodeId] = useState<string>('');
    /* 被拖拽的节点 */
    const [dragNodeId, setDragNodesId] = useState<string>('');
    /* 需要高亮的节点 */
    const [highlightNodeId, setHighlightNodeId] = useState<string>('');
    /* 当前正在加载数据节点 */
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      /** 判断当前的操作是展开操作还是关闭操作，从而生成新成的已展开节点的集合 */
      if (expandedIds.includes(nodeId)) {
        newExpandedIds = expandedIds.filter(id => id !== nodeId);
      } else {
        newExpandedIds = expandedIds.concat(nodeId);
      }
      /** 手动点击展开按钮时 */
      if (!isAuto) {
        setExpandedIds(newExpandedIds);
        onExpand && onExpand(newExpandedIds);
      }

      // 异步加载节点数据
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
          // TODO:多选操作
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

    const GlobalStyle = createGlobalStyle`
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
