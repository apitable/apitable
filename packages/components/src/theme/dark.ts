import { black, blackBlue, deepPurple, darkColors, orange, red, teal } from '../colors';
import { ITheme, ThemeName } from './theme.interface';

// 这个套 dark 没配好。
export const dark: ITheme = {
  color: darkColors,
  palette: {
    type: ThemeName.Dark,
    common: {
      white: '#fff',
      black: '#000',
    },
    primary: deepPurple[300],
    // 语义化颜色
    success: teal[300],
    danger: red[300],
    warning: orange[300],
    info: deepPurple[300],
    // contrastThreshold: 3,
    text: {
      // 一级主色
      primary: blackBlue[100],
      // 二级.
      secondary: blackBlue[200],
      // 三级
      third: blackBlue[300],
      // 四级
      fourth: black[300],
      // 五级（白色）
      fifth: black[50],
      disabled: 'rgba(0, 0, 0, 0.38)',
      // Text hints.
      hint: 'rgba(0, 0, 0, 0.38)',
    },
    contrastThreshold: 3,
    action: {
      hover: '#fff',
      hoverOpacity: 0.08,
      active: '#fff',
      activatedOpacity: 0.24,
      selected: '#fff',
      selectedOpacity: 0.16,
      disabled: '#fff',
      disabledOpacity: 0.5,
      focus: '#fff',
      focusOpacity: 0.24,
    },
    background: {
      primary: black[1000],
      secondary: black[900],
      modalMask: black[900],
      input: black[900],
      iconButton: black[800],
      mask: blackBlue[50],
      activeItem: deepPurple[500],
      lowestBg: black[100],
      tooltipBg: black[900],
      border: blackBlue[200],
      // scrollTip: '51, 51, 51',
    },
  }
};
