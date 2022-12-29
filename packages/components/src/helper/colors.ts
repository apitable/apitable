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
 * FIXME: If import {colors} from './colors'. theme does not cause the React component to re render.
 * For the time being, the original calling method should be compatible.
 * 
 * Finally, the color variables referenced in js should be obtained from the theme through useTheme hook.
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

