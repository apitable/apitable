import React, { } from 'react';
import styles from './style.module.less';
import { NodeIcon } from '../node_icon';
import classnames from 'classnames';
import { Space } from 'antd';
import ShareIcon from 'static/icon/common/common_icon_share.svg';
import LockIcon from 'static/icon/workbench/workbench_icon_lock.svg';
import AddIcon from 'static/icon/common/common_icon_add_content.svg';
import MoreIcon from 'static/icon/common/common_icon_more_stand.svg';
import { EditingNode } from './editing_node';
import { Tooltip } from 'pc/components/common';
import { isTouchDevice } from 'pc/utils';
import { INodesMapItem } from '@apitable/core';

export interface IItemRender {
  id: string;
  actived: boolean;
  isMobile: boolean;
  iconClassNames: string;
  editing: boolean;
  childCreatable: boolean;
  onClickMore: (e: any) => void;
  onNodeAdd: (e: any) => void;
  expanded: boolean;
  hasChildren: boolean;
  node: INodesMapItem;
}

export const ItemRender: React.FC<IItemRender> = (props) => {

  const {
    id,
    actived,
    isMobile,
    iconClassNames,
    editing,
    childCreatable,
    onClickMore,
    onNodeAdd,
    expanded,
    hasChildren,
    node,
  } = props;

  const iconProps = {
    expanded, 
    hasChildren, 
    type: node.type, 
    icon: node.icon, 
    nodeId: node.nodeId, 
    editable: node.permissions.iconEditable, 
    actived,
  };

  return (
    <div
      id={id}
      draggable={false}
      className={classnames(styles.nodeItemWrapper, {
        [styles.actived]: actived,
        [styles.nodeItemHover]: !isMobile,
        [styles.touchDevice]: isTouchDevice(),
      })}
    >
      <div
        className={iconClassNames}
        onClick={e => e.stopPropagation()}
      >
        <NodeIcon {...iconProps} />
      </div>
      <div className={styles.content}>
        {editing ? (
          <EditingNode node={node} />
        ) : (
          <Tooltip
            title={node.nodeName}
            textEllipsis
          >
            <div className={styles.nodeName}>{node.nodeName}</div>
          </Tooltip>
        )}
      </div>
      {
        !editing &&
        <>
          <Space className={styles.state} align="center" size={node.nodePermitSet ? 8 : 0}>
            {node.nodeShared && <ShareIcon />}
            {node.nodePermitSet && <LockIcon />}
          </Space>
          <Space className={styles.operation} align="center">
            {childCreatable && <AddIcon fill="currentColor" onClick={onNodeAdd} />}
            <MoreIcon onClick={onClickMore} />
          </Space>
        </>
      }
    </div>
  );
};