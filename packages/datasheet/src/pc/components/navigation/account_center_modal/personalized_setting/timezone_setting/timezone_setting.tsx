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
// eslint-disable-next-line no-restricted-imports
import { colorVars, Select, Typography } from '@apitable/components';
import {
  t,
  Strings,
  getUtcOptionList,
  Selectors,
  Api,
  StoreActions,
  getTimeZoneOffsetByUtc,
  getClientTimeZone, getTimeZone,
} from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

const updateUserTimeZone = (timeZone: string, cb?: () => void) => {
  Api.updateUser({ timeZone }).then((res: any) => {
    const { success } = res.data;
    if (success) {
      store.dispatch(StoreActions.setUserTimeZone(timeZone));
      cb?.();
    }
  });
};

const options = [
  {
    label: `${t(Strings.follow_client_time_zone)} ${getClientTimeZone()}`,
    value: getTimeZone(),
  },
  ...getUtcOptionList()
];

export const TimezoneSetting: FC = () => {
  const timeZone = useAppSelector(Selectors.getUserTimeZone)!;

  const handleSelected = (option: any) => {
    const newValue: string = option.value;
    if (newValue === getTimeZone()) {
      localStorage.removeItem('timeZoneCheck');
    } else {
      localStorage.setItem('timeZoneCheck', 'close');
    }
    const offset = getTimeZoneOffsetByUtc(newValue)!;
    updateUserTimeZone(newValue, () => {
      Message.success({
        content: t(Strings.notify_time_zone_change_desc, { time_zone: `UTC${offset > 0 ? '+' : ''}${offset}(${newValue})` }),
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  return (
    <div className={styles.timezoneSetting}>
      <Typography variant="h7" className={styles.title}>
        {t(Strings.user_setting_time_zone_title)}
      </Typography>
      <Select
        options={options}
        value={timeZone}
        dropdownMatchSelectWidth={false}
        onSelected={handleSelected}
        triggerStyle={{ width: 275 }}
        placeholder={t(Strings.empty)}
        openSearch
        searchPlaceholder={t(Strings.search)}
        highlightStyle={{ backgroundColor: colorVars.bgBrandLightDefault, color: 'inherit', borderRadius: '4px' }}
      />
    </div>
  );
};
