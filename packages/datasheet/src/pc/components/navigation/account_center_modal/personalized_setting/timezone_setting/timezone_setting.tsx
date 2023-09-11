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

import { FC } from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-restricted-imports
import { Select, Typography } from '@apitable/components';
import { t, Strings, getUtcOptionList, Selectors } from '@apitable/core';
import styles from './style.module.less';

const options = getUtcOptionList();

export const TimezoneSetting: FC = () => {
  const timeZone = useSelector(Selectors.getUserTimeZone)!;

  return (
    <div className={styles.timezoneSetting}>
      <Typography variant="h7" className={styles.title}>
        {t(Strings.user_setting_time_zone_title)}
      </Typography>
      <Select options={options} value={timeZone} disabled dropdownMatchSelectWidth triggerStyle={{ width: 200 }} placeholder={t(Strings.empty)} />
    </div>
  );
};
