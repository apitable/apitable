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

/* eslint-disable @typescript-eslint/no-use-before-define */
import { getThemeName } from 'helper/colors';
import React from 'react';
import { ThemeProvider as Provider, ThemeContext as Context } from 'styled-components';
import { light, dark, ThemeName, ITheme } from 'theme';

interface IThemeContext {
  theme?: ThemeName | ITheme;
}

export const ThemeProvider: React.FC<IThemeContext> = (props) => {
  const { theme } = props;
  const themeName = theme || getThemeName();
  if (typeof themeName !== 'string') {
    return <Provider theme={themeName} >{props.children}</Provider>;
  }
  const themeColor = themeName.includes(ThemeName.Dark) ? dark : light;
  return <Provider theme={themeColor} >{props.children}</Provider>;
};

export const ThemeContext = Context as IThemeContext;
