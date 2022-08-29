import { ThemeName } from 'theme';
import { darkColors, lightColors } from '../colors';

export const getThemeName = (): ThemeName => {
  if (process.env.SSR) {
    return ThemeName.Light;
  }
  const html = document.querySelector('html');
  if (!html) return ThemeName.Light;
  if (html.getAttribute('data-theme') === ThemeName.Light) return ThemeName.Light;
  if (html.getAttribute('data-theme') === ThemeName.Dark) return ThemeName.Dark;
  return ThemeName.Light;
};

const colorHandler = {
  get: function(obj: any, prop: keyof any) {
    const theme = getThemeName();
    const color = theme.includes(ThemeName.Light) ? lightColors : darkColors;
    return color[prop];
  }
};

/**
 * FIXME: 如果是采用 import {colors} from './colors' 主题的切换并不会引起 React 组件重新渲染。暂时先兼容原来的调用方式。
 * 最后 js 中引用颜色变量，应该都是通过 useTheme hook 从主题中获取。
 */
export const colors = new Proxy(lightColors, colorHandler) as any;

const tempColorVars = {};
for (const key in lightColors) {
  const val = lightColors[key];
  if (typeof val === 'string') {
    tempColorVars[key] = `var(--${key})`;
  } else {
    if (!tempColorVars[key]) {
      tempColorVars[key] = {};
    }
    for (const vKey in val) {
      tempColorVars[key][vKey] = `var(--${key}_${vKey})`;
    }
  }
}

export const colorVars = tempColorVars as typeof lightColors;

export const getThemeColors = () => {
  const theme = getThemeName();
  return theme.includes(ThemeName.Light) ? lightColors : darkColors;
};

