import { FC } from 'react';
import * as React from 'react';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Spin } from 'antd';
import styles from './style.module.less';
import { t, Strings } from '@vikadata/core';

interface ILoading {
  style?: React.CSSProperties;
}
export const Loading: FC<ILoading> = ({ style }) => {
  return (
    <div className={styles.loadingWrapper} style={style}>
      <Spin
        tip={t(Strings.loading)}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    </div>
  );
};
