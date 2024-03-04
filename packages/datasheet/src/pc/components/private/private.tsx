import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useRef } from 'react';
import * as React from 'react';
import { Skeleton } from '@apitable/components';
import {
  ConfigConstant,
  NodeErrorType,
  t,
  Strings,
  Selectors,
  IReduxState,
  StoreActions,
  Navigation
} from '@apitable/core';
import { NodeItem } from 'pc/components/catalog/tree/node_item';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { TComponent } from 'pc/components/common/t_component';
import { TreeView, TreeItem, ITreeViewRef } from 'pc/components/common/tree_view';
import { WorkbenchSideContext } from 'pc/components/common_side/workbench_side/workbench_side_context';
import { Router } from 'pc/components/route_manager/router';
import { useCatalogTreeRequest, useRequest, useResponsive } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { getContextTypeByNodeType, shouldOpenInNewTab } from 'pc/utils';
import { LEAF_NODES } from '../catalog/tree/constants';
import styles from './style.module.less';

export const Private = () => {
  const dispatch = useAppDispatch();
  const activeNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const { setRightClickInfo, onSetContextMenu } = useContext(WorkbenchSideContext);
  const { nodeMoveReq, getPrivateTreeDataReq } = useCatalogTreeRequest();
  const { run: nodeMove, loading: moveLoading } = useRequest(nodeMoveReq, { manual: true });
  const { run: getPrivateTreeData } = useRequest(getPrivateTreeDataReq, { manual: true });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const timerRef = useRef<any>(null);
  const lastOverNodeIdRef = useRef<any>(null);

  const {
    privateTreeNodesMap, privateRootId,
    editNodeId, delNodeId, expandedKeys
  } = useAppSelector((state: IReduxState) => {
    const {
      privateTreeNodesMap, privateRootId, privateLoading, rootId,
      privateEditNodeId, privateDelNodeId, privateExpandedKeys
    } = state.catalogTree;
    return {
      privateTreeNodesMap,
      privateRootId: privateRootId || rootId,
      privateLoading,
      editNodeId: privateEditNodeId,
      delNodeId: privateDelNodeId,
      expandedKeys: privateExpandedKeys,
    };
  });

  useEffect(() => {
    if (isEmpty(privateTreeNodesMap)) {
      getPrivateTreeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privateTreeNodesMap]);

  const treeViewRef = useRef<ITreeViewRef>(null);

  if (isEmpty(privateTreeNodesMap)) {
    return (
      <div style={{ margin: '0 8px', width: '100%' }}>
        <Skeleton width="38%" />
        <Skeleton />
        <Skeleton width="61%" />

        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%" />

        <Skeleton width="38%" />
        <Skeleton />
        <Skeleton width="61%" />
      </div>
    );
  }
  const expandHandler = (nodeIds: string[]) => {
    dispatch(StoreActions.setExpandedKeys(nodeIds, ConfigConstant.Modules.PRIVATE));
  };
  const dropHandler = (info: any) => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    lastOverNodeIdRef.current = null;
    const { dragNodeId, dropNodeId, dropPosition } = info;
    if (
      dragNodeId === dropNodeId ||
      (dropNodeId === privateTreeNodesMap[dragNodeId].preNodeId && dropPosition === 1) ||
      (dragNodeId === privateTreeNodesMap[dropNodeId].preNodeId && dropPosition === -1)
    ) {
      return;
    }
    const dropNodeType = privateTreeNodesMap[dropNodeId].type;
    if (!dropPosition && dropNodeType !== ConfigConstant.NodeType.FOLDER) {
      return;
    }
    /**
     * Confirmation of change of authority
     * Only move order or nodes with permission settings enabled
     */
    if ((dropPosition !== 0 && privateTreeNodesMap[dragNodeId].parentId === privateTreeNodesMap[dropNodeId].parentId)
      || privateTreeNodesMap[dragNodeId].nodePermitSet) {
      nodeMove(dragNodeId, dropNodeId, dropPosition, ConfigConstant.Modules.PRIVATE);
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
        nodeMove(dragNodeId, dropNodeId, dropPosition, ConfigConstant.Modules.PRIVATE);
      },
    });
  };
  const loadData = (nodeId: string) => {
    if (!privateTreeNodesMap[nodeId]?.hasChildren || privateRootId === nodeId) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }
    return dispatch(StoreActions.getChildNode(nodeId, ConfigConstant.Modules.PRIVATE));
  };
  const rightClickHandler = (e: React.MouseEvent<Element, MouseEvent>, data: any) => {
    e.preventDefault();
    e.stopPropagation();
    const menuType = getContextTypeByNodeType(data.type);
    setRightClickInfo({
      id: data.nodeId,
      module: ConfigConstant.Modules.PRIVATE,
      contextMenuType: menuType,
      level: data.pos,
    });
    onSetContextMenu(e as React.MouseEvent<HTMLElement>);
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

  const onContextMenu = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const renderTreeItem = (childrenNodeIds: string[], parentNodeId: string, level = '0') => {
    return childrenNodeIds.map((nodeId, index) => {
      const nodeInfo = privateTreeNodesMap[nodeId];
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
        from: ConfigConstant.Modules.PRIVATE,
        actived: nodeId === activeNodeId,
        level: currentLevel,
        hasChildren: hasChildren,
        expanded: expandedKeys.includes(nodeId),
        isPrivate: true,
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
                  // loadData(nodeId).then(() => {
                  //   treeViewRef.current?.setLoadingNodeId('');
                  // });
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

  return (
    <div className={styles.private}>
      <TreeView
        module={ConfigConstant.Modules.PRIVATE}
        className={styles.privateTree}
        expandedKeys={expandedKeys}
        onExpand={expandHandler}
        loadData={loadData}
        onRightClick={rightClickHandler}
        onSelect={selectNodeHandler}
        selectedKeys={activeNodeId ? [activeNodeId] : []}
        onDrop={dropHandler}
        draggable={!moveLoading}
        ref={treeViewRef}
      >
        {renderTreeItem(privateTreeNodesMap[privateRootId].children, privateRootId)}
      </TreeView>
    </div>
  );
};