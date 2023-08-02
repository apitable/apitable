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

import { black, blackBlue, deepPurple, darkColors, orange, red, teal } from '../colors';
import { ITheme, ThemeName } from './theme.interface';

// TODO
export const dark: ITheme = {
  color: darkColors,
  // only  for widget
  palette: {
    type: ThemeName.Dark,
    common: {
      white: '#fff',
      black: '#000',
    },
    primary: deepPurple[300],
    // Semantic color
    success: teal[300],
    danger: red[300],
    warning: orange[300],
    info: deepPurple[300],
    // contrastThreshold: 3,
    text: {
      primary: blackBlue[100],
      secondary: blackBlue[200],
      third: blackBlue[300],
      fourth: black[300],
      fifth: black[50],
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
    contrastThreshold: 3,
    action: {
      hover: '#fff',
      hoverOpacity: 0.08,
      active: '#fff',
      activatedOpacity: 0.24,
      selected: '#fff',
      selectedOpacity: 0.16,
      disabled: '#fff',
      disabledOpacity: 0.5,
      focus: '#fff',
      focusOpacity: 0.24,
    },
    background: {
      primary: black[1000],
      secondary: black[900],
      modalMask: black[900],
      input: black[900],
      iconButton: black[800],
      mask: blackBlue[50],
      activeItem: deepPurple[500],
      lowestBg: black[100],
      tooltipBg: black[900],
      border: blackBlue[200],
      // scrollTip: '51, 51, 51',
    },
  }
};