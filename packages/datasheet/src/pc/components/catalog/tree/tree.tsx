import {
  ConfigConstant, IReduxState, Navigation, NodeErrorType, Selectors, StoreActions,
  Strings, t,
} from '@vikadata/core';
import { useRequest } from 'pc/hooks';
import classnames from 'classnames';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { ITreeViewRef, TreeItem, TreeView } from 'pc/components/common/tree_view';
import { useNavigation, Method } from 'pc/components/route_manager/use_navigation';
import { useCatalogTreeRequest, useResponsive } from 'pc/hooks';
import { FC, useRef } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NodeItem } from './node_item';
import styles from './style.module.less';
import { isTouchDevice, shouldOpenInNewTab } from 'pc/utils';
import { Modal } from 'pc/components/common/modal/modal';
import { TComponent } from 'pc/components/common/t_component';

export const EMOJI_SIZE = 20;

export interface ITreeProps {
  rightClick: (e: React.MouseEvent, id?: ConfigConstant.ContextMenuType) => void;
}

const TreeBase: FC<ITreeProps> = ({
  rightClick,
}) => {
  const catalogTree = useSelector((state: IReduxState) => state.catalogTree);
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const activeNodeId = useSelector(state => Selectors.getNodeId(state));
  const timerRef = useRef<any>(null);
  const lastOverNodeIdRef = useRef<any>(null);
  const treeViewRef = useRef<ITreeViewRef>(null);
  const { editNodeId, delNodeId, expandedKeys, rootId } = catalogTree;
  const navigationTo = useNavigation();
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
  const leafNodes = new Set([ConfigConstant.NodeType.DATASHEET, ConfigConstant.NodeType.FORM, ConfigConstant.NodeType.DASHBOARD,
    ConfigConstant.NodeType.MIRROR]);

  const onContextMenu = (e) => {
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
        return <TreeItem
          key={nodeId}
          nodeId={nodeId}
          className={classNames}
          label={<NodeItem {...nodeItemProps} />}
          pos={currentLevel}
          data={nodeInfo}
          draggable={!operating}
          parentNode={parentNodeId}
        >
          {
            errType !== NodeErrorType.ChildNodes ? (
              hasChildren && children.length ? 
                renderTreeItem(children, nodeId, currentLevel) :
                <div className={styles.emptyNodes} onContextMenu={onContextMenu}>
                  {t(Strings.empty_nodes)}
                </div>
            ) : (
              <div 
                className={classnames(styles.emptyNodes, styles.errorTip)} 
                onContextMenu={onContextMenu} 
                onClick={() => {
                  treeViewRef.current?.setLoadingNodeId(nodeId);
                  loadData(nodeId).then((res) => {
                    treeViewRef.current?.setLoadingNodeId('');
                  });
                }}
              >
                {t(Strings.request_tree_node_error_tips)}
              </div>
            )
          }
        </TreeItem>;
      }
      return <TreeItem
        key={nodeId}
        nodeId={nodeId}
        label={<NodeItem {...nodeItemProps} />}
        parentNode={parentNodeId}
        className={classNames}
        data={nodeInfo}
        draggable={!operating}
        isLeaf={leafNodes.has(type)}
      />;
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
      // 不管点击文件或文件夹都关闭
      isMobile && dispatch(StoreActions.setSideBarVisible(false));

      navigationTo({
        path: Navigation.WORKBENCH,
        params: {
          nodeId: selectedKeys,
        },
        method: isOpenNewTab ? Method.NewTab : Method.Push,
      });
    }
  };

  const loadData = (nodeId: string) => {
    /**
     * 以下两种情况无需加载子节点：
     * 1. 没有子节点
     * 2. 当前节点是根节点
     */
    if (
      !treeNodesMap[nodeId]?.hasChildren || 
      rootId === nodeId
    ) {
      return new Promise(resolve => {
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
    // 只有文件夹可以展开，所以排除非文件夹的情况
    if (treeNodesMap[targetNodeId].type !== ConfigConstant.NodeType.FOLDER) {
      return;
    }
    if (!timerRef.current && dropPosition === 0) {
      timerRef.current = setTimeout(function() {
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
    if (dragNodeId === dropNodeId ||
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
     * 权限变更确认
     * 仅移动顺序或者节点未开启权限设置
     */
    if (treeNodesMap[dragNodeId].parentId === treeNodesMap[dropNodeId].parentId || !treeNodesMap[dragNodeId].nodePermitSet) {
      nodeMove(dragNodeId, dropNodeId, dropPosition);
      return;
    }
    const modal = Modal.confirm({
      type: 'warning',
      title: t(Strings.set_permission_include_oneself_tips_title),
      content: <TComponent
        tkey={t(Strings.move_node_modal_content)}
        params={{
          nodeSet: 
          <span
            className={styles.permissionSetBtn}
            onClick={() => {
              dispatch(StoreActions.updatePermissionModalNodeId(dragNodeId));
              modal.destroy();
            }}>
            {t(Strings.permission_setting)}
          </span>,
        }}
      />,
      onOk: () => {
        nodeMove(dragNodeId, dropNodeId, dropPosition);
      }
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
