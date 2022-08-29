import * as React from 'react';
import styles from './style.module.less';
import { Typography } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';

export const InvalidValue = ({ style, content }: { style?: React.CSSProperties; content?: string }) => {
  return <div className={styles.invalidValue} style={style}>
    <Typography variant={'body3'}>
      {content || t(Strings.no_field_role)}
    </Typography>
  </div>;
};
