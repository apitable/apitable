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

import {
  FieldOperateType, ICell, IFieldRanges, IFillHandleStatus, IGridViewColumn, IGridViewDragState, IGridViewProperty, ILinearRow, IPermissions, IRange,
  ISnapshot, IViewRow, RecordMoveType
} from '@apitable/core';
import * as React from 'react';

export interface IMultiGridStateProps {
  datasheetId: string;
  view: IGridViewProperty;
  snapshot: ISnapshot;
  selection: IRange[];
  columnCount: number;
  columns: IGridViewColumn[];
  frozenColumns: IGridViewColumn[];
  exceptFrozenColumns: IGridViewColumn[];
  rowHeight: number;
  gridViewDragState: IGridViewDragState;
  activeFieldId: string;
  viewId: string;
  activeCell: ICell | null;
  recordMoveType: RecordMoveType;
  fieldRanges: IFieldRanges | null | undefined;
  fillHandleStatus: IFillHandleStatus | null | undefined;
  permissions: IPermissions;
  activeFieldOperateType: FieldOperateType | null;
  isEditing: boolean;
  gridViewHoverFieldId: string | null;
}

export interface IMultiGridOwnStateProps {
  quickAppendBtnTop: number;
  quickAppendToolLength: number;
  scrolling: boolean;
  scrollTop: number;
  scrollLeft: number;
}

export interface IMultiGridOwnProps {
  height: number;
  width: number;
  rows: IViewRow[];
  linearRows: ILinearRow[];
  rowCount: number;
  refs?: React.RefObject<HTMLDivElement>;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onContextMenu?: () => void;
}

export interface IScrollToItemParams {
  align?: 'auto' | 'smart' | 'center' | 'end' | 'start';
  rowIndex?: number;
  columnIndex?: number;
}

export type IMultiGridProps = IMultiGridStateProps & IMultiGridOwnProps;
