import { rgba2hex, colors, convertHexToRGB } from '@vikadata/components';
import { ThemeName } from '@apitable/core';
import Color from 'color';

export function hexToRGB(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (
    typeof alpha !== 'number' ||
    (
      alpha < 0 || alpha > 1
    )
  ) {
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

  // 转成[0, 1]的实数
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

// 单多选 property.option.color 超过阈值时，字体颜色呈现白色
export const COLOR_INDEX_THRESHOLD = 30;

// rgba -> hex
export const rgbaToHex = (color: string, alpha: number) => {
  return rgba2hex(Color(color).alpha(alpha).string());
};

/**
 * 生成 [0,50) 区间颜色取值。
 * [
 *  [deepPurple100,.....,red100],
 *  ...
 *  [deepPurple500,......,red500]
 * ]
 */
export function createRainbowColorsArr(theme: ThemeName) {
  const isLightTheme = theme === ThemeName.Light;

  const { deepPurple, indigo, blue, teal, green, yellow, orange, tangerine, pink, red } = colors;
  const baseHueArr = [deepPurple, indigo, blue, teal, green, yellow, orange, tangerine, pink, red];

  const yellowIndex = 5;

  const createRainbowColorArrByShade = (shade: number) => {
    return baseHueArr.map(hue => hue[shade]);
  };

  const createRainbowColorArrByOpacity = (opacity: number) => {
    return baseHueArr.map((hue, index) =>
    //  处理黄色背景跟白色字体问题
      convertHexToRGB(hue[400], index === yellowIndex && opacity === 1 ? 0.85 : opacity)
    );
  };

  const baseColor = isLightTheme ? [100, 200].reduce((prev: string[], cur: number) => {
    return prev.concat(createRainbowColorArrByShade(cur));
  }, []) : [0.2, 0.4].reduce((prev: string[], cur: number) => {
    return prev.concat(createRainbowColorArrByOpacity(cur));
  }, []);

  const vipColor = isLightTheme ? [300, 400, 500].reduce((prev: string[], cur: number) => {
    return prev.concat(createRainbowColorArrByShade(cur));
  }, []) : [0.6, 0.8, 1].reduce((prev: string[], cur: number) => {
    return prev.concat(createRainbowColorArrByOpacity(cur));
  }, []);

  // 这里主要是考虑基础色和 vip 色以后可能要分开使用
  return [baseColor, vipColor];
}