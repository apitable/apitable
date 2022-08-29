import { IFontVariants } from 'helper';
import React from 'react';

export interface IDividerProps {
  /**
   * 分割线的方向，水平或者垂直，默认为 horizontal
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * 改动横向分割线文本位置
   */
  textAlign?: 'left' | 'right';

  /**
   * 遵循 Typography 排版
   */
  typography?: IFontVariants;

  /**
   * 是否显示虚线
   */
  dashed?: boolean;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 渲染的节点标签类型，默认为 div 标签
   */
   component?: 'li' | 'hr' | 'div'
}

export interface IDividerStyledType extends IDividerProps {
  hasChildren?: boolean;
}