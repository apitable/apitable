import { IFontVariants } from 'helper';
import React from 'react';

export interface IDividerProps {
  /**
   * The direction of the split line, horizontal or vertical, the default is horizontal
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Horizontal split line text position
   */
  textAlign?: 'left' | 'right';

  /**
   * Follow Typography component layout
   */
  typography?: IFontVariants;

  /**
   * whether show the split line
   */
  dashed?: boolean;

  /**
   * custom inline styles
   */
  style?: React.CSSProperties;

  /**
   * custom class name
   */
  className?: string;

  /**
   * The rendered node html type, which defaults to div tag
   * 
   */
   component?: 'li' | 'hr' | 'div'
}

export interface IDividerStyledType extends IDividerProps {
  hasChildren?: boolean;
}