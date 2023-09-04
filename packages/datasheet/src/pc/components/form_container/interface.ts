import { ICellValue } from '@apitable/core';

export type IFormQuery = Record<string, boolean | string | string[]>;

export type IFormData = Record<string, ICellValue>;
