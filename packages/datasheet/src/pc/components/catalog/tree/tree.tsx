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

import classnames from 'classnames';
import * as React from 'react';
import { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ConfigConstant, IReduxState, Navigation, NodeErrorType, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { ITreeViewRef, TreeItem, TreeView } from 'pc/components/common/tree_view';
import { Router } from 'pc/components/route_manager/router';
import { useCatalogTreeRequest, useRequest, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { isTouchDevice, shouldOpenInNewTab } from 'pc/utils';
import { LEAF_NODES } from './constants';
import { NodeItem } from './node_item';
import styles from './style.module.less';

export const EMOJI_SIZE = 20;

export interface ITreeProps {
  rightClick: (e: React.MouseEvent, id?: ConfigConstant.ContextMenuType) => void;
}

const TreeBase: FC<React.PropsWithChildren<ITreeProps>> = ({ rightClick }) => {
  const catalogTree = useAppSelector((state: IReduxState) => state.catalogTree);
  const treeNodesMap = useAppSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const activeNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const timerRef = useRef<any>(null);
  const lastOverNodeIdRef = useRef<any>(null);
  const treeViewRef = useRef<ITreeViewRef>(null);
  const { editNodeId, delNodeId, expandedKeys, rootId } = catalogTree;
  const dispatch = useDispatch();
  const { nodeMoveReq } = useCatalogTreeRequest();
  const { run: nodeMove, loading: moveLoading } = useRequest(nodeMoveReq, { manual: true });

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const rightClickHandler = (e: React.MouseEvent, data?: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (isTouchDevice()) {
      return;
    }
    rightClick(e, data);
  };
  
  const onContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const renderTreeItem = (childrenNodeIds: string[], parentNodeId: string, level = '0') => {
    return childrenNodeIds.map((nodeId, index) => {
      const nodeInfo = treeNodesMap[nodeId];
      if (nodeInfo == null) return null;
      const { type, children, hasChildren, errType } = nodeInfo;
      const operating = nodeId === editNodeId || nodeId === delNodeId;
      const classNames = classnames({
        operationBg: operating,
      });
      const currentLevel = `${level}-${index}`;
      const nodeItemProps = {
        editing: editNodeId === nodeId,
        deleting: delNodeId === nodeId,
        node: nodeInfo,
        from: ConfigConstant.Modules.CATALOG,
        actived: nodeId === activeNodeId,
        level: currentLevel,
        hasChildren: hasChildren,
        expanded: expandedKeys.includes(nodeId),
      };
      if (type === ConfigConstant.NodeType.FOLDER) {
        return (
          <TreeItem
            key={nodeId}
            nodeId={nodeId}
            className={classNames}
            label={<NodeItem {...nodeItemProps} />}
            pos={currentLevel}
            data={nodeInfo}
            draggable={!operating}
            parentNode={parentNodeId}
          >
            {errType !== NodeErrorType.ChildNodes ? (
              hasChildren && children.length ? (
                renderTreeItem(children, nodeId, currentLevel)
              ) : (
                <div className={styles.emptyNodes} onContextMenu={onContextMenu}>
                  {t(Strings.empty_nodes)}
                </div>
              )
            ) : (
              <div
                className={classnames(styles.emptyNodes, styles.errorTip)}
                onContextMenu={onContextMenu}
                onClick={() => {
                  treeViewRef.current?.setLoadingNodeId(nodeId);
                  loadData(nodeId).then(() => {
                    treeViewRef.current?.setLoadingNodeId('');
                  });
                }}
              >
                {t(Strings.request_tree_node_error_tips)}
              </div>
            )}
          </TreeItem>
        );
      }
      return (
        <TreeItem
          key={nodeId}
          nodeId={nodeId}
          label={<NodeItem {...nodeItemProps} />}
          parentNode={parentNodeId}
          className={classNames}
          data={nodeInfo}
          draggable={!operating}
          isLeaf={LEAF_NODES.has(type)}
        />
      );
    });
  };

  const expandHandler = (nodeIds: string[]) => {
    dispatch(StoreActions.setExpandedKeys(nodeIds));
  };

  const selectNodeHandler = (e: React.MouseEvent, selectedKeys: string | string[]) => {
    if (editNodeId) {
      return;
    }
    const isOpenNewTab = shouldOpenInNewTab(e);
    if (typeof selectedKeys === 'string' && (selectedKeys !== activeNodeId || isOpenNewTab)) {
      // Close regardless of clicking on a file or folder
      isMobile && dispatch(StoreActions.setSideBarVisible(false));

      if (isOpenNewTab) {
        Router.newTab(Navigation.WORKBENCH, {
          params: {
            nodeId: selectedKeys,
          },
        });
      } else {
        Router.push(Navigation.WORKBENCH, {
          params: {
            nodeId: selectedKeys,
          },
        });
      }
    }
  };

  const loadData = (nodeId: string) => {
    if (!treeNodesMap[nodeId]?.hasChildren || rootId === nodeId) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    return dispatch(StoreActions.getChildNode(nodeId));
  };

  const dragOverHandler = (info: any) => {
    const { targetNodeId, dropPosition } = info;
    if (lastOverNodeIdRef.current !== targetNodeId) {
      lastOverNodeIdRef.current = targetNodeId;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    if (treeNodesMap[targetNodeId].type !== ConfigConstant.NodeType.FOLDER) {
      return;
    }
    if (!timerRef.current && dropPosition === 0) {
      timerRef.current = setTimeout(function () {
        dispatch(StoreActions.setExpandedKeys([...expandedKeys, targetNodeId]));
      }, 1000);
    }
    if (timerRef.current && dropPosition !== 0) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const dropHandler = (info: any) => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    lastOverNodeIdRef.current = null;
    const { dragNodeId, dropNodeId, dropPosition } = info;
    if (
      dragNodeId === dropNodeId ||
      (dropNodeId === treeNodesMap[dragNodeId].preNodeId && dropPosition === 1) ||
      (dragNodeId === treeNodesMap[dropNodeId].preNodeId && dropPosition === -1)
    ) {
      return;
    }
    const dropNodeType = treeNodesMap[dropNodeId].type;
    if (!dropPosition && dropNodeType !== ConfigConstant.NodeType.FOLDER) {
      return;
    }
    /**
     * Confirmation of change of authority
     * Only move order or nodes with permission settings enabled
     */
    if ((dropPosition !== 0 && treeNodesMap[dragNodeId].parentId === treeNodesMap[dropNodeId].parentId) || treeNodesMap[dragNodeId].nodePermitSet) {
      nodeMove(dragNodeId, dropNodeId, dropPosition);
      return;
    }
    const modal = Modal.confirm({
      type: 'warning',
      title: t(Strings.set_permission_include_oneself_tips_title),
      content: (
        <TComponent
          tkey={t(Strings.move_node_modal_content)}
          params={{
            nodeSet: (
              <span
                className={styles.permissionSetBtn}
                onClick={() => {
                  dispatch(StoreActions.updatePermissionModalNodeId(dragNodeId));
                  modal.destroy();
                }}
              >
                {t(Strings.permission_setting)}
              </span>
            ),
          }}
        />
      ),
      onOk: () => {
        nodeMove(dragNodeId, dropNodeId, dropPosition);
      },
    });
  };

  if (!treeNodesMap[rootId]) {
    return <></>;
  }

  return (
    <TreeView
      module={ConfigConstant.Modules.CATALOG}
      className={styles.tree}
      expandedKeys={catalogTree.expandedKeys}
      selectedKeys={activeNodeId ? [activeNodeId] : []}
      onRightClick={rightClickHandler}
      onExpand={expandHandler}
      onSelect={selectNodeHandler}
      loadData={loadData}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
      draggable={!moveLoading}
      ref={treeViewRef}
    >
      {renderTreeItem(treeNodesMap[rootId].children, rootId)}
    </TreeView>
  );
};

export const Tree = React.memo(TreeBase);
