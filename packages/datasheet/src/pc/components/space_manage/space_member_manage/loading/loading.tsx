import { Strings, t } from '@apitable/core';
import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC } from 'react';
import styles from './style.module.less';

const LoadingOutlined = dynamic(() => import('@ant-design/icons/LoadingOutlined'), { ssr: false });

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
