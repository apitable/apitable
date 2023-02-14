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

import { ThemeName, ThemeProvider } from '@apitable/components';
import { Selectors, StoreActions } from '@apitable/core';
import { useKeyPress, useLocalStorageState } from 'ahooks';
import { SystemTheme } from 'pc/common/theme';
import { getEnvVariables } from 'pc/utils/env';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ThemeWrapper: React.FC<React.PropsWithChildren<unknown>> = (props) => {
  const [theme, setTheme] = useLocalStorageState<ThemeName>('theme', { defaultValue: (getEnvVariables().SYSTEM_CONFIGURATION_DEFAULT_THEME as ThemeName) || ThemeName.Light });
  const [systemTheme, setSystemTheme] = useLocalStorageState<SystemTheme>('systemTheme', { defaultValue: SystemTheme.Close });
  const dispatch = useDispatch();
  const cacheTheme = useSelector(Selectors.getTheme);

  useEffect(() => {
    const curTheme = theme || ThemeName.Light;
    const html = document.querySelector('html');
    html?.setAttribute('data-theme', curTheme);
    dispatch(StoreActions.setTheme(curTheme));
  }, [dispatch, theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSystemTheme = (localStorage.getItem('systemTheme'));
      if (newSystemTheme && JSON.parse(newSystemTheme) !== systemTheme) {
        setSystemTheme(systemTheme === SystemTheme.Close ? SystemTheme.Open : SystemTheme.Close);
      }
    }, 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [setSystemTheme, systemTheme]);

  useEffect(() => {
    if (!systemTheme || systemTheme === SystemTheme.Close) return;
    const themeMedia = window.matchMedia('(prefers-color-scheme: light)');
    // Reset the theme when the systemTheme state changes to open
    setTheme(themeMedia.matches ? ThemeName.Light : ThemeName.Dark);
    const listener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setTheme(ThemeName.Light);
      } else {
        setTheme(ThemeName.Dark);
      }
    };
    themeMedia.addEventListener('change', listener);
    return () => {
      themeMedia.removeEventListener('change', listener);
    };
  }, [setTheme, systemTheme]);

  useKeyPress(['shift.meta.l'], () => {
    theme === ThemeName.Light ? setTheme(ThemeName.Dark) : setTheme(ThemeName.Light);
  });

  return <ThemeProvider theme={cacheTheme}>
    {props.children}
  </ThemeProvider>;
};

export default ThemeWrapper;
