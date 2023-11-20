import {useResponsive} from "pc/hooks";
import {ScreenSize} from "pc/components/common/component_display";
import styles from "pc/components/home/style.module.less";
import {PcHome} from "pc/components/home/pc_home";
import {MobileHome} from "pc/components/home/mobile_home";

export default ()=>{
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.lg);

  return  <div className={styles.homeWrapper}>{!isMobile ? <PcHome /> : <MobileHome />}</div>
}
