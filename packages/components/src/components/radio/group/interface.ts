import React from 'react';
import { IRadio } from '../interface';

export interface IRadioGroupOption extends Omit<IRadio, 'children'> {
  label: React.ReactNode;
}

type IRadioGroupAll = {
  /** 是否按照行排列 */
  row?: boolean
  /** 子元素 */
  children?: React.ReactNode;
  /** 选项 */
  options?: IRadioGroupOption[];
  /** 选中值 */
  value?: any;
  /** 监听 Change */
  onChange?: (e: React.ChangeEvent, value: any) => void;
  /** 禁用 */
  disabled?: boolean;
  /** radio 名称 */
  name?: string;
  /** 是否使用 Button 样式 */
  isBtn?: boolean;
  /** 是否占据整行 */
  block?: boolean;
};

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

// row、isBtn 互斥
export type IRadioGroup = XOR<Omit<IRadioGroupAll, 'row'>, Omit<IRadioGroupAll, 'isBtn'>>;