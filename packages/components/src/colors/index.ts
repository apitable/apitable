import * as _lightColors from './light';
import * as _darkColors from './dark';
export * from './base';
import * as baseColors from './base';
export * as baseColors from './base';
export interface IColor {
  [shade: number]: string;
}

// FIXME:THEME
const lightMaskColor = {
  lightMaskColor: 'rgba(38,38,38,0.1)'
};

export const lightColors = { ..._lightColors, ...baseColors, ...lightMaskColor };
export const darkColors = { ..._darkColors, ...baseColors, ...lightMaskColor };

// Collection of lightColors and darkColors
const colors = { ...lightColors, ...darkColors };

export type IThemeColors = typeof colors;

export type ILightOrDarkThemeColors = typeof lightColors | typeof darkColors;