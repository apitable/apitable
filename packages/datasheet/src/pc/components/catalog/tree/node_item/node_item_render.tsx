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

import React, { useState } from 'react';
import styles from './style.module.less';
import { NodeIcon } from '../node_icon';
import classnames from 'classnames';
import { Space } from 'antd';
import { EditingNode } from './editing_node';
import { Tooltip } from 'pc/components/common';
import { INodesMapItem } from '@apitable/core';
import { AddOutlined, MoreStandOutlined, LockFilled, ShareFilled } from '@apitable/icons';
import { useMount } from 'ahooks';
import { browserIsDesktop } from 'pc/utils/os';

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

export const ItemRender: React.FC<React.PropsWithChildren<IItemRender>> = (props) => {

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

  const [isMobileDevice, setIsMobileDevice] = useState<boolean>();

  useMount(async() => {
    const isDesktop = await browserIsDesktop();
    setIsMobileDevice(!isDesktop);
  });

  return (
    <div
      id={id}
      draggable={false}
      className={classnames(styles.nodeItemWrapper, {
        [styles.actived]: actived,
        [styles.nodeItemHover]: !isMobile,
        [styles.nodeMobile]: isMobileDevice,
        [styles.nodeMobileActive]: actived && isMobileDevice,
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
            {node.nodeShared && <ShareFilled />}
            {node.nodePermitSet && <LockFilled />}
          </Space>
          <Space className={styles.operation} align="center">
            {childCreatable && <span onClick={onNodeAdd} style={{ display: 'flex', alignItems: 'center' }}>
              <AddOutlined color="currentColor" />
            </span>}
            <span onClick={onClickMore} style={{ display: 'flex', alignItems: 'center' }}><MoreStandOutlined /></span>
          </Space>
        </>
      }
    </div>
  );
};