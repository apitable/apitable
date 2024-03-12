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
import Image from 'next/image';
import * as React from 'react';
import { FC, useContext, useEffect, useMemo, useRef } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { Skeleton } from '@apitable/components';
import { ConfigConstant, IReduxState, Navigation, NodeErrorType, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { NodeItem } from 'pc/components/catalog/tree/node_item';
import { ScreenSize } from 'pc/components/common/component_display';
import { ITreeViewRef, TreeItem, TreeView } from 'pc/components/common/tree_view';
import { Router } from 'pc/components/route_manager/router';
import { useCatalogTreeRequest, useRequest, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getContextTypeByNodeType, shouldOpenInNewTab } from 'pc/utils';
import EmptyFavoritePng from 'static/icon/workbench/catalogue/favorite.png';
import { WorkbenchSideContext } from '../workbench_side_context';
import styles from './style.module.less';

const FavoriteBase: FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useDispatch();
  const spaceId = useAppSelector((state: IReduxState) => state.space.activeId);
  const activeNodeId = useAppSelector((state: IReduxState) => Selectors.getNodeId(state));
  const {
    favoriteTreeNodeIds: _favoriteTreeNodeIds,
    favoriteDelNodeId,
    favoriteEditNodeId,
    favoriteLoading,
    favoriteExpandedKeys,
    treeNodesMap,
    privateTreeNodesMap,
  } = useAppSelector(
    (state: IReduxState) => ({
      favoriteTreeNodeIds: state.catalogTree.favoriteTreeNodeIds,
      favoriteDelNodeId: state.catalogTree.favoriteDelNodeId,
      favoriteEditNodeId: state.catalogTree.favoriteEditNodeId,
      favoriteLoading: state.catalogTree.favoriteLoading,
      favoriteExpandedKeys: state.catalogTree.favoriteExpandedKeys,
      treeNodesMap: state.catalogTree.treeNodesMap,
      privateTreeNodesMap: state.catalogTree.privateTreeNodesMap,
    }),
    shallowEqual,
  );
  const { moveFavoriteNodeReq } = useCatalogTreeRequest();
  const { run: moveFavoriteNode } = useRequest(moveFavoriteNodeReq, { manual: true });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { setRightClickInfo, onSetContextMenu } = useContext(WorkbenchSideContext);
  const treeViewRef = useRef<ITreeViewRef>(null);

  const favoriteTreeNodeIds = useMemo(() => [...new Set(_favoriteTreeNodeIds)], [_favoriteTreeNodeIds]);

  const expandHandler = (nodeIds: string[]) => {
    dispatch(StoreActions.setExpandedKeys(nodeIds, ConfigConstant.Modules.FAVORITE));
  };

  const { getFavoriteNodeListReq } = useCatalogTreeRequest();
  const { run: getFavoriteNodeList } = useRequest(getFavoriteNodeListReq, { manual: true });

  useEffect(() => {
    if (spaceId) {
      getFavoriteNodeList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceId]);

  const onContextMenu = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const renderTreeItem = (children: string[], parentNode: any = null, level = '0') => {
    const leafNodes = new Set([
      ConfigConstant.NodeType.DATASHEET,
      ConfigConstant.NodeType.AUTOMATION,
      ConfigConstant.NodeType.FORM,
      ConfigConstant.NodeType.DASHBOARD,
      ConfigConstant.NodeType.MIRROR,
      ConfigConstant.NodeType.AI,
      ConfigConstant.NodeType.CUSTOM_PAGE,
    ]);
    return children.map((nodeId, index) => {
      const nodeInfo = treeNodesMap[nodeId] || privateTreeNodesMap[nodeId];
      if (nodeInfo == null) return null;
      const { type, children, hasChildren, errType } = nodeInfo;
      const pos = `${level}-${index}`;
      const deleteNodeInfo = favoriteDelNodeId.split(',');
      const editingNodeInfo = favoriteEditNodeId.split(',');
      const deleting = deleteNodeInfo[0] === pos && deleteNodeInfo[1] === nodeId;
      const editing = editingNodeInfo[0] === pos && editingNodeInfo[1] === nodeId;
      const operating = deleting || editing;
      const classNames = classnames({
        operationBg: operating,
      });

      const nodeItemProps = {
        editing,
        deleting,
        node: nodeInfo,
        from: ConfigConstant.Modules.FAVORITE,
        actived: nodeId === activeNodeId,
        level: pos,
        hasChildren: hasChildren,
        expanded: favoriteExpandedKeys.includes(nodeId),
      };
      if (type === ConfigConstant.NodeType.FOLDER) {
        return (
          <TreeItem
            key={nodeId}
            nodeId={nodeId}
            label={<NodeItem {...nodeItemProps} />}
            pos={pos}
            data={nodeInfo}
            className={classNames}
            draggable={!operating}
          >
            {errType !== NodeErrorType.ChildNodes ? (
              hasChildren && children.length ? (
                renderTreeItem(children, nodeId, pos)
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
          parentNode={parentNode}
          pos={pos}
          data={nodeInfo}
          className={classNames}
          draggable={!operating}
          isLeaf={leafNodes.has(type)}
        />
      );
    });
  };

  const loadData = (nodeId: string) => {
    const nodeInfo = treeNodesMap[nodeId] || privateTreeNodesMap[nodeId];
    if (!nodeInfo?.hasChildren) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    return dispatch(StoreActions.getChildNode(nodeId, nodeInfo.nodePrivate ? ConfigConstant.Modules.PRIVATE : undefined));
  };

  useEffect(() => {
    if (favoriteExpandedKeys.length) {
      favoriteExpandedKeys.forEach((nodeId) => {
        loadData(nodeId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteExpandedKeys]);

  const rightClickHandler = (e: React.MouseEvent<Element, MouseEvent>, data: any) => {
    e.preventDefault();
    e.stopPropagation();
    const menuType = getContextTypeByNodeType(data.type);
    setRightClickInfo({
      id: data.nodeId,
      module: ConfigConstant.Modules.FAVORITE,
      contextMenuType: menuType,
      level: data.pos,
    });
    onSetContextMenu(e as React.MouseEvent<HTMLElement>);
  };

  const selectNodeHandler = (e: React.MouseEvent, selectedKeys: string | string[]) => {
    if (favoriteEditNodeId) {
      return;
    }
    const isOpenNewTab = shouldOpenInNewTab(e);
    if (typeof selectedKeys === 'string' && (selectedKeys !== activeNodeId || isOpenNewTab)) {
      isMobile && dispatch(StoreActions.setSideBarVisible(false));
      const params = {
        spaceId,
        nodeId: selectedKeys,
      };
      isOpenNewTab ? Router.newTab(Navigation.WORKBENCH, { params }) : Router.push(Navigation.WORKBENCH, { params });
    }
  };

  const dropHandler = (info: any) => {
    const { dragNodeId, dropNodeId, dropPosition } = info;
    if (favoriteTreeNodeIds.findIndex((nodeId) => [dropNodeId, dragNodeId].includes(nodeId)) === -1 || !dropPosition || dragNodeId === dropNodeId) {
      return;
    }

    if (dropPosition === -1) {
      const index = favoriteTreeNodeIds.findIndex((id) => id === dropNodeId);
      const prevNodeId = favoriteTreeNodeIds[index - 1] || '';
      dispatch(StoreActions.moveFavoriteNode(dragNodeId, prevNodeId));
      moveFavoriteNode(dragNodeId, prevNodeId);
    } else {
      dispatch(StoreActions.moveFavoriteNode(dragNodeId, dropNodeId));
      moveFavoriteNode(dragNodeId, dropNodeId);
    }
  };

  if (favoriteLoading) {
    return (
      <div style={{ margin: '0 8px', width: '100%' }}>
        <Skeleton width="38%" />
        <Skeleton />
        <Skeleton width="61%" />
      </div>
    );
  }

  return (
    <div className={styles.favorite}>
      {favoriteTreeNodeIds.length ? (
        <TreeView
          module={ConfigConstant.Modules.FAVORITE}
          expandedKeys={favoriteExpandedKeys}
          onExpand={expandHandler}
          loadData={loadData}
          onRightClick={rightClickHandler}
          onSelect={selectNodeHandler}
          selectedKeys={activeNodeId ? [activeNodeId] : []}
          onDrop={dropHandler}
          draggable
        >
          {renderTreeItem(favoriteTreeNodeIds)}
        </TreeView>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyFavoritePng}>
            <Image src={EmptyFavoritePng} alt="empty favorite" width={60} height={44} />
          </span>
          <div className={styles.tip}>{t(Strings.favorite_empty_tip1)}</div>
          <div className={styles.tip}>{t(Strings.favorite_empty_tip2)}~</div>
        </div>
      )}
    </div>
  );
};

export const Favorite = React.memo(FavoriteBase);
