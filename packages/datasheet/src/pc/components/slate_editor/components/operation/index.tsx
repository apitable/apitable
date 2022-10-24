import cx from 'classnames';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { IElement } from '../../interface/element';

import styles from './operation.module.less';

const PlusOutlined = dynamic(() => import('@ant-design/icons/PlusOutlined'), { ssr: false });

export interface IOperationProps {
  element: IElement;
  style?: React.CSSProperties;
  className?: string;
  visible?: boolean;
}

const Operation = ({ visible, style, className }: IOperationProps) => {
  if (!visible) {
    return null;
  }
  return <span contentEditable={false} className={cx(styles.operation, className)} style={style}>
    <PlusOutlined />
  </span>;
};

export default Operation;
