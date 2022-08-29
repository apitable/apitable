import { Button } from '@vikadata/components';
import { Navigation, Strings, t } from '@vikadata/core';
import Image from 'next/image';
import { Logo } from 'pc/components/common';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
import { FC } from 'react';
import NoAccessImage from 'static/icon/common/common_img_noaccess.png';
import styles from './style.module.less';

export const NoAccess: FC = () => {
  const navigationTo = useNavigation();
  const returnHome = () => {
    navigationTo({ path: Navigation.HOME, method: Method.Redirect });
  };
  return (
    <div className={styles.noAccess}>
      <div className={styles.logo}>
        <Logo size="large" />
      </div>
      <div className={styles.noAccessImage}>
        <Image src={NoAccessImage} alt={t(Strings.vikadata)} />
      </div>
      <h1>{t(Strings.space_not_access)}</h1>
      <Button color="primary" onClick={returnHome}>{t(Strings.back_to_space)}</Button>
    </div>
  );
};
