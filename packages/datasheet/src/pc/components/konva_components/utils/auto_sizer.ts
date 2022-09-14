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
      const line = lines[i];
      const lineWidth = context?.measureText(line).width ?? 0;
      width = Math.max(width, lineWidth);
      lineCount = maxWidth != null ? (Math.ceil(lineWidth / maxWidth) || 1) : 1;
      height += o.lineHeight * lineCount;
    }
    if (
      maxWidth == null || 
      maxLineCount === 1 || 
      (maxLineCount && lineCount <= maxLineCount)
    ) {
      return {
        width: Math.ceil(width),
        height: Math.ceil(height),
        text,
        isOverflow: Boolean(maxLineCount && lineCount > maxLineCount),
        lastLineWidth: Math.ceil(width)
      };
    }

    const arrText = text.split('');
    let rowCount = 0; // 总行数
    let textHeight = 0; // 文字最终占据的高度
    let showText = ''; // 每行显示的文字
    let totalText = '';
    let isLimitRow = false;
    const textLength = arrText.length;

    for (let n = 0; n < textLength; n++) {
      const singleText = arrText[n];
      const composeText = showText + singleText;
      // 没传最大行数，就一直换行
      isLimitRow = maxLineCount ? rowCount === (maxLineCount - 1) : false;
      const measureText = isLimitRow ? (composeText + '…') : composeText;
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
      height: Math.ceil((maxLineCount == null || rowCount < maxLineCount) ? (textHeight + lineHeight) : textHeight),
      text: totalText,
      isOverflow: isLimitRow,
      lastLineWidth: context?.measureText(showText).width ?? 0
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
