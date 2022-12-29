import { Spin } from 'antd';
import dynamic from 'next/dynamic';
import { CSSProperties, FC } from 'react';
import styles from './style.module.less';

const LoadingOutlined = dynamic(() => import('@ant-design/icons/LoadingOutlined'), { ssr: false });
export interface ILoadingProps {
  tip?: string;
  style?: CSSProperties;
}

export const Loading: FC<ILoadingProps> = props => {
  const {
    tip,
    style,
  } = props;

  return (
    <div style={style} className={styles.loading}>
      <Spin
        tip={tip}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    </div>
  );
};
