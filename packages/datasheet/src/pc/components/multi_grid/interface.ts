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
