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

import { ICellValue, IField, RowHeightLevel, ViewType, ThemeName, IPermissions } from '@apitable/core';

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
  permissions?: IPermissions| {},
  style: IRenderStyleProps;
  callback?: ({ width }: { width: number }) => void;
  viewType?: ViewType;
  realField?: IField;
  unitTitleMap?: object;
  cacheTheme: ThemeName;
  currentResourceId?: string;
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
  Error = 'Error',
}
