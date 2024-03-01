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
import { FC, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ConfigConstant, INodesMapItem, StoreActions, Strings, t } from '@apitable/core';
import { Popconfirm } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/mobile/modal';
import { TComponent } from 'pc/components/common/t_component';
import { WorkbenchSideContext } from 'pc/components/common_side/workbench_side/workbench_side_context';
import { useRequest, useCatalogTreeRequest, useResponsive } from 'pc/hooks';
import { getContextTypeByNodeType } from 'pc/utils';
import { ItemRender } from './node_item_render';
import styles from './style.module.less';

export interface INodeItemProps {
  node: INodesMapItem;
  expanded?: boolean;
  actived?: boolean;
  hasChildren?: boolean;
  editing: boolean;
  deleting: boolean;
  from: ConfigConstant.Modules;
  level: string;
  isPrivate?: boolean;
}

let mobileModalClose: () => void;

const NodeItemBase: FC<React.PropsWithChildren<INodeItemProps>> = ({
  node,
  expanded = false,
  actived = false,
  hasChildren = false,
  editing,
  deleting,
  from,
  level,
  isPrivate,
}) => {
  const { deleteNodeReq } = useCatalogTreeRequest();
  const { run: deleteNode } = useRequest(deleteNodeReq, { manual: true });
  const dispatch = useDispatch();
  const { setRightClickInfo, onSetContextMenu } = useContext(WorkbenchSideContext);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const currentLevel = level.split('-').length - 1;
  const childCreatable = node.type === ConfigConstant.NodeType.FOLDER && node.permissions.childCreatable && currentLevel < 5;
  const moduleType = isPrivate ? ConfigConstant.Modules.PRIVATE : undefined;
  useEffect(() => {
    if (actived) {
      const activeElem = document.getElementById(`${ConfigConstant.Modules.CATALOG}${node.nodeId}`);
      activeElem && activeElem.scrollIntoView({ block: 'nearest' });
    }
    // eslint-disable-next-line
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
    mobileModalClose?.();
    dispatch(StoreActions.setDelNodeId('', moduleType));
    dispatch(StoreActions.setDelNodeId('', ConfigConstant.Modules.FAVORITE));
  };

  const deleteNodeHandler = () => {
    const { nodeId, parentId } = node;
    deleteNode({ nodeId, parentId, module: moduleType });
    cancelDeleteModalHandler();
  };

  const ConfirmContent = (
    <div className={styles.deleteTitle}>
      {
        <TComponent
          tkey={isPrivate ? t(Strings.confirm_delete_private_node_name_as) : t(Strings.confirm_delete_node_name_as)}
          params={{
            nodeNameDiv: <div className={styles.deleteNodeName}>{node.nodeName}</div>,
          }}
        />
      }
    </div>
  );

  useEffect(() => {
    if (deleting && isMobile) {
      const { close } = Modal.warning({
        title: t(Strings.delete),
        content: ConfirmContent,
        onOk: deleteNodeHandler,
        onCancel: cancelDeleteModalHandler,
      });
      mobileModalClose = close;
    }
    // eslint-disable-next-line
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
        isPrivate={isPrivate}
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
      isPrivate={isPrivate}
    />
  );
};

export const NodeItem = React.memo(NodeItemBase);
