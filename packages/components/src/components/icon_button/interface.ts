import React, { ElementType } from 'react';
import { IIconProps } from '@vikadata/icons';

export interface IIconButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 行内样式
   */
  style?: React.CSSProperties;
  /**
   * 形状
   */
  shape?: 'square';
  /**
   * 使用指定的HTML元素来渲染组件
   */
  component?: ElementType;
  /**
   * 类名
   */
  className?: string;
  /**
   * 变体
   */
  variant?: 'default' | 'background' | 'blur';
  /** icon 组件 */
  icon: React.FC<IIconProps>;
  /**
   * icon 大小 16 24
   */
  /** */
  size?: 'small' | 'large';
  /**
   * 响应点击事件
   */
  onClick?: (e: any) => void;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 是否处于激活状态
   */
  active?: boolean;
}

export type IIconButtonWrapperProps = Pick<IIconButtonProps, 'disabled' | 'variant' | 'size' | 'active' | 'shape'>;

