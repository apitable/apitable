import { FC, useContext, useEffect } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import { ConfigConstant, INodesMapItem, StoreActions, Strings, t } from '@apitable/core';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { useCatalogTreeRequest, useResponsive } from 'pc/hooks';
import { useRequest } from 'pc/hooks';
import { TComponent } from 'pc/components/common/t_component';
import { ScreenSize } from 'pc/components/common/component_display';
import { Popconfirm } from 'pc/components/common';
import { getContextTypeByNodeType } from 'pc/utils';
import { Modal } from 'pc/components/common/mobile/modal';
import { WorkbenchSideContext } from 'pc/components/common_side/workbench_side/workbench_side_context';
import { truncate } from 'lodash';
import { ItemRender } from './node_item_render';

export interface INodeItemProps {
  /* 节点信息 */
  node: INodesMapItem;
  /* 是否是已展开的节点 */
  expanded?: boolean;
  /* 是否是已激活的节点 */
  actived?: boolean;
  /* 是否是没有子节点的节点 */
  hasChildren?: boolean;
  /* 当前是否是编辑状态 */
  editing: boolean;
  /* 当前是否是删除状态 */
  deleting: boolean;
  /* 表示nodeItem来自哪个模块（星标或者工作目录） */
  from: ConfigConstant.Modules;
  /* 表示节点所在的层级 */
  level: string;
}

const NodeItemBase: FC<INodeItemProps> = ({ node, expanded = false, actived = false, hasChildren = false, editing, deleting, from, level }) => {
  const { deleteNodeReq } = useCatalogTreeRequest();
  const { run: deleteNode } = useRequest(deleteNodeReq, { manual: true });
  const dispatch = useDispatch();
  const { setRightClickInfo, onSetContextMenu } = useContext(WorkbenchSideContext);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const currentLevel = level.split('-').length - 1;
  const childCreatable = node.type === ConfigConstant.NodeType.FOLDER && node.permissions.childCreatable && currentLevel < 5;
  useEffect(() => {
    if (actived) {
      const activeElem = document.getElementById(`${ConfigConstant.Modules.CATALOG}${node.nodeId}`);
      activeElem && activeElem.scrollIntoView({ block: 'nearest' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actived]);

  const addNodeHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setRightClickInfo({ id: node.nodeId, module: from, contextMenuType: ConfigConstant.ContextMenuType.DEFAULT, level });
    if (isMobile) {
      return;
    }
    onSetContextMenu(e);
  };

  const moreOperationHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const { nodeId, type } = node;
    setRightClickInfo({ id: nodeId, module: from, contextMenuType: getContextTypeByNodeType(type), level });
    if (isMobile) {
      return;
    }
    onSetContextMenu(e);
  };

  const cancelDeleteModalHandler = () => {
    dispatch(StoreActions.setDelNodeId(''));
    dispatch(StoreActions.setDelNodeId('', ConfigConstant.Modules.FAVORITE));
  };

  const deleteNodeHandler = () => {
    const { nodeId, parentId } = node;
    deleteNode({ nodeId, parentId });
    cancelDeleteModalHandler();
  };

  const ConfirmContent = (
    <div className={styles.deleteTitle}>
      {
        <TComponent
          tkey={t(Strings.confirm_delete_node_name_as)}
          params={{
            nodeNameDiv: <div className={styles.deleteNodeName}>{truncate(node.nodeName, { length: 9 })}</div>,
          }}
        />
      }
    </div>
  );

  useEffect(() => {
    if (deleting && isMobile) {
      Modal.warning({
        title: t(Strings.delete),
        content: ConfirmContent,
        onOk: deleteNodeHandler,
        onCancel: cancelDeleteModalHandler,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleting]);

  return deleting && !isMobile ? (
    <Popconfirm
      visible={deleting}
      overlayClassName={styles.deleteNode}
      title={ConfirmContent}
      onCancel={cancelDeleteModalHandler}
      onOk={deleteNodeHandler}
      type="danger"
    >
      <ItemRender
        id={`${from}${node.nodeId}`}
        actived={actived}
        isMobile={isMobile}
        iconClassNames={classnames(styles.nodeIcon, !node.permissions.renamable && styles.disabled)}
        editing={editing}
        childCreatable={childCreatable}
        onClickMore={moreOperationHandler}
        onNodeAdd={addNodeHandler}
        expanded={expanded}
        hasChildren={hasChildren}
        node={node}
      />
    </Popconfirm>
  ) : (
    <ItemRender
      id={`${from}${node.nodeId}`}
      actived={actived}
      isMobile={isMobile}
      iconClassNames={classnames(styles.nodeIcon, !node.permissions.renamable && styles.disabled)}
      editing={editing}
      childCreatable={childCreatable}
      onClickMore={moreOperationHandler}
      onNodeAdd={addNodeHandler}
      expanded={expanded}
      hasChildren={hasChildren}
      node={node}
    />
  );
};

export const NodeItem = React.memo(NodeItemBase);
