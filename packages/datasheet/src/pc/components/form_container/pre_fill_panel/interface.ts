import { ICellValue, IFieldMap, IViewColumn } from '@apitable/core';
import { Dispatch, SetStateAction } from 'react';

export type IFormQuery = Record<string, string | string[]>;

export type IFormData = Record<string, ICellValue>;

export interface IPreFillPanel {
  formData: IFormData;
  fieldMap: IFieldMap;
  setPreFill: Dispatch<SetStateAction<boolean>>;
  columns: IViewColumn[];
}

export interface IShareContent {
  suffix: string;
}
