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

import LRU from 'lru-cache';
import { IWrapTextResultProps } from './interface';

const fontCache: { [key: string]: LRU<string, number> } = {};
export const textDataCache = new LRU<string, IWrapTextResultProps>(500);

export const getTextWidth = (ctx: CanvasRenderingContext2D, text: string, font: string) => {
  let width: number | undefined = 0;
  if (!text || typeof text !== 'string') {
    return width;
  }
  let cacheOfFont = fontCache[font];
  if (!cacheOfFont) {
    cacheOfFont = fontCache[font] = new LRU(500);
  }
  width = cacheOfFont.get(text);
  if (width == null) {
    width = ctx!.measureText(text).width;
    cacheOfFont.set(text, width);
  }

  return width;
};
