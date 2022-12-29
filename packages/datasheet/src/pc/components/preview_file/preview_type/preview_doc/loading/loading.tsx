import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import styles from './style.module.less';

const LoadingOutlined = dynamic(() => import('@ant-design/icons/LoadingOutlined'), { ssr: false });
export interface ILoadingProps {
  tip?: string;
}

export const Loading: FC<ILoadingProps> = props => {
  const {
    tip,
  } = props;

  return (
    <div className={styles.loading}>
      <Spin
        tip={tip}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    </div>
  );
};
