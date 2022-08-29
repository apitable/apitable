import { FC } from 'react';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Spin } from 'antd';
import styles from './style.module.less';

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
