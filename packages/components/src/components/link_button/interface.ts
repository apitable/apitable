
import React, { ElementType } from 'react';

export interface ILinkButtonProps extends React.LinkHTMLAttributes<any> {
  children?: any;
  /**
   * Whether full width
   */
  block?: boolean;
  /**
   * Whether disabled or not
   */
   disabled?: boolean;
  /**
   * Use the specified HTML element to render the component
   */
   component?: ElementType;
  /**
   * Prefix icon component
   */
  prefixIcon?: React.ReactNode;
  /**
   * Suffix icon component
   */
   suffixIcon?: React.ReactNode;
  /**
   * link href
   */
  href?: string;
  /**
   * Whether with underline or not
   */
  underline?: boolean;
  /**
   * Text color, default is primary color
   */
  color?: string;
  /**
   * Specify how to open the link
   */
  target?: string;
}