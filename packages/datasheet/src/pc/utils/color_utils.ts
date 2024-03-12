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

import Color from 'color';
import { rgba2hex, colors, convertHexToRGB } from '@apitable/components';
import { ThemeName } from '@apitable/core';

export function hexToRGB(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (typeof alpha !== 'number' || alpha < 0 || alpha > 1) {
    return `rgba(${r},${g},${b},1)`;
  }
  const _alpha = Number.isInteger(alpha) ? alpha : alpha.toFixed(1);
  return `rgba(${r},${g},${b},${_alpha})`;
}

// https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4
// https://css-tricks.com/converting-color-spaces-in-javascript/
export function hexToHSL(hex: string, alpha: number) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Convert to [0, 1] real numbers
  r /= 255;
  g /= 255;
  b /= 255;

  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
}

// Single-multiple choice property.option.color exceeds the threshold value, the font color is white
export const COLOR_INDEX_THRESHOLD = 30;

// rgba -> hex
export const rgbaToHex = (color: string, alpha: number) => {
  return rgba2hex(Color(color).alpha(alpha).string());
};

const createRainbowColorArrByShade = (baseHueArr: any[], shade: number) => {
  return baseHueArr.map((hue) => hue[shade]);
};

const createRainbowColorArrByOpacity = (baseHueArr: any[], opacity: number) => {
  const yellowIndex = 5;
  return baseHueArr.map((hue, index) =>
    // Deal with yellow background and white font problem
    convertHexToRGB(hue[400], index === yellowIndex && opacity === 1 ? 0.85 : opacity),
  );
};

/**
 * Generate color values in the range [0,50]
 * [
 *  [deepPurple100,.....,red100],
 *  ...
 *  [deepPurple500,......,red500]
 * ]
 */
export function createRainbowColorsArr(theme: ThemeName) {
  const isLightTheme = theme === ThemeName.Light;
  const { deepPurple, indigo, blue, teal, green, yellow, orange, tangerine, pink, red, bgReverseDefault } = colors;
  const baseHueArr = [deepPurple, indigo, blue, teal, green, yellow, orange, tangerine, pink, red];

  const baseColor = isLightTheme
    ? [100, 200].reduce((prev: string[], cur: number) => {
      return prev.concat(createRainbowColorArrByShade(baseHueArr, cur));
    }, [])
    : [0.2, 0.4].reduce((prev: string[], cur: number) => {
      return prev.concat(createRainbowColorArrByOpacity(baseHueArr, cur));
    }, []);

  const vipColor = isLightTheme
    ? [300, 400, 500].reduce((prev: string[], cur: number) => {
      return prev.concat(createRainbowColorArrByShade(baseHueArr, cur));
    }, [])
    : [0.6, 0.8, 1].reduce((prev: string[], cur: number) => {
      return prev.concat(createRainbowColorArrByOpacity(baseHueArr, cur));
    }, []);

  const whiteBgColor = bgReverseDefault;
  // The main consideration here is that the base color and vip color may have to be used separately in the future
  return [baseColor, vipColor, whiteBgColor];
}

export function createAvatarRainbowColorsArr(theme: ThemeName) {
  const isLightTheme = theme === ThemeName.Light;
  const { deepPurple, indigo, blue, teal, green, yellow, orange, tangerine, pink, red } = colors;
  const baseHueArr = [deepPurple, indigo, blue, teal, green, yellow, orange, tangerine, pink, red];

  return isLightTheme ? createRainbowColorArrByShade(baseHueArr, 500) : createRainbowColorArrByOpacity(baseHueArr, 1);
}
