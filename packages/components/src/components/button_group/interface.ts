import React from 'react';
export interface IButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 子元素 */
  children?: React.ReactNode;
  withSeparate?: boolean;
  withBorder?: boolean;
}