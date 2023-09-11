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

import { useEffect, useState } from 'react';
import { ThemeName, ThemeProvider } from '@apitable/components';
import { getTheme, switchTheme } from './theme';

export const ThemeWrap = ({ children }: { children: JSX.Element }) => {
  const [theme, setTheme] = useState<ThemeName>(getTheme());
  useEffect(() => {
    const messageListener = (event: MessageEvent<any>) => {
      const { data } = event;
      if (data?.type === 'apitable_theme') {
        switchTheme(data?.apitable_theme);
        setTheme(getTheme());
      }
    };
    window.addEventListener('message', messageListener);
    return () => window.removeEventListener('message', messageListener);
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
