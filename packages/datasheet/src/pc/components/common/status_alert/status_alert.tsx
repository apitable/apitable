import styles from './style.module.less';
import { DefaultFilled } from '@vikadata/icons';
import { Typography } from '@vikadata/components';
import * as React from 'react';

interface IStatusAlertProps {
  content: string;
  style?: React.CSSProperties;
}

export const StatusAlert: React.FC<IStatusAlertProps> = (props) => {
  const { style, content } = props;
  return <div className={styles.closeSyncViewTip} style={style}>
    <DefaultFilled />
    <Typography variant="body4" className={styles.text} ellipsis={{ tooltip: content }}>
      {content}
    </Typography>
  </div>;
};
