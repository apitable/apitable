import { ConfigConstant, IReduxState, Selectors, StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { useWorkbenchSideSync, useRootManageable } from 'pc/hooks';
import { useCatalog } from 'pc/hooks/use_catalog';
import { useContext, useEffect, useState } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.less';
import { Tree } from './tree';
import { getContextTypeByNodeType } from 'pc/utils';
import { Skeleton } from '@vikadata/components';
import { WorkbenchSideContext } from '../common_side/workbench_side/workbench_side_context';

export const CatalogBase: React.FC = () => {
  // Whether the node is loaded or not (expand the node)
  const [isLoaded, setIsLoaded] = useState(false);
  // Type of operation to perform, 0 means add folder node, 1 means add file node, 2 means import excel
  const [optType, setOptType] = useState<number | null>(null);
  const dispatch = useDispatch();
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const rootId = useSelector((state: IReduxState) => state.catalogTree.rootId);
  const { setRightClickInfo, onSetContextMenu } = useContext(WorkbenchSideContext);
  const activedNodeId = useSelector(state => Selectors.getNodeId(state));
  const { rootManageable } = useRootManageable();
  const { addTreeNode } = useCatalog();
  useWorkbenchSideSync();

  /* Shortcut keys for operations related to mounting/unmounting the directory tree */
  useEffect(() => {
    const eventBundle = new Map([
      [ShortcutActionName.NewDatasheet, () => { openCatalogPanel(() => createNode()); }],
      [ShortcutActionName.NewFolder, () => { openCatalogPanel(() => createNode(ConfigConstant.NodeType.FOLDER)); }],
      [ShortcutActionName.RenameNode, () => { openCatalogPanel(() => renameNode(activedNodeId)); }],
    ]);

    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key, cb);
    });

    return () => {
      eventBundle.forEach((_cb, key) => {
        ShortcutActionManager.unbind(key);
      });
    };
  });

  const createNode = (nodeType?: ConfigConstant.NodeType) => {
    let parentId;
    if (!activedNodeId) {
      addTreeNode(rootId, nodeType);
      return;
    }
    const activeNode = treeNodesMap[activedNodeId];
    if (activeNode.type === ConfigConstant.NodeType.FOLDER) { // activeNode is a folder node
      parentId = activedNodeId;
    } else if (activeNode.type === ConfigConstant.NodeType.DATASHEET) { // activeNode is a file node
      parentId = activeNode.parentId;
    }
    addTreeNode(parentId, nodeType);
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    setOptType(null);
    setIsLoaded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, optType]);

  const openCatalogPanel = cb => {
    const state = store.getState();
    const sideBarVisible = state.space.sideBarVisible;
    !sideBarVisible && dispatch(StoreActions.setSideBarVisible(true));
    cb();
  };

  // rename node
  const renameNode = (nodeId: string | undefined) => {
    if (!nodeId) {
      return;
    }
    dispatch(StoreActions.setEditNodeId(nodeId));
  };

  const rightClickHandler = (e: React.MouseEvent, data?: any) => {
    e.preventDefault();
    const nodeId = data?.nodeId || rootId;
    const nodeType = data?.type || treeNodesMap[rootId].type;
    setRightClickInfo({
      id: nodeId,
      module: ConfigConstant.Modules.CATALOG,
      contextMenuType: getContextTypeByNodeType(nodeType),
      level: data?.props?.pos || '0',
    });
    onSetContextMenu(e as React.MouseEvent<HTMLElement>);
  };

  if (!treeNodesMap[rootId]) {
    return (
      <div style={{ margin: '0 8px', width: '100%' }}>
        <Skeleton width="38%" />
        <Skeleton />
        <Skeleton width="61%"/>

        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%"/>

        <Skeleton width="38%" />
        <Skeleton />
        <Skeleton width="61%"/>
      </div>
    );
  }

  return (
    <div className={styles.catalogWrapper}>
      <div
        className={styles.treeWrapper}
        onContextMenu={(event) => {
          if (rootManageable) {
            rightClickHandler(event);
          }
        }}
      >
        <Tree
          rightClick={rightClickHandler}
        />
      </div>
    </div>
  );
};

export const Catalog = React.memo(CatalogBase);
