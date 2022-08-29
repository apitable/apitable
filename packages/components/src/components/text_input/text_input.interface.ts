import React from 'react';
export interface ITextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  className?: string;
  /**
   * 大小 默认 middle
   */
  size?: 'large' | 'middle' | 'small';
  /**
   * 是否校验错误
   */
  error?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 改成下划线风格的输入框
   */
  lineStyle?: boolean;
  /**
   * 前缀
   */
  prefix?: React.ReactNode;
  /**
   * 后缀
   */
  suffix?: React.ReactNode;
  /**
   * 占满父容器
   */
  block?: boolean;
  /**
   * 带标签的 input，设置后置标签
   */
  addonAfter?: React.ReactNode;
  /**
   * 带标签的 input，设置前置标签
   */
  addonBefore?: React.ReactNode;
  /**
   * TextInput整个容器的ref
   */
  wrapperRef?: React.RefObject<HTMLDivElement>;
}