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

import { ThemeName } from '@apitable/components';
import { getEnvVariables } from 'pc/utils/env';

export const initTheme = () => {
  const query = new URLSearchParams(window.location.search);
  let localTheme = localStorage.getItem('theme');
  localTheme = localTheme ? (localTheme.includes(ThemeName.Dark) ? ThemeName.Dark : ThemeName.Light) : null;
  const theme = query.get('theme') || localTheme || getEnvVariables().SYSTEM_CONFIGURATION_DEFAULT_THEME || ThemeName.Light;
  switchTheme(theme as ThemeName);
};

export const switchTheme = (theme?: ThemeName) => {
  if (!theme) {
    return;
  }
  const html = document.querySelector('html');
  html?.setAttribute('data-theme', theme);
};

export const getTheme = () => {
  const html = document.querySelector('html');
  return (html?.getAttribute('data-theme') as ThemeName) || getEnvVariables().SYSTEM_CONFIGURATION_DEFAULT_THEME || ThemeName.Light;
};
