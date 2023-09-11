/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Image from 'next/image';
import { FC } from 'react';
import { Button, useThemeMode } from '@apitable/components';
import { Navigation, Strings, t } from '@apitable/core';
import { Logo } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import NoAccessImage from 'static/icon/common/common_img_noaccess.png';
import styles from './style.module.less';

export const NoAccess: FC<React.PropsWithChildren<unknown>> = () => {
  const returnHome = () => {
    Router.redirect(Navigation.HOME);
  };
  const theme = useThemeMode();

  return (
    <div className={styles.noAccess}>
      <div className={styles.logo}>
        <Logo size="large" theme={theme} />
      </div>
      <div className={styles.noAccessImage}>
        <Image src={NoAccessImage} alt={t(Strings.system_configuration_product_name)} />
      </div>
      <h1>{t(Strings.space_not_access)}</h1>
      <Button color="primary" onClick={returnHome}>
        {t(Strings.back_to_space)}
      </Button>
    </div>
  );
};
