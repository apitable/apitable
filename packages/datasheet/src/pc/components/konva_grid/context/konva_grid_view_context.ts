import {
  ICell, IFieldMap, IFieldPermissionMap, IFieldRanges, IFillHandleStatus, IFilterInfo, IGridViewDragState,
  IGroupInfo, ILinearRow, IPermissions, IRange, IRecordMap, IRecordRanges, ISelection, ISnapshot, ISortInfo,
  IViewColumn, IViewProperty, IViewRow, RecordMoveType, ICollaboratorCursorMap, ThemeName,
} from '@apitable/core';
import { createContext, Dispatch } from 'react';

export interface IKonvaGridViewContextProps {
  /**
   * Required parameters
   */
  datasheetId: string;
  visibleColumns: IViewColumn[];
  fieldMap: IFieldMap;
  recordMap: IRecordMap;
  linearRows: ILinearRow[];
  visibleRows: IViewRow[];
  recordRanges: IRecordRanges | undefined;
  rowsIndexMap: Map<string, number>;
  visibleRowsIndexMap: Map<string, number>;
  activeCell: ICell | null;
  selectRanges: IRange[];
  fillHandleStatus: IFillHandleStatus | undefined;
  gridViewDragState: IGridViewDragState;
  groupInfo: IGroupInfo;
  view: IViewProperty;
  permissions: IPermissions;
  unitTitleMap?: object;
  cacheTheme: ThemeName;
  isSearching: boolean;
  snapshot: ISnapshot;
  fieldIndexMap: Map<string, number>;
  currentSearchCell: string | [string, string] | undefined;
  selection: ISelection | null | undefined;
  dispatch: Dispatch<any>,
  selectRecordIds: string[];
  recordMoveType: RecordMoveType;
  fieldRanges?: IFieldRanges;
  isEditing: boolean;
  visibleRecordIds: string[];
  groupBreakpoint: any;
  collaboratorCursorMap: ICollaboratorCursorMap;

  /**
   * Optional parameters
   */
  mirrorId?: string;

  // Sorting Information
  sortInfo?: ISortInfo;
  
  // Filter information
  filterInfo?: IFilterInfo;

  // Collapsed set of group IDs
  groupCollapseIds?: string[];

  // Whether the view needs to be saved manually
  isManualSaveView?: boolean;

  // Whether to prohibit the download of attachments
  disabledDownload?: boolean;

  // Whether to show comments
  allowShowCommentPane?: boolean;

  // Field Permissions
  fieldPermissionMap?: IFieldPermissionMap;
}

export const KonvaGridViewContext = createContext({} as IKonvaGridViewContextProps);
