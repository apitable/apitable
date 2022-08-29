import React from 'react';

export interface IRadio {
  /** 子元素 */
  children?: React.ReactNode;
  /** radio 名称 */
  name?: string;
  /** 是否选中 */
  checked?: boolean,
  /** 监听 Change */
  onChange?: (e: React.ChangeEvent) => void,
  readOnly?: boolean,
  /** 值 */
  value?: any,
  /** 禁用 */
  disabled?: boolean;
  /** 是否使用 Button 样式 */
  isBtn?: boolean;
}

export interface IRadioGroupContext {
  onChange?: (e: React.ChangeEvent) => void;
  value?: any;
  disabled?: boolean;
  name?: string;
  isBtn?: boolean;
}