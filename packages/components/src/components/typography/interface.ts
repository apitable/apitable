import { IFontVariants } from 'helper';
import { ElementType } from 'react';

export interface ITypographyProps {
  /**
   * 类名
   */
  className?: string;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 使用指定的HTML元素来渲染组件
   */
  component?: ElementType;
  /**
   * 文字颜色
   */
  color?: string;
  /**
   * 对齐方式
   */
  align?: 'inherit' | 'left' | 'right' | 'center';
  /**
   * 应用主题字体样式
   */
  variant?: IFontVariants;
  /**
   * 自动溢出省略
   */
  ellipsis?: IEllipsis | boolean;
  /**
   * tooltips 层级 z-index属性
   */
  tooltipsZIndex?: number;

  onClick?: (e: React.MouseEvent) => void;
}

export interface IEllipsis {
  rows?: number;
  tooltip?: string;
  visible?: boolean;
}