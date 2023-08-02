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

import { black, blackBlue, deepPurple, orange, red, teal, lightColors } from '../colors';
import { ITheme, ThemeName } from './theme.interface';

export const light: ITheme = {
  color: lightColors,
  // only  for widget
  palette: {
    type: ThemeName.Light,
    common: {
      white: '#fff',
      black: '#000',
    },
    primary: deepPurple[500],
    success: teal[500],
    danger: red[500],
    warning: orange[500],
    info: deepPurple[500],
    text: {
      primary: black[1000],
      secondary: black[700],
      third: black[500],
      fourth: black[300],
      fifth: black[50],
      disabled: 'rgba(0, 0, 0, 0.38)',
      // Text hints.
      hint: 'rgba(0, 0, 0, 0.38)',
    },
    contrastThreshold: 3,
    background: {
      primary: blackBlue[50],
      secondary: black[100],
      lowestBg: black[100],
      tooltipBg: black[900],
      modalMask: 'rgba(38,38,38,0.5)',
      mask: black[1000],
      input: black[100],
      iconButton: black[200],
      activeItem: deepPurple[50],
      border: blackBlue[200],
      scrollTip: '253, 253, 253',
    },
    action: {
      hover: '#000',
      hoverOpacity: 0.1,
      active: deepPurple[500],
      activatedOpacity: 0.12,
      selected: deepPurple[500],
      selectedOpacity: 0.08,
      disabled: '#fff',
      disabledOpacity: 0.5,
      focus: '#000',
      focusOpacity: 0.12,
    }
  }
};