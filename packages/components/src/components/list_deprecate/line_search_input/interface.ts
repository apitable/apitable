import React from 'react';

export interface ILineSearchInputProps {
  value?: string;
  size?: 'large' | 'small' | 'default';
  placeholder?: string;
  className?: string;
  showCloseIcon?: boolean;
  onChange?(e: React.ChangeEvent): void
  onPressEnter?(e: KeyboardEvent): void
  onFocus?(e: React.FocusEvent): void
  style?: React.CSSProperties;
  showClearIcon?: boolean
  clearClick?(): void;
}

export type IWrapperDivProps = Pick<ILineSearchInputProps, 'size' | 'className'>;
