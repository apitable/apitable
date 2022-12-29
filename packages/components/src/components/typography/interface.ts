import { IFontVariants } from 'helper';
import { ElementType } from 'react';

export interface ITypographyProps {
  /**
   * class name
   */
  className?: string;
  /**
   * inline style
   */
  style?: React.CSSProperties;
  /**
   * Specify HTML elements to render components
   */
  component?: ElementType;
  /**
   * text color
   */
  color?: string;
  /**
   * Alignment
   */
  align?: 'inherit' | 'left' | 'right' | 'center';
  /**
   * Apply several font styles
   */
  variant?: IFontVariants;
  /**
   * Whether overflow is ellipsis
   */
  ellipsis?: IEllipsis | boolean;
  /**
   * Set tooltip z-index
   */
  tooltipsZIndex?: number;

  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export interface IEllipsis {
  rows?: number;
  tooltip?: string;
  visible?: boolean;
}