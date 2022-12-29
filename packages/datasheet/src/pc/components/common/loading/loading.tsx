import { Strings, t } from '@apitable/core';
import { Spin } from 'antd';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.less';

const LoadingOutlined = dynamic(() => import('@ant-design/icons/LoadingOutlined'), { ssr: false });

export interface ILoadingProps {
  showText?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Loading: FC<ILoadingProps> = props => {
  const { showText = true, style, className } = props;
  const shareId = useSelector(state => state.pageParams.shareId);
  return (
    <div
      className={classNames(styles.loading, className)}
      style={{
        top: shareId ? 16 : 0, bottom: shareId ? 16 : 0, borderRadius: shareId ? 8 : 0, ...style,
      }}
    >
      <Spin
        tip={showText ? t(Strings.loading) : ''}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    </div>
  );
};
