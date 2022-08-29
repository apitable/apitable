import { FC } from 'react';
import { FormTab } from './form_tab';
import styles from './style.module.less';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Skeleton } from '@vikadata/components';
import { Space } from 'antd';

export const TabBar: FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <div className={styles.tabBarWrapper}>
      { 
        loading ? (
          <Space style={{ margin: '8px 20px' }}>
            <Skeleton style={{ height: 24, width: 340, marginTop: 0 }} />
          </Space>
        ) : (
          <AutoSizer style={{ width: '100%', height: '100%' }}>
            {({ width }) => <FormTab />}
          </AutoSizer>
        )
      }
    </div>
  );
};