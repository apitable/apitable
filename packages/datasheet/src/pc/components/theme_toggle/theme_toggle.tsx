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
import { Switch, ThemeName } from '@apitable/components';
import { StoreActions, Strings, t } from '@apitable/core';
import { SystemTheme } from 'pc/common/theme';
import { getEnvVariables } from 'pc/utils/env';

export const ThemeToggle: FC = () => {
  const [theme, setTheme] = useLocalStorageState<ThemeName>('theme', {
    defaultValue: (getEnvVariables().SYSTEM_CONFIGURATION_DEFAULT_THEME as ThemeName) || ThemeName.Light,
  });
  const [, setSystemTheme] = useLocalStorageState<SystemTheme>('systemTheme', { defaultValue: SystemTheme.Close });
  const dispatch = useDispatch();
  const isDark = theme === ThemeName.Dark;

  const handleChange = (checked: boolean) => {
    const newTheme = checked ? ThemeName.Dark : ThemeName.Light;
    setSystemTheme(SystemTheme.Close);
    setTheme(newTheme);
    dispatch(StoreActions.setTheme(newTheme));
    document.querySelector('html')?.setAttribute('data-theme', newTheme);
  };

  return <Switch size="small" checked={isDark} onChange={handleChange} title={t(Strings.theme_setting)} aria-label={t(Strings.theme_setting)} />;
};
