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

import * as React from 'react';
import { Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { MainAdmin } from 'pc/components/space_manage/main_admin';
import { SubAdmin } from 'pc/components/space_manage/sub_admin';
import styles from './style.module.less';

export const Manager: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div className={styles.managerContainer}>
      <Typography variant={'h1'}>{t(Strings.share_permisson_model_space_admin)}</Typography>
      <Typography className={styles.pageSubscribe} variant={'body2'}>
        {t(Strings.share_permisson_model_space_admin_tip)}
      </Typography>
      <MainAdmin />
      <SubAdmin />
    </div>
  );
};
