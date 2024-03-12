import { useResponsive } from '../../hooks';
import { ScreenSize } from '../common/component_display';
import { Popup } from '../common/mobile/popup';
import { PcWrapper } from './pc_wrapper';
import styles from './style.module.less';

interface IDataSourceSelectorWrapperProps {
  title: string;

  hide(): void
}

export const DataSourceSelectorWrapper: React.FC<React.PropsWithChildren<IDataSourceSelectorWrapperProps>> = ({ children, title, hide }) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return (
    <>
      {!isMobile ? <PcWrapper hidePanel={hide}>
        {children}
      </PcWrapper> : (
        <Popup title={title} open height="90%" bodyStyle={{ padding: 0 }} onClose={hide}
          className={styles.portalContainerDrawer}>
          {children}
        </Popup>
      )}
    </>
  );
};
