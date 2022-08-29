import { ISegment } from '@vikadata/core';

export interface ITableCellData {
  value: ISegment[];
  rowSpan: number;
  colSpan: number;
}

export interface ITableData {
  columns?: (number | null)[];
  rows?: (number | null)[];
  data: ITableCellData[][];
  columnCount: number;
  rowCount: number;
}
