import { useRouter } from 'next/router';
import { useResponsive } from 'pc/hooks';
import * as React from 'react';
import { useEffect } from 'react';
import SplitPane from 'react-split-pane';
import { CommonSide } from '../common_side';
import { MobileBar } from '../mobile_bar';
import styles from './style.module.less';

export const SpaceManage: React.FC = ({ children }) => {
  const router = useRouter();
  const { clientWidth } = useResponsive();
  const isMobile = clientWidth <= 800;

  useEffect(()=>{
    if(router.pathname ==='/management'){
      router.replace('/management/overview');
    }
  },[router]);

  return (
    <div className={styles.spaceManage}>
      {
        !isMobile ? <SplitPane defaultSize={280} minSize={180} maxSize={800} className={styles.navSplit}>
          <CommonSide />
          {children}
        </SplitPane>
          : <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
            <MobileBar title="空间站管理" />
            {children}
          </div>
      }
    </div>
  );
};

