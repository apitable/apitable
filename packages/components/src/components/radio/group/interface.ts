import React from 'react';
import { IRadio } from '../interface';

export interface IRadioGroupOption extends Omit<IRadio, 'children'> {
  label: React.ReactNode;
}

type IRadioGroupAll = {
  /**
   * Arrange by Line
   */
  row?: boolean
  /**
   * Child element
   */
  children?: React.ReactNode;
  /**
   * Selected item
   */
  options?: IRadioGroupOption[];
  /**
   * Selected item value
   */
  value?: any;
  /**
   * Change event listen
   */
  onChange?: (e: React.ChangeEvent, value: any) => void;
  /**
   * Whether disabled or not
   */
  disabled?: boolean;
  /**
   * Radio name
  */
  name?: string;
  /**
   * Whether use button style or not
  */
  isBtn?: boolean;
  /**
   * Whether full width
  */
  block?: boolean;
};

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

/**
 * Row and isBtn are mutually exclusive
 */
export type IRadioGroup = XOR<Omit<IRadioGroupAll, 'row'>, Omit<IRadioGroupAll, 'isBtn'>>;