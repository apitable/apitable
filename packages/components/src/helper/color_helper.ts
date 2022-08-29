/**
 * WCAG 2.0 中将颜色对比等级分为3种，A级，AA级，AAA级，等级越高意味着颜色的对比度越高，呈现出来的视觉压力越大：
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast
 * A 级 （采用3:1的对比度，是普通观察者可接受的最低对比度）
 * AA 级（采用4.5:1 的对比度，是普通视力损失的人可接受的最低对比度）
 * AAA 级（采用7:1的对比度，是严重视力损失的人可接受的最低对比度）
 * REF: https://github.com/mui-org/material-ui/blob/ec37e2bb3c904d9552fa819425ee1eef72914996/packages/material-ui/src/styles/createPalette.js#L104
 */
import { light, dark } from '../theme';
import Color from 'color';
import * as Colors from '../colors';

type IHueShade = [string, number];
type IHexHueShadeMap = {
  [hex: string]: IHueShade
};

const allColors: { [hue: string]: Colors.IColor } = {
  black: Colors.black,
  blackBlue: Colors.blackBlue,
  blue: Colors.blue,
  brown: Colors.brown,
  deepPurple: Colors.deepPurple,
  green: Colors.green,
  indigo: Colors.indigo,
  orange: Colors.orange,
  pink: Colors.pink,
  purple: Colors.purple,
  red: Colors.red,
  tangerine: Colors.tangerine,
  teal: Colors.teal,
  yellow: Colors.yellow,
};

const getColorHexHueShadeMap = () => {
  const colorHexHueShadeMap: IHexHueShadeMap = {};
  // 有方法直接把 import * keys 吗
  Object.entries(allColors).forEach(item => {
    const [hue, colorObj] = item;
    colorObj && Object.entries(colorObj).forEach(colorItem => {
      const [shade, value] = colorItem;
      colorHexHueShadeMap[value.toUpperCase()] = [hue, parseInt(shade, 10)];
    });
  });
  return colorHexHueShadeMap;
};

const colorHexHueShadeMap = getColorHexHueShadeMap();

const shadeLevel = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

/**
 * 将传入的颜色作为 action 基础色，根据计算规则获取其 hover 和 active 的颜色
 * inputColor 在调色板中的 shade
 * 当 shade 大于 700 时，hoverShade = shade - 2，activeShade = shade - 4
 * 当 shade 小于等于 700 时候， hoverShade = shade + 1，activeShade = shade + 2
 * @param color hex 颜色
 */
export const getActionColor = (color: string) => {
  const hueShade = colorHexHueShadeMap[color.toUpperCase()];
  if (hueShade) {
    const [hue, currentShade] = hueShade;
    const currentLevel = shadeLevel.findIndex(shade => shade === currentShade);
    if (currentLevel > 7) {
      return {
        hover: allColors[hue][shadeLevel[currentLevel - 2]],
        active: allColors[hue][shadeLevel[currentLevel - 4]],
      };
    }
    return {
      hover: allColors[hue][shadeLevel[currentLevel + 1]],
      active: allColors[hue][shadeLevel[currentLevel + 2]],
    };
  }
  return {
    hover: color,
    active: color,
  };
};

/**
 * (red[500], 1) => red[600]
 * @param color 色板中的任意 Hex 颜色，例如 red[500]
 * @param gap shade 间隔
 */
export const getNextShadeColor = (color: string, gap: number) => {
  const hueShade = colorHexHueShadeMap[color.toUpperCase()];
  if (hueShade) {
    const [hue, currentShade] = hueShade;
    const currentLevel = shadeLevel.findIndex(shade => shade === currentShade);
    const nextLevel = currentLevel + gap;
    const nextShade = shadeLevel[nextLevel];
    if (nextShade) return allColors[hue][nextShade];
    return color;
  }
  // 非色板中的颜色，原样返回。
  return color;
};

// 根据背景色，自动生成前景文字颜色：亮色/暗色
export function getContrastText(
  background: string, // #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla().
  contrastThreshold: number,
) {
  const contrastText =
    getContrastRatio(background, dark.palette.text.primary) >= contrastThreshold
      ? dark.palette.text.primary
      : light.palette.text.primary;

  return contrastText;
}

export function decomposeColor(color: string): { type: string, values: number[] } {
  if (color.charAt(0) === '#') {
    return decomposeColor(convertHexToRGB(color));
  }
  const marker = color.indexOf('(');
  const type = color.substring(0, marker);
  const strValues = color.substring(marker + 1, color.length - 1).split(',');
  const values = strValues.map(value => parseFloat(value));
  return { type, values };
}

/**
 * 
 * @param color 16 进制颜色
 * @param opacity 透明度
 */
export function convertHexToRGB(color: string, opacity?: number) {
  color = color.substr(1);

  const re = new RegExp(`.{1,${color.length / 3}}`, 'g');
  let colors = color.match(re);

  if (colors && colors[0].length === 1) {
    colors = colors.map(n => n + n);
  }

  return colors ? `${opacity !== undefined ? 'rgba' : 'rgb'}(${colors.map(n => parseInt(n, 16)).join(', ')}${opacity ? ', ' + opacity : ''})` : '';
}

export function getContrastRatio(foreground: string, background: string) {
  const lumA = getLuminance(foreground);
  const lumB = getLuminance(background);
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}

export function getLuminance(color: string) {
  const decomposedColor = decomposeColor(color);
  if (decomposedColor.type.indexOf('rgb') !== -1) {
    const rgb = decomposedColor.values.map(val => {
      val /= 255; // normalized
      return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
    });
    // 黄色特殊处理
    const isYellow = rgb[0] > 0.4 && rgb[1] > 0.25 && rgb[2] < 0.05;
    // Truncate at 3 digits
    return (isYellow ? 0.5 : 1) * Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
  }

  // else if (decomposedColor.type.indexOf('hsl') !== -1)
  return decomposedColor.values[2] / 100;
}

/**
 * rgba + 默认白色背景转化为叠加的、不包含透明度的 hex 颜色
 * adjustedColor = opacity * foregroundColor + (1 - opacity) * backgroundColor
 * @param foregroundColor 带有 alpha 通道的颜色
 * @param backgroundColor 默认白底
 */
export const rgba2hex = (foregroundColor: string, backgroundColor = '#FFFFFF') => {
  const getAdjustedChannel = (fValue: number, bValue: number, opacity: number) => opacity * fValue + (1 - opacity) * bValue;
  const fc = Color(foregroundColor);
  const bc = Color(backgroundColor);
  const opacity = fc.alpha();
  const adjustedColor = Color([
    getAdjustedChannel(fc.red(), bc.red(), opacity),
    getAdjustedChannel(fc.green(), bc.green(), opacity),
    getAdjustedChannel(fc.blue(), bc.blue(), opacity),
  ]);
  return adjustedColor.hex();
};

/**
 * 调整 rgba 颜色的透明度
 * @param rgbaColor rgba 颜色
 */
export const editRgbaOpacity = (rgbaColor: string, opacity: number) => {
  const rgb = rgbaColor.match(/(\d(\.\d+)?)+/g);
  if (!rgb) {
    return rgbaColor;
  }
  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// 四种状态不同的颜色映射
export const FourStatusColorMap = {
  default: light.palette.primary,
  error: light.palette.danger,
  warning: light.palette.warning,
  success: light.palette.success,
};