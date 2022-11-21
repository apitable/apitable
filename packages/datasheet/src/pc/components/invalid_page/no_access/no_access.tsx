import { Button } from '@apitable/components';
import { Navigation, Strings, t } from '@apitable/core';
import Image from 'next/image';
import { Logo } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { FC } from 'react';
import NoAccessImage from 'static/icon/common/common_img_noaccess.png';
import styles from './style.module.less';

export const NoAccess: FC = () => {
  const returnHome = () => {
    Router.redirect(Navigation.HOME);
  };
  return (
    <div className={styles.noAccess}>
      <div className={styles.logo}>
        <Logo size='large' />
      </div>
      <div className={styles.noAccessImage}>
        <Image src={NoAccessImage} alt={t(Strings.system_configuration_product_name)} />
      </div>
      <h1>{t(Strings.space_not_access)}</h1>
      <Button color='primary' onClick={returnHome}>{t(Strings.back_to_space)}</Button>
    </div>
  );
};
