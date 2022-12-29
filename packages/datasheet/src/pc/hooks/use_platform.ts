import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from './use_responsive';

export const usePlatform = () => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return {
    mobile: isMobile,
    desktop: !isMobile,
  };
};
