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

export interface IAutoSizer {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: number;
  scale?: number;
}

export const castToString = (value: any): string | null => {
  if (value == null) {
    return null;
  }
  return typeof value !== 'string' ? String(value) : value;
};

export const AutoSizerCanvas = (defaults: IAutoSizer = {}) => {
  const {
    fontFamily = `'Segoe UI', Roboto, 'Helvetica Neue', Arial, 
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    fontSize = 13,
    fontWeight = 'normal',
    fontStyle = 'normal',
    lineHeight = 24,
    scale = 1,
  } = defaults;
  const o: Required<IAutoSizer> = {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    lineHeight,
    scale,
  };
  const canvas = process.env.SSR ? null : document.createElement('canvas');
  const context = canvas ? canvas.getContext('2d') : null;

  const normalizeFontFamily = (fontFamily: string) => {
    return fontFamily
      .split(',')
      .map((family) => {
        family = family.trim();
        const hasSpace = family.indexOf(' ') >= 0;
        const hasQuotes = family.indexOf('"') >= 0 || family.indexOf("'") >= 0;
        if (hasSpace && !hasQuotes) {
          family = `"${family}"`;
        }
        return family;
      })
      .join(', ');
  };

  const setFont = (options: IAutoSizer = {}) => {
    for (const key in options) {
      o[key] = options[key] ?? o[key];
    }
    if (context) {
      context.font = `${o.fontWeight} ${o.fontSize * o.scale}px ${normalizeFontFamily(o.fontFamily)}`;
    }
  };

  const getWidthOfLongestText = (text: string | null, maxWidth?: number, maxLineCount?: number) => {
    let width = 0;
    let height = 0;
    let lineCount = 0;
    if (text == null) {
      return { width, height, lastLineWidth: 0 };
    }
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      const lineWidth = context?.measureText(line).width ?? 0;
      width = Math.max(width, lineWidth);
      lineCount = maxWidth != null ? Math.ceil(lineWidth / maxWidth) || 1 : 1;
      height += o.lineHeight * lineCount;
    }
    if (maxWidth == null || maxLineCount === 1 || (maxLineCount && lineCount <= maxLineCount)) {
      return {
        width: Math.ceil(width),
        height: Math.ceil(height),
        text,
        isOverflow: Boolean(maxLineCount && lineCount > maxLineCount),
        lastLineWidth: Math.ceil(width),
      };
    }

    const arrText = text.split('');
    let rowCount = 0; // Total number of rows
    let textHeight = 0; // The height that the text eventually occupies
    let showText = ''; // Text displayed per line
    let totalText = '';
    let isLimitRow = false;
    const textLength = arrText.length;

    for (let n = 0; n < textLength; n++) {
      const singleText = arrText[n]!;
      const composeText = showText + singleText;
      // If you don't pass the maxLineCount, you keep changing lines
      isLimitRow = maxLineCount ? rowCount === maxLineCount - 1 : false;
      const measureText = isLimitRow ? composeText + '…' : composeText;
      totalText += singleText;
      const textWidth = context?.measureText(measureText).width ?? 0;
      const isLineBreak = ['\n', '\r'].includes(singleText);
      if (((maxWidth && textWidth > maxWidth) || isLineBreak) && (maxLineCount == null || rowCount < maxLineCount)) {
        showText = isLineBreak ? '' : singleText;
        textHeight += lineHeight;
        rowCount++;
        if (isLimitRow) {
          if (n < textLength - 1) {
            totalText = totalText.substring(0, totalText.length - 1) + '…';
          }
          break;
        }
      } else {
        showText = composeText;
      }
    }
    return {
      width: Math.ceil(width),
      height: Math.ceil(maxLineCount == null || rowCount < maxLineCount ? textHeight + lineHeight : textHeight),
      text: totalText,
      isOverflow: isLimitRow,
      lastLineWidth: context?.measureText(showText).width ?? 0,
    };
  };

  const measureText = (text: React.ReactText, maxWidth?: number, maxLineCount?: number) => {
    return getWidthOfLongestText(castToString(text), maxWidth, maxLineCount);
  };

  const reset = () => setFont(defaults);
  setFont(o);

  return {
    context,
    measureText,
    setFont,
    reset,
  };
};

export const autoSizerCanvas = AutoSizerCanvas();
