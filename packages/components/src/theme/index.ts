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

import { light } from './light';
import { dark } from './dark';
import { DefaultTheme } from 'styled-components';
import { ITheme } from './theme.interface';

export * from './dark';
export * from './light';
export * from './theme.interface';
export const defaultTheme = light;
export const darkTheme = dark;

interface IProps {
  [x: string]: any;
  theme?: ITheme | {};
  className?: string;
}

export function applyDefaultTheme({ theme = {}, className, ...props }: IProps) {
  // Since styled-components defaults the `theme` prop to an empty object
  // inside of the styled component if a ThemeProvider is not present,
  // we check against the number of keys.
  return {
    ...props,
    theme: (Object.keys(theme).length === 0 ? defaultTheme : theme) as DefaultTheme,
  };
}