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

import classNames from 'classnames';
import { FC } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { INode } from '@apitable/core';
import { getNodeIcon } from '../../catalog/tree/node_icon';
import styles from './style.module.less';

export type ISearchNode = INode & { superiorPath: string };

export interface INodeProps {
  node: ISearchNode;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
}

export const Node: FC<React.PropsWithChildren<INodeProps>> = (props) => {
  const { node, onMouseDown } = props;
  const spaceName = useSelector((state) => state.user.info?.spaceName);

  return (
    <div className={classNames(styles.nodeContainer, props.className)} data-node-id={node.nodeId} data-node-type={node.type} onMouseUp={onMouseDown}>
      <div className={styles.node}>
        <div className={styles.icon}>{getNodeIcon(node.icon, node.type, { emojiSize: 16 })}</div>
        <div className={styles.nodeName} dangerouslySetInnerHTML={{ __html: node.nodeName }} />
      </div>
      <div className={styles.superiorPath}>{node.superiorPath || spaceName}</div>
    </div>
  );
};
