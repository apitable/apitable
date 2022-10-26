import React from 'react';
export interface IButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** child elements */
  children?: React.ReactNode;
  withSeparate?: boolean;
  withBorder?: boolean;
}