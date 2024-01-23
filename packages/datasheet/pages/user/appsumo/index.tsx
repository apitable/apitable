import { ScreenSize } from 'pc/components/common/component_display';
import { MobileHome } from 'pc/components/home/mobile_home';
import { PcHome } from 'pc/components/home/pc_home';
import styles from 'pc/components/home/style.module.less';
import { useResponsive } from 'pc/hooks';

// eslint-disable-next-line import/no-anonymous-default-export
export default ()=>{
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.lg);

  return <div className={styles.homeWrapper}>{!isMobile ? <PcHome /> : <MobileHome />}</div>;
};
