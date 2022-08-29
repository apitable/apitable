import { ISelectFieldBaseOpenValue } from '@vikadata/core';
import { CSSProperties } from 'react';

export interface IOptionItem {
  bg: string;
  text: string;
  textColor: string;
  className?: string;
  style?: CSSProperties;
}

export type ISelectOptions = ISelectFieldBaseOpenValue | ISelectFieldBaseOpenValue[];

export interface IOption {
  id: string;
  name: string;
  color: number;
}

export interface ICellOptions {
  options: IOption[];
  selectOptions: ISelectOptions | null;
  className?: string;
  style?: CSSProperties;
  cellClassName?: string;
  cellStyle?: CSSProperties;
}