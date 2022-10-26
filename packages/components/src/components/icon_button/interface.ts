import React, { ElementType } from 'react';
import { IIconProps } from '@vikadata/icons';

export interface IIconButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;
  /**
   * Button shape
   */
  shape?: 'square';
  /**
   * Use the specified HTML element to render the component
   */
  component?: ElementType;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Variant type
   */
  variant?: 'default' | 'background' | 'blur';
  /** 
   * Icon component
   */
  icon: React.FC<IIconProps>;
  /**
   * Icon size
   */
  size?: 'small' | 'large';
  /**
   * Click callback
   */
  onClick?: (e: any) => void;
  /**
   * Whether disabled or not
   */
  disabled?: boolean;
  /**
   * Whether active or not
   */
  active?: boolean;
}

export type IIconButtonWrapperProps = Pick<IIconButtonProps, 'disabled' | 'variant' | 'size' | 'active' | 'shape'>;

