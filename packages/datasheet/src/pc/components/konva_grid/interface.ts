import { ICellValue, IField, RowHeightLevel, ViewType, ThemeName } from '@apitable/core';

// index - size
export type IndicesMap = Record<number, number>;

export type CellMetaDataMap = Record<number, CellMetaData>;

export type CellMetaData = {
  size: number;
  offset: number;
};

export enum ItemType {
  Row = 'Row',
  Column = 'Column',
}

export interface ICoordinate {
  rowCount: number;
  columnCount: number;
  containerWidth: number;
  containerHeight: number;
  rowHeight: number;
  columnWidth: number;
  rowIndicesMap?: IndicesMap;
  columnIndicesMap?: IndicesMap;
  rowInitSize?: number;
  columnInitSize?: number;
  rowHeightLevel?: RowHeightLevel;
}

export interface IGridCoordinate extends ICoordinate {
  frozenColumnCount?: number;
  autoHeadHeight?: boolean;
}

export interface IRenderProps {
  x: number;
  y: number;
  columnWidth: any;
  rowHeight: number;
  recordId: string;
  field: IField;
  cellValue: ICellValue;
  isActive?: boolean;
  editable?: boolean;
  rowHeightLevel: RowHeightLevel;
  style: IRenderStyleProps;
  callback?: ({ width }: { width: number }) => void;
  viewType?: ViewType;
  realField?: IField;
  unitTitleMap?: object;
  cacheTheme: ThemeName;
  currentResourceId?: string
}

export interface IRenderStyleProps {
  color?: string;
  bgColor?: string; // Background color for gantt view
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
}

export interface ICellHeightProps {
  field: IField | null;
  rowHeight: number;
  activeHeight?: number;
  realField?: IField | null;
  isActive?: boolean;
}

export enum FieldHeadIconType {
  Permission = 'Permission',
  Description = 'Description',
  Error = 'Error'
}
