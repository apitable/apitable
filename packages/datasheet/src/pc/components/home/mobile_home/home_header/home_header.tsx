import { Navigation, Strings, t } from '@vikadata/core';
import { Logo } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { FC } from 'react';
import styles from './style.module.less';

export const HomeHeader: FC = props => {
  const jumpOfficialWebsite = () => {
    Router.newTab(Navigation.HOME, { query: { home: 1 }});
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logo}>
        <div className={styles.logoWrap} onClick={jumpOfficialWebsite}>
          <Logo />
        </div>
        <div className={styles.logoSlogan}>{t(Strings.login_logo_slogan_mobile)}</div>
      </div>
    </div>
  );
};
