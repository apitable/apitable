import React from 'react';
export interface ITextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  className?: string;
  /**
   * Size, default is middle
   */
  size?: 'large' | 'middle' | 'small';
  /**
   * Whether check error ot not
   */
  error?: boolean;
  /**
   * Whether disabled or not
   */
  disabled?: boolean;
  /**
   * Whether use Underline style input
   */
  lineStyle?: boolean;
  /**
   * Prefix icon
   */
  prefix?: React.ReactNode;
  /**
   * Suffix icon
   */
  suffix?: React.ReactNode;
  /**
   * Whether full width or not
   */
  block?: boolean;
  /**
   * Addon component ui after text input
   */
  addonAfter?: React.ReactNode;
  /**
   * Addon component ui before text input
   */
  addonBefore?: React.ReactNode;
  /**
   * The ref ot text input
   */
  wrapperRef?: React.RefObject<HTMLDivElement>;
}