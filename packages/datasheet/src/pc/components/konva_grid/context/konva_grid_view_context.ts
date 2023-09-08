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

import { createContext, Dispatch } from 'react';
import {
  ICell,
  IFieldMap,
  IFieldPermissionMap,
  IFieldRanges,
  IFillHandleStatus,
  IFilterInfo,
  IGridViewDragState,
  IGroupInfo,
  ILinearRow,
  IPermissions,
  IRange,
  IRecordMap,
  IRecordRanges,
  ISelection,
  ISnapshot,
  ISortInfo,
  IViewColumn,
  IViewProperty,
  IViewRow,
  RecordMoveType,
  ICollaboratorCursorMap,
  ThemeName,
} from '@apitable/core';

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
  dispatch: Dispatch<any>;
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
