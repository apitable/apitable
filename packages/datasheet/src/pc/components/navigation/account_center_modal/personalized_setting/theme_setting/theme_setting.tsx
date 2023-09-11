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

import { useLocalStorageState } from 'ahooks';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line no-restricted-imports
import { Select, ThemeName, Typography } from '@apitable/components';
import { StoreActions, Strings, t } from '@apitable/core';
import { SystemTheme } from 'pc/common/theme';
import { getEnvVariables } from 'pc/utils/env';
import styles from './style.module.less';

const options = [
  {
    label: t(Strings.default_theme),
    value: ThemeName.Light,
  },
  {
    label: t(Strings.dark_theme),
    value: ThemeName.Dark,
  },
  {
    label: t(Strings.system_theme),
    value: 'system',
  },
];

export const ThemeSetting: FC<React.PropsWithChildren<unknown>> = () => {
  const [theme, setTheme] = useLocalStorageState<ThemeName>('theme', {
    defaultValue: (getEnvVariables().SYSTEM_CONFIGURATION_DEFAULT_THEME as ThemeName) || ThemeName.Light,
  });
  const [systemTheme, setSystemTheme] = useLocalStorageState<SystemTheme>('systemTheme', { defaultValue: SystemTheme.Close });
  const dispatch = useDispatch();

  const handleSelected = (option: any) => {
    let newValue: ThemeName | 'system' = option.value;
    if (newValue === (systemTheme === SystemTheme.Open ? 'system' : theme)) {
      return;
    }
    if (newValue === 'system') {
      setSystemTheme(SystemTheme.Open);
      const themeMedia = window.matchMedia('(prefers-color-scheme: light)');
      newValue = themeMedia.matches ? ThemeName.Light : ThemeName.Dark;
    } else {
      setSystemTheme(SystemTheme.Close);
    }
    dispatch(StoreActions.setTheme(newValue));
    setTheme(newValue);
    const html = document.querySelector('html');
    html?.setAttribute('data-theme', newValue);
  };

  return (
    <div className={styles.themeSetting}>
      <Typography variant="h7" className={styles.title}>
        {t(Strings.theme_setting)}
      </Typography>
      <Select
        options={options}
        value={systemTheme === SystemTheme.Open ? 'system' : theme || ThemeName.Light}
        onSelected={handleSelected}
        dropdownMatchSelectWidth
        triggerStyle={{ width: 200 }}
      />
    </div>
  );
};
