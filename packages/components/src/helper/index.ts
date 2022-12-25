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

import { defaultTheme, ITheme } from '../theme';

export const getTheme = (theme?: any): ITheme => {
  return theme || defaultTheme;
};

export function stopPropagation(e: React.MouseEvent | React.KeyboardEvent | React.WheelEvent) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

export const getArrayLoopIndex = (length: number, index: number, plusOrNot: number) => {
  if (index == null || length <= 0) return 0;
  const newIndex = index + plusOrNot;
  if (newIndex < 0) {
    return (length + newIndex) % length;
  }
  return newIndex % length;
};

/**
 * Whether there is scroll bar
 * @returns `boolean`
 */
export function hasScrollbar() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

/**
 * Calculate scroll bar width
 * @returns `number`
 */
export function getScrollbarWidth() {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

export * from './color_helper';
export * from './icon_helper';
export * from './font_variant_style';
export * from './colors';
export * from './use_listen_visual_height';