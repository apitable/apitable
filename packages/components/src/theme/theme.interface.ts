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

import { ILightOrDarkThemeColors } from 'colors';

export interface IPalette {
  /**
   * Theme type
   */
  type: ThemeName;

  common: {
    black: string;
    white: string;
  };

  // Primary color
  primary: string;

  // Semantic colors
  success: string;
  danger: string;
  info: string;
  warning: string;

  // Text colors
  text: {
    primary: string;
    secondary: string;
    third: string;
    fourth: string;
    fifth: string;
    disabled: string;
    hint: string;
  }
  // Text background contrast
  contrastThreshold: number;
  background: {
    primary: string;
    secondary: string;
    lowestBg: string;
    tooltipBg: string;
    modalMask: string;
    input: string;
    mask: string;
    iconButton: string;
    activeItem: string;
    border: string;
    scrollTip?: string;
  }
  action: {
    active: string;
    activatedOpacity: number;
    hover: string;
    hoverOpacity: number;
    selected: string;
    selectedOpacity: number;
    disabled: string;
    disabledOpacity: number;
    focus: string;
    focusOpacity: number;
  }
}

export interface ITheme {
  palette: IPalette;
  color: ILightOrDarkThemeColors;
  animation?: object;
  effect?: {
    shadows: {
      [key: string]: string;
    },
    blur: {
      [key: string]: string;
    }
  };
  zIndex?: {};
}

export enum ThemeName {
  Light = 'light',
  Dark = 'dark'
}