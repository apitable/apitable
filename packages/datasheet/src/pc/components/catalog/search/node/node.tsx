import { FC } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { ISearchNode } from '../search';
import { getNodeIcon } from '../../tree/node_icon';

export interface INodeProps {
  node: ISearchNode;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
}

export const Node: FC<INodeProps> = props => {
  const { node, onMouseDown } = props;
  const spaceName = useSelector(state => state.user.info?.spaceName);

  return (
    <div
      className={classNames(styles.nodeContainer, props.className)}
      data-node-id={node.nodeId}
      data-node-type={node.type}
      onMouseUp={onMouseDown}
    >
      <div className={styles.node}>
        <div className={styles.icon}>{getNodeIcon(node.icon, node.type)}</div>
        <div
          className={styles.nodeName}
          dangerouslySetInnerHTML={{ __html: node.nodeName }}
        />
      </div>
      <div className={styles.superiorPath}>{node.superiorPath || spaceName}</div>
    </div>
  );
};
