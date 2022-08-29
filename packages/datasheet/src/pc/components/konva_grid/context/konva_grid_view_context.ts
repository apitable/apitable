import {
  ICell, IFieldMap, IFieldPermissionMap, IFieldRanges, IFillHandleStatus, IFilterInfo, IGridViewDragState,
  IGroupInfo, ILinearRow, IPermissions, IRange, IRecordMap, IRecordRanges, ISelection, ISnapshot, ISortInfo,
  IViewColumn, IViewProperty, IViewRow, RecordMoveType, ICollaboratorCursorMap, ThemeName,
} from '@vikadata/core';
import { createContext, Dispatch } from 'react';

export interface IKonvaGridViewContextProps {
  /**
   * 必传参数
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
   * 可选参数
   */
  mirrorId?: string;

  // 排序信息
  sortInfo?: ISortInfo;
  
  // 筛选信息
  filterInfo?: IFilterInfo;

  // 折叠的分组 ID 的集合
  groupCollapseIds?: string[];

  // 视图是否需要手动保存
  isManualSaveView?: boolean;

  // 是否禁止下载附件
  disabledDownload?: boolean;

  // 是否展示评论相关
  allowShowCommentPane?: boolean;

  // 列权限
  fieldPermissionMap?: IFieldPermissionMap;
}

export const KonvaGridViewContext = createContext({} as IKonvaGridViewContextProps);
