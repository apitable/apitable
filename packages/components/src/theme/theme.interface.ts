import { ILightOrDarkThemeColors } from 'colors';

export interface IPalette {
  /**
   * Theme type
   */
  type: ThemeName;

  common: {
    black: string;
    white: string;
  };

  // Primary color
  primary: string;

  // Semantic colors
  success: string;
  danger: string;
  info: string;
  warning: string;

  // Text colors
  text: {
    primary: string;
    secondary: string;
    third: string;
    fourth: string;
    fifth: string;
    disabled: string;
    hint: string;
  }
  // Text background contrast
  contrastThreshold: number;
  background: {
    primary: string;
    secondary: string;
    lowestBg: string;
    tooltipBg: string;
    modalMask: string;
    input: string;
    mask: string;
    iconButton: string;
    activeItem: string;
    border: string;
    scrollTip?: string;
  }
  action: {
    active: string;
    activatedOpacity: number;
    hover: string;
    hoverOpacity: number;
    selected: string;
    selectedOpacity: number;
    disabled: string;
    disabledOpacity: number;
    focus: string;
    focusOpacity: number;
  }
}

export interface ITheme {
  palette: IPalette;
  color: ILightOrDarkThemeColors;
  animation?: object;
  effect?: {
    shadows: {
      [key: string]: string;
    },
    blur: {
      [key: string]: string;
    }
  };
  zIndex?: {};
}

export enum ThemeName {
  Light = 'light',
  Dark = 'dark'
}