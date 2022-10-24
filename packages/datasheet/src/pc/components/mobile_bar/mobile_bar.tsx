import { useThemeColors } from '@vikadata/components';
import { Selectors, Strings, t } from '@apitable/core';
import { useRouter } from 'next/router';
import { useSideBarVisible } from 'pc/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import IconSide from 'static/icon/miniprogram/nav/nav_icon_drawer.svg';
import styles from './style.module.less';

export const MobileBar: React.FC<{ title?: string }> = ({ title }) => {
  const { datasheetId } = useSelector(state => state.pageParams);
  const colors = useThemeColors();
  const currentView = useSelector(state => Selectors.getCurrentView(state))!;
  const { setSideBarVisible } = useSideBarVisible();
  const router = useRouter();
  const pathname = router.asPath;

  const matchedOrganization = pathname.includes('/org');

  const matchedWorkSpace = datasheetId && currentView;

  const matchedTemplateCentre = pathname.includes('/template');

  return (
    <div className={styles.shareMobileBar}>
      <div onClick={() => { setSideBarVisible && setSideBarVisible(true); }} className={styles.side}>
        <IconSide width={24} height={24} fill={colors.firstLevelText} />
      </div>

      <div className={styles.middle}>
        {(matchedOrganization || title) && (
          <div className={styles.matchedOrganization}>
            <span>{title || t(Strings.contacts)}</span>
          </div>
        )}

        {matchedTemplateCentre && (!matchedWorkSpace) && (
          <div className={styles.matchedOrganization}>
            <span>{t(Strings.nav_templates)}</span>
          </div>
        )}
      </div>
      <div className={styles.right} />
    </div>
  );
};
