import { FC } from 'react';
import styles from './style.module.less';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
import { Navigation, Strings, t } from '@vikadata/core';
import { Logo } from 'pc/components/common';

export const HomeHeader: FC = props => {

  const navigationTo = useNavigation();

  const jumpOfficialWebsite = () => {
    navigationTo({ path: Navigation.HOME, method: Method.NewTab, query: { home: 1 }});
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logo}>
        <div className={styles.logoWrap} onClick={jumpOfficialWebsite}>
          <Logo/>
        </div>
        <div className={styles.logoSlogan}>{t(Strings.login_logo_slogan_mobile)}</div>
      </div>
    </div>
  );
};
