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

/**
 * WCAG 2.0 divides the color contrast into three grades, Grade A, Grade AA and Grade AAA.
 * The higher the grade, the higher the color contrast and the greater the visual pressure:
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast
 * Grade A (3:1 contrast is adopted, which is the lowest contrast acceptable to ordinary observers)
 * Grade AA (4.5:1 contrast is used, which is the lowest acceptable contrast for people with ordinary visual loss)
 * AAA (7:1 contrast is adopted, which is the lowest acceptable contrast for people with severe visual loss)
 * REF: https://github.com/mui-org/material-ui/blob/ec37e2bb3c904d9552fa819425ee1eef72914996/packages/material-ui/src/styles/createPalette.js#L104
 */
import { darkColors, lightColors } from '../colors';
import Color from 'color';
import * as Colors from '../colors';

type IHex = keyof typeof allColors;

type IHueShade = [IHex, number];
type IHexHueShadeMap = {
  [hex: string]: IHueShade
};

const allColors = {
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
  Object.entries(allColors).forEach(item => {
    const [hue, colorObj] = item;
    colorObj && Object.entries(colorObj).forEach(colorItem => {
      const [shade, value] = colorItem;
      colorHexHueShadeMap[value.toUpperCase()] = [(hue as IHex), parseInt(shade, 10)];
    });
  });
  return colorHexHueShadeMap;
};

const colorHexHueShadeMap = getColorHexHueShadeMap();

const shadeLevel = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

/**
 * Take the incoming color as the basic color of the action, and obtain its hover and active colors according to the calculation rules
 * InputColor's shade in the palette
 * When the shade is greater than 700: hoverShade = shade - 2, activeShade = shade - 4
 * When the shade is less than or equal to 700: hoverShade = shade + 1, activeShade = shade + 2
 * @param color hex color
 */
export const getActionColor = (color: string) => {
  const hueShade = colorHexHueShadeMap[color.toUpperCase()];
  if (hueShade) {
    const [hue, currentShade] = hueShade;
    const currentLevel = shadeLevel.findIndex(shade => shade === currentShade);
    if (currentLevel > 7) {
      return {
        hover: allColors[hue][shadeLevel[currentLevel - 2]!],
        active: allColors[hue][shadeLevel[currentLevel - 4]!],
      };
    }
    return {
      hover: allColors[hue][shadeLevel[currentLevel + 1]!],
      active: allColors[hue][shadeLevel[currentLevel + 2]!],
    };
  }
  return {
    hover: color,
    active: color,
  };
};

/**
 * (red[500], 1) => red[600]
 * @param color Any Hex color in the color palette, such as red[500]
 * @param gap shade gap
 */
export const getNextShadeColor = (color: string, gap: number): string => {
  const hueShade = colorHexHueShadeMap[color.toUpperCase()];
  if (hueShade) {
    const [hue, currentShade] = hueShade;
    const currentLevel = shadeLevel.findIndex(shade => shade === currentShade);
    const nextLevel = currentLevel + gap;
    const nextShade = shadeLevel[nextLevel];
    if (nextShade) return allColors[hue][nextShade]!;
    return color;
  }
  // The original value of the color not in the color palette is returned.
  return color;
};

/**
 * 
 * Automatically generate foreground text color according to background color: light/dark
 * @param background `string` Like #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param contrastThreshold `number` Contrast Threshold
 * @returns 
 */
export function getContrastText(
  background: string, 
  contrastThreshold: number,
) {
  return getContrastRatio(background, darkColors.fc1) >= contrastThreshold
    ? darkColors.fc1
    : lightColors.fc1;
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
 * @param color Hex color
 * @param opacity
 */
export function convertHexToRGB(color: string, opacity?: number) {
  color = color.substr(1);

  const re = new RegExp(`.{1,${color.length / 3}}`, 'g');
  let colors = color.match(re) as string[];

  if (colors && colors[0]!.length === 1) {
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
    // Yellow requires special calculation
    const isYellow = rgb[0]! > 0.4 && rgb[1]! > 0.25 && rgb[2]! < 0.05;
    // Truncate at 3 digits
    return (isYellow ? 0.5 : 1) * Number((0.2126 * rgb[0]! + 0.7152 * rgb[1]! + 0.0722 * rgb[2]!).toFixed(3));
  }

  // else if (decomposedColor.type.indexOf('hsl') !== -1)
  return decomposedColor.values[2]! / 100;
}

/**
 * rgba + default white background is converted to the superimposed hex color without transparency
 * adjustedColor = opacity * foregroundColor + (1 - opacity) * backgroundColor
 * @param foregroundColor Color with alpha format，such as rgba(200, 115, 115, 0.5)
 * @param backgroundColor background color
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
 * Adjust the transparency of rgba colors
 * @param rgbaColor Rgba color
 * @param opacity
 */
export const editRgbaOpacity = (rgbaColor: string, opacity: number) => {
  const rgb = rgbaColor.match(/(\d(\.\d+)?)+/g);
  if (!rgb) {
    return rgbaColor;
  }
  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Color mapping with four different states
export const FourStatusColorMap = {
  default: lightColors.primaryColor,
  error: lightColors.errorColor,
  warning: lightColors.warningColor,
  success: lightColors.successColor,
};