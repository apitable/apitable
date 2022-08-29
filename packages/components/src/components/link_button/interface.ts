
import React, { ElementType } from 'react';

export interface ILinkButtonProps extends React.LinkHTMLAttributes<any> {
  children?: any;
  /**
   * 是否占据整行
   */
  block?: boolean;
  /**
   * 禁用
   */
   disabled?: boolean;
  /**
   * 使用指定的HTML元素来渲染组件
   */
   component?: ElementType;
  /**
   * 前缀 icon 组件。
   */
  prefixIcon?: React.ReactNode;
  /**
   * 后缀 icon 组件。
   */
   suffixIcon?: React.ReactNode;
  /**
   * 跳转链接
   */
  href?: string;
  /**
   * 是否带下划线
   */
  underline?: boolean;
  /**
   * 文字颜色，默认是主题色。
   */
  color?: string;
  /**
   * 指定在何处打开链接的文档
   */
  target?: string;
}