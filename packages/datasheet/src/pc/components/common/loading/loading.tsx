import { FC } from 'react';
import * as React from 'react';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Spin } from 'antd';
import classNames from 'classnames';
import styles from './style.module.less';
import { t, Strings } from '@apitable/core';
import { useSelector } from 'react-redux';

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
