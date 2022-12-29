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