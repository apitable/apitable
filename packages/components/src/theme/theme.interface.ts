import { ILightOrDarkThemeColors } from 'colors';

export interface IPalette {
  // 主题，根据颜色定下面的配色。
  type: ThemeName;

  common: {
    black: string;
    white: string;
  };

  // 品牌色，用的最多的颜色
  primary: string;

  // 语义化颜色
  success: string;
  danger: string;
  info: string;
  warning: string;

  // 文本颜色（主要的前景色）
  text: {
    primary: string;
    secondary: string;
    third: string;
    fourth: string;
    fifth: string;
    disabled: string;
    hint: string;
  }
  // 文字背景对比度
  contrastThreshold: number;
  // 背景色
  background: {
    // 主要背景色，浅色基本就是全白
    primary: string;
    secondary: string;
    // input输入框背景色
    lowestBg: string;
    // tooltip背景色
    tooltipBg: string;
    // 通用给组件的背景色命名
    modalMask: string;
    // input,select 输入框/选择框背景色
    input: string;
    // 通用蒙层用色，叠加透明度覆盖在原色上。
    mask: string;
    // Divider
    // divider: string;
    iconButton: string;
    // 激活项目的通用背景色
    activeItem: string;
    // 线条的颜色
    border: string;
    // 滚动区域提示按钮
    scrollTip?: string;
  }
  // 以颜色变化体现元素交互状态变化。正常状态颜色 + (蒙层基础色 hex + 蒙层不透明度) 叠加
  // 适用于大部分白底的可交互元素。
  // 1. 下拉选择列表，目录树列表，菜单列表。存在多个相同类型的 item。
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
  // 颜色相关配置(语义化的)
  palette: IPalette;
  // 色板
  color: ILightOrDarkThemeColors;
  // 动画相关配置
  animation?: object;
  // 阴影、模糊效果
  effect?: {
    // 阴影的管理，直接写 [名称]: 对应的 css
    shadows: {
      [key: string]: string;
    },
    // 同上
    blur: {
      [key: string]: string;
    }
  };
  // 组件层级管理
  zIndex?: {};
}

export enum ThemeName {
  Light = 'light',
  Dark = 'dark'
}