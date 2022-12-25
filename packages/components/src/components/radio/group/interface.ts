/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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