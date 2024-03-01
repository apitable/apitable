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

import { IRemoteChangeset } from 'engine/ot';
import { StatType } from 'model/field/stat';
import { ICellValue } from 'model/record';
import { FillDirection, ICell, IFieldRanges, IRange, IRecordRanges } from 'model/view/range';
import { IField, IStandardValue } from 'types/field_types';
import { IFilterInfo, IGroupInfo, ISortedField, ISortInfo } from 'types/view_types';
import { IUnitValue, IUserValue } from 'exports/store/interfaces';
import { CellType, GalleryStyleKeyType, LayoutType, RowHeightLevel, ViewType, WhyRecordMoveType } from 'modules/shared/store/constants';

import * as actions from '../../../../../shared/store/action_constants';
import {
  CalendarColorType,
  CalendarStyleKeyType,
  GanttColorType,
  GanttStyleKeyType,
  OrgChartStyleKeyType,
  RecordMoveType,
} from '../../../../../shared/store/constants';
import { IPermissions, Role } from '../../../../../space/store/interfaces/catalog_tree';
import {
  ICalendarViewStatus,
  IGanttViewStatus,
  IGridViewActiveFieldState,
  IGridViewDragState,
  IKanbanViewStatus,
  IOrgChartViewStatus,
  ISearchResult,
  IWidgetPanelStatus,
} from './client';

export interface ISnapshot {
  meta: IMeta;
  recordMap: IRecordMap;
  datasheetId: string;
}

/**
 *
 * the minium context snapshot that use the part of table cells.
 *
 * fieldMap, it can pass by less data. 1 or more, no need to contain the full datasheet's fields.
 * recordMap, it can pass by less data. 1 or more, no need to contains the full of datasheet's records.
 *
 */
export interface IRecordSnapshot {
  meta: { fieldMap: IFieldMap };
  recordMap: IRecordMap;
  datasheetId?: string;
}

export interface IRecordMap {
  [recordId: string]: IRecord;
}

export interface IFieldMap {
  [fieldId: string]: IField;
}

export interface IWidgetPanel {
  id: string;
  name: string;
  widgets: IWidgetInPanel[];
}

export interface IWidgetInPanel {
  id: string;
  height: number;
  y: number;
}

export interface IMeta {
  fieldMap: IFieldMap;
  views: IViewProperty[];
  widgetPanels?: IWidgetPanel[];
  archivedRecordIds?: string[];
}

export interface IRecordCellValue {
  [fieldId: string]: ICellValue;
}

export interface IFieldUpdatedValue {
  at?: number;
  by?: string;
  autoNumber?: number;
}

export interface IFieldUpdatedMap {
  [fieldId: string]: IFieldUpdatedValue;
}

export interface IFieldExtraMapValue {
  alarm?: IRecordAlarm;
}

export interface IFieldExtraMap {
  [fieldId: string]: IFieldExtraMapValue;
}

export interface IRecordMeta {
  fieldUpdatedMap?: IFieldUpdatedMap;
  fieldExtraMap?: IFieldExtraMap;
  createdAt?: Date | number;
  updatedAt?: Date | number;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * IRecord, the base data record
 */
export interface IRecord {
  id: string;

  /**
   *
   * the data inside the record
   * only the record's some fields with content, `data` will contains the field's fieldId key
   */
  data: IRecordCellValue;

  /**
   * the number of records' comments
   *
   * @type {number}
   */
  commentCount: number;

  /**
   * optional, return all comments of current record by api request
   * @type {IComments[]}
   */
  comments?: IComments[];

  changesets?: IRemoteChangeset[];

  /**
   * @type: timestamp
   * @desc: the timestamp that be deleted
   */
  deleteAt?: number;

  /**
   * the meta of record.
   * infos of createdAt/updatedAt/createdBy/updatedBy and fieldUpdatedMap
   */
  recordMeta?: IRecordMeta;

  /**
   * this array saves the original operation's revisions.
   * the index of array is current record's revision.
   *
   * this field is designed for the feature "change history"
   *
   * every datasheet's modification will produce a new changeset, which maps to on revision(modification version number)
   *
   * for example:
   * - I modify the row `1`, revision `1`
   * - I modify the row `2`, revision `2`
   * - I modify the row `1` again, revision `3`
   * so, the row `1` record's revisionHistory array is [1, 3]
   * the row `2` record's revisionHistory array is [2]
   *
   * when user mouse click and expand the row records `1`, system will read revisionHistory array [1, 3], and get the specified changesets.
   * then show the changeset result on the comments UI panel area.
   *
   * server's storage and broadcast revision must assign the field.
   * client's record don't need this field.
   *
   */
  revisionHistory?: number[];

  /**
   * @type: timestamp
   * the timestamp that created
   */
  createdAt?: number;

  /**
   * @type: timestamp
   * the timestamp that last modified
   */
  updatedAt?: number;
}

export interface IComments {
  revision: number;
  /**
   * the timestamp that created
   * @type {number}
   */
  createdAt: number;

  /**
   * current comment's ID
   * @type {string}
   */
  commentId: string;

  /**
   * the comment creator's userId  (unit is an abstract struct that means team or user)
   * @type {string}
   */
  unitId: string;

  /**
   * comment's detail message
   * @type {ICommentMsg}
   */
  commentMsg: ICommentMsg;

  /**
   * update time, preserve for the editable comments
   * @type {number}
   */
  updatedAt?: number;
}

export interface ICommentMsg {
  /**
   * editor type
   * @type {string}
   */
  type: string;

  /**
   * documentation format
   * @type {string}
   */
  content: any;

  /**
   * rich text editor, html language format
   * @type {string}
   */
  html: string;

  /**
   * replies for the comment
   * @type {any}
   */
  reply?: any;

  /**
   * emoji for the comment
   * @type {any}
   */
  emojis?: {
    [emojiKey: string]: string[];
  };
}

export interface IStandardValueTable {
  datasheetId?: string;
  viewId?: string;
  header: IField[];
  body: IStandardValue[][];
  recordIds?: string[];
}

/**
 * a set(or map) that stores multiple datasheets.
 */
export interface IDatasheetMap {
  [datasheetId: string]: IDatasheetPack;
}

export interface INodeMeta {
  id: string;
  name: string;
  description: string;
  parentId: string;
  icon: string;
  extra?: {
    showRecordHistory?: boolean;
  };
  nodeShared: boolean;
  nodePermitSet: boolean;
  nodeFavorite?: boolean;
  nodePrivate?: boolean;
  spaceId: string;
  role: Role;
  permissions: IPermissions;
  revision: number;
  isGhostNode?: boolean;
  activeView?: string;
}

export interface IDatasheetState extends INodeMeta {
  /**
   * current active view.
   * special field, it doesn't do anything about collaboration and persistence.
   * but it has special relation to the datasheet's rendering, so put it here.
   */
  activeView: string;

  /**
   * snapshot, includes all data that use to render the table
   */
  snapshot: ISnapshot;

  /**
   *
   * whether the current datasheet is partial loaded. (includes only part of data)
   * also can be used to judge whether the current datasheet is loaded by a related datasheet.
   *
   * When we load related-field's data, we can only load the related-datasheet's records(rows) that related to the current datasheet.
   */
  isPartOfData?: boolean;

  /**
   * the field to indicate the data source of datasheet.
   *
   * if you just open datasheet and load it, it will not have `sourceId`.
   *
   * this field is used for feature "form". when the related data loaded, it will not affect the next open datasheet's permission and data
   * when this field is not empty (`sourceId` exists), it means this data is not loaded by original datasheet
   * so, after open the original datasheet, it will reload all relevant data.
   *
   */
  sourceId?: string;

  /**
   * a flag for whether current datasheet is a preview data that rolling back from time machine.
   * and show the current preview of version number.
   *
   * OPTIMIZE: the field is a number.
   */

  preview?: string;
  type?: string;
}

export interface ILoadingRecord {
  [recordId: string]: boolean | 'error';
}

export interface IActiveUpdateRowInfo {
  type: WhyRecordMoveType.UpdateRecord;
  positionInfo: {
    fieldId: string;
    recordId: string;
    visibleRowIndex: number;
    isInit: boolean;
  };
  recordSnapshot: IRecordSnapshot;
}

export interface IActiveNewRowInfo {
  type: WhyRecordMoveType.NewRecord;
  positionInfo: {
    recordId: string;
    visibleRowIndex: number;
    isInit: boolean;
  };
  recordSnapshot: IRecordSnapshot;
}

export type IActiveRowInfo = IActiveUpdateRowInfo | IActiveNewRowInfo;

export interface IViewDerivation {
  // The map of the original row order of the view.
  rowsIndexMap: Map<string, number>;

  rowsWithoutSearch: IViewRow[];

  // Visible row data.
  visibleRows: IViewRow[];

  // A map with recordId as key and order as value.
  visibleRowsIndexMap: Map<string, number>;

  // Pre-sorted or delayed sorted move types.
  recordMoveType?: RecordMoveType;

  // Row order data after view property calculation.
  pureVisibleRows: IViewRow[];

  // map of the row order data after the view property is calculated.
  pureVisibleRowsIndexMap: Map<string, number>;

  // Kanban middle properties.
  kanbanGroupMap?: { [key: string]: IRecord[] };

  // Search Results.
  searchResults?: ISearchResult;
  // Grouping breakpoint data.
  /**
   * groupBreakpoint
   * field1 grouping breakpoint 0---------10---------20
   * field2 level grouping breakpoint 0--3-5-6--10----15---20
   *
   * field1: [0, 10, 20]
   * field2: [0, 3, 5, 6, 10, 15, 20]
   */
  groupBreakpoint?: { [key: string]: number[] };

  /**
   * Guide the table view to draw the structured data of the table,
   * with the hierarchical structure reflected by depth.
   * [
   *    Blank 0
   *    GroupTab 0
   *      GroupTab 1
   *        GroupTab 2
   *          Record 3
   *        Add 2
   *        Blank 2
   *      Blank 1
   *    Blank 0
   * ]
   */
  linearRows?: ILinearRow[];

  /**
   * [`${row.type}_${row.recordId}`, index]
   */
  linearRowsIndexMap?: Map<string, number>;

  // Uncollapsed UI grouped row data.
  pureLinearRows?: ILinearRow[];

  // Grouped rows of data for album view.
  galleryGroupedRows?: string[][];
}

export interface IDatasheetClientState {
  collaborators?: ICollaborator[];

  /**
   * the states of grouping collapsed.
   */
  groupingCollapseIds?: string[];
  kanbanGroupCollapse?: string[];
  gridViewDragState: IGridViewDragState;
  gridViewActiveFieldState: IGridViewActiveFieldState;
  selection?: ISelection | null;
  isEditingCell?: { fieldId: string; recordId: string } | null;
  loadingRecord: { [recordId: string]: boolean | 'error' };
  searchKeyword?: string;
  theme?: string;
  searchResultCursorIndex: number;
  activeRowInfo?: IActiveRowInfo;
  widgetPanelStatus: IWidgetPanelStatus;
  ganttViewStatus: IGanttViewStatus;
  calendarViewStatus: ICalendarViewStatus;
  orgChartViewStatus: IOrgChartViewStatus;
  kanbanViewStatus: IKanbanViewStatus;
  gridViewHoverFieldId: string | null;
  newRecordExpectIndex: number | null;
  closeSyncViewIds?: string[];
  highlightFiledId: number | null;
  isRobotPanelOpen?: boolean;
  operateViewIds?: string[] | null;
  isTimeMachinePanelOpen?: boolean;
  isCopilotPanelOpen?: boolean;
  isArchivedRecordsPanelOpen?: boolean;
  exportViewId?: string | null;
  // View-derived data, all content obtained by calculation, is uniformly maintained here.
  viewDerivation: { [viewId: string]: IViewDerivation };
}

export interface INetworking {
  /**
   * the loading state of datasheet's data.
   */
  loading: boolean;
  connected: boolean;
  syncing: boolean;
  errorCode?: number | null;
}

export interface IComputedInfo {
  pureVisibleRows?: IViewRow[];
  visibleColumns?: IViewColumn[];
  searchResultArray?: ISearchResult;
  linearRows?: ILinearRow[];
  groupBreakpoint?: any[];
}

export interface IComputedStatus {
  searching?: boolean;
  grouping?: boolean;
  filtering?: boolean;
  sorting?: boolean;
  computing?: boolean;
}

export interface IDatasheetPack {
  /**
   * the loading state of datasheet's data
   */
  loading: boolean;

  /**
   *
   * whether datasheet connected?
   *
   * the difference between `datasheet connected` and `space connected` is that,
   * if datasheet connected, then we can be sure that datasheet is watched successfully.
   *
   * but, `space connected`, only means the `socket.io` is connected.
   *
   */
  connected: boolean;
  syncing: boolean;
  datasheet: IDatasheetState | null;
  errorCode?: number | null;

  /**
   * some states that need to client-side maintain,
   * will not persistence
   */
  client?: IDatasheetClientState;

  /**
   * the information for current datasheet's field(column) permissions and privileges.
   */
  fieldPermissionMap?: IFieldPermissionMap;
  computedInfo?: IComputedInfo;
  computedStatus?: IComputedStatus;
}

export type ITemporaryView = Partial<Omit<IViewProperty, 'id' | 'type' | 'rows'>>;

export interface IFieldRoleSetting {
  formSheetAccessible: boolean;
}

export interface IFieldPermission {
  editable: boolean;
  readable: boolean;
}

export interface IFieldPermissionInfo {
  role: Role;
  setting: IFieldRoleSetting;
  permission: IFieldPermission;
  manageable: boolean;
}

export interface IFieldPermissionMap {
  [fieldId: string]: IFieldPermissionInfo;
}

export interface IDatasheetFieldPermission {
  nodeId: string;
  datasheetId: string;
  fieldPermissionMap: IFieldPermissionMap;
}

/**
 * the basic data structure of datasheet
 */
export interface IBaseDatasheetPack {
  snapshot: ISnapshot;
  datasheet: INodeMeta;
  fieldPermissionMap?: IFieldPermissionMap;
}

/**
 * the set of related datasheets
 */
export interface IForeignDatasheetMap {
  foreignDatasheetMap?: { [foreignDatasheetId: string]: IBaseDatasheetPack };
}

/**
 * member's data structure
 */
export interface IDatasheetUnits {
  units?: (IUnitValue | IUserValue)[];
}

/**
 * single view data structure
 */
export interface IViewPack {
  view: IViewProperty;
  revision: number;
}

/**
 * the data structure from server-side datasheet pack.
 */
export type IServerDatasheetPack = IBaseDatasheetPack & IForeignDatasheetMap & IDatasheetUnits;

/**
 * the data structure comes from the server's getRecords API
 */
export interface IGetRecords {
  revision: number;
  recordMap?: IRecordMap;
}

export interface ISetNodeIcon {
  type: typeof actions.SET_NODE_ICON;
  payload: string;
}

export interface IViewColumn {
  fieldId: string;
  hidden?: boolean;
}

export interface IViewRow {
  recordId: string;
  hidden?: boolean;
}

export interface INodeDescription {
  type: string;
  render: string;
  data: any;
}

/**
 * the data structure of `view lock`
 */
export interface IViewLockInfo {
  description?: string;
  unitId: string;
}

export interface IViewPropertyBase {
  id: string;
  name: string;
  type: ViewType;
  rows: IViewRow[];
  columns: IViewColumn[];

  /**
   * whether the configuration of the view will auto save.
   */
  autoSave?: boolean;

  description?: string;
  hidden?: boolean;
  filterInfo?: IFilterInfo;
  sortInfo?: ISortInfo;
  lockInfo?: IViewLockInfo;

  /**
   * @desc The hidden fields of the original table can be optionally displayed in the mirrored table.
   * @default false
   */
  displayHiddenColumnWithinMirror?: boolean;
}

export interface IGridViewColumn extends IViewColumn {
  width?: number;
  statType?: StatType;
}

export interface IGanttViewColumn extends IGridViewColumn {
  hiddenInGantt?: boolean;
}

export interface ICalendarViewColumn extends IGridViewColumn {
  hiddenInCalendar?: boolean;
}

export interface IOrgChartViewColumn extends IGridViewColumn {
  hiddenInOrgChart?: boolean;
}

export interface IGridViewProperty extends IViewPropertyBase {
  id: string;
  type: ViewType.Grid;
  columns: IGridViewColumn[];
  frozenColumnCount: number;
  rowHeightLevel?: RowHeightLevel;
  autoHeadHeight?: boolean;
  groupInfo?: IGroupInfo;
}

export interface ICalendarViewStyle {
  startFieldId: string;
  endFieldId: string;
  isColNameVisible: boolean;
  colorOption: {
    type: GanttColorType;
    fieldId: string;
    color: number;
  };
}

export interface ICalendarViewProperty extends IViewPropertyBase {
  id: string;
  type: ViewType.Calendar;
  columns: ICalendarViewColumn[];
  frozenColumnCount: number;
  rowHeightLevel?: RowHeightLevel;
  groupInfo?: IGroupInfo;
  style: ICalendarViewStyle;
}

export interface IGalleryViewStyle {
  layoutType: LayoutType;

  /**
   * if true, cardCount will invalid.
   */
  isAutoLayout: boolean;
  cardCount: number;
  coverFieldId?: string;
  isCoverFit: boolean;
  isColNameVisible?: boolean;
}

export interface IOrgChartViewStyle {
  coverFieldId?: string;
  isCoverFit: boolean;
  isColNameVisible?: boolean;
  linkFieldId: string;
  horizontal: boolean;
}

export interface IGalleryViewProperty extends IViewPropertyBase {
  type: ViewType.Gallery;
  columns: IOrgChartViewColumn[];
  style: IGalleryViewStyle;
  groupInfo?: IGroupInfo;
}

export interface IGanttViewStyle {
  startFieldId: string;
  endFieldId: string;
  colorOption: {
    type: GanttColorType;
    fieldId: string;
    color: number;
  };
  workDays: number[];
  onlyCalcWorkDay: boolean;
  linkFieldId: string;
  autoTaskLayout: boolean;
}

export interface IGanttViewProperty extends IViewPropertyBase {
  id: string;
  type: ViewType.Gantt;
  style: IGanttViewStyle;
  groupInfo?: IGroupInfo;
  columns: IGanttViewColumn[];
  frozenColumnCount: number;
  rowHeightLevel?: RowHeightLevel;
  autoHeadHeight?: boolean;
}

export interface IKanbanViewGroupBase extends ISortedField {
  sequence: string[];
}

export type HiddenGroupMap = {
  [groupId: string]: boolean;
};

export interface IKanbanViewProperty extends IViewPropertyBase {
  type: ViewType.Kanban;
  groupInfo?: IGroupInfo;
  style: IKanbanStyle;
}

export type IKanbanStyle = Pick<IGalleryViewStyle, 'coverFieldId' | 'isCoverFit' | 'isColNameVisible'> & {
  kanbanFieldId: string;
  hiddenGroupMap?: HiddenGroupMap;
};

export interface IOrgChartViewProperty extends IViewPropertyBase {
  type: ViewType.OrgChart;
  groupInfo?: IGroupInfo;
  style: IOrgChartViewStyle;
}

export type IViewProperty =
  | IGridViewProperty
  | IGalleryViewProperty
  | IKanbanViewProperty
  | IGanttViewProperty
  | ICalendarViewProperty
  | IOrgChartViewProperty;

export interface IPageParams {
  // type: PageType;
  // spaceId?: string;
  shareId?: string;
  datasheetId?: string;
  automationId?: string;
  viewId?: string;
  recordId?: string;
  fieldId?: string;
  folderId?: string;
  formId?: string;
  templateId?: string;
  ablumId?: string;
  categoryId?: string;
  memberId?: string;
  widgetId?: string;
  dashboardId?: string;
  resourceId?: string;
  nodeId?: string;
  mirrorId?: string;
  embedId?: string;
  aiId?: string;
  customPageId?: string;
}

export interface ICollaboratorParams {
  activeDatasheet: string;
  userName?: string;
  memberName?: string;
  avatar?: string;
  userId?: string;
  avatarColor?: number;
  nickName?: string;
}

export interface ICollaborator extends ICollaboratorParams {
  socketId: string;
  shareId?: string;
  createTime?: number;
  activeCell?: {
    fieldId: string;
    recordId: string;
    time: number;
  };
  avatarColor?: number;
  nickName?: string;
}

export interface IResourceRevision {
  resourceId: string;
  revision: number;
}

export interface IWatchResult {
  resourceRevisions: IResourceRevision[] | null;
  collaborators: ICollaborator[];
}

export interface ICollaboratorCursor {
  fieldId: string;
  recordId: string;
  socketId: string;
  avatar?: string;
  nickName?: string;
  avatarColor?: number | null;
  userId?: string;
  userName?: string;
  memberName?: string;
  createTime?: number;
  touchTime?: number;
}

export interface ICollaboratorCursorMap {
  [id: string]: ICollaboratorCursor[];
}

export interface IRowHeightState {
  level: RowHeightLevel;
}

export interface IFillHandleStatus {
  isActive: boolean;
  direction?: FillDirection;
  fillRange?: IRange;
}

export interface ISelection {
  ranges?: IRange[];
  activeCell?: ICell;
  recordRanges?: IRecordRanges;
  fieldRanges?: IFieldRanges;
  fillHandleStatus?: IFillHandleStatus;
}

/**
 * Api Response Wrapper
 */
export interface IApiWrapper {
  code: number;
  message: string;
  success: boolean;
}

export interface IChangesetPack extends IApiWrapper {
  data: IRemoteChangeset[];
}

/**
 * Action relevant
 */
export interface ILoadedDataPackAction {
  type: typeof actions.DATAPACK_LOADED;
  datasheetId: string;
  payload: IDatasheetState;
}

export interface ILoadingRecordAction {
  datasheetId: string;
  type: typeof actions.SET_LOADING_RECORD;
  payload: {
    recordIds: string[];
    loading: boolean | 'error';
  };
}

export interface ICursorMove {
  type: typeof actions.CURSOR_MOVE;
  datasheetId: string;
  payload: {
    socketId: string;
    fieldId: string;
    recordId: string;
    time: number;
  };
}

export interface ISetSelectionAction {
  type: typeof actions.SET_SELECTION;
  payload: {
    range: IRange[];
    activeCell?: ICell;
  };
}

export interface ISetActiveCellAction {
  type: typeof actions.SET_ACTIVE_CELL;
  payload: {
    range?: IRange[];
    activeCell: ICell;
  };
}

export interface IUpdateDatasheetAction {
  type: typeof actions.UPDATE_DATASHEET;
  payload: Partial<INodeMeta>;
}

export interface IUpdateSnapShotAction {
  type: typeof actions.UPDATE_SNAPSHOT;
  payload: ISnapshot;
}

export interface IClearSelection {
  type: typeof actions.CLEAR_SELECTION;
}

export interface IClearSelectionButKeepCheckedRecord {
  type: typeof actions.CLEAR_SELECTION_BUT_KEEP_CHECKED_RECORD;
}

export interface ISetRecordRange {
  type: typeof actions.SET_RECORD_SELECTION;
  payload: IRecordRanges;
}

export interface ISetFieldRanges {
  type: typeof actions.SET_FIELD_RANGES;
  payload: IFieldRanges;
}

export interface ISetFillHandleStatus {
  type: typeof actions.SET_FILL_HANDLE_STATUS;
  payload: {
    fillHandleStatus: IFillHandleStatus;
  };
}

/**
 * refresh snapshot, which will change the view.
 */
export interface IRefreshSnapshotAction {
  type: typeof actions.REFRESH_SNAPSHOT;
}

export interface ICacheExpandStatus {
  type: typeof actions.EXPAND_STATUS;
  payload: { [key: string]: boolean };
}

export interface IChangeViewAction {
  type: typeof actions.CHANGE_VIEW;
  payload: string;
}

export interface IRecordNodeDesc {
  type: typeof actions.RECORD_NODE_DESC;
  payload: string;
}

export interface IRecordNodeShared {
  type: typeof actions.RECORD_NODE_SHARED;
  payload: boolean;
}

export interface IResetDatasheetAction {
  type: typeof actions.RESET_DATASHEET;
  datasheetId: string;
}

export interface IAddDatasheetAction {
  type: typeof actions.ADD_DATASHEET;
  datasheetId: string;
  payload: IDatasheetPack;
}

export interface ISetViewPropertyAction {
  datasheetId: string;
  type: typeof actions.SET_VIEW_PROPERTY;
  payload: {
    viewId: string;
    viewProperty: IViewProperty;
  };
}

export interface ISetPageParamsAction {
  type: typeof actions.SET_PAGE_PARAMS;
  payload: { [path: string]: string | undefined };
}

export interface ISetGroupingCollapseAction {
  type: typeof actions.SET_GROUPING_COLLAPSE;
  payload: string[];
}

export interface IUpdateDatasheetNameAction {
  type: typeof actions.UPDATE_DATASHEET_NAME;
  payload: string;
  datasheetId: string;
}

export type ILinearRowBase = {
  depth: number;
  recordId: string;
};
export type ILinearRowBlank = ILinearRowBase & {
  type: CellType.Blank;
};

export type ILinearRowAdd = ILinearRowBase & {
  type: CellType.Add;
};

export type ILinearRowGroupTab = ILinearRowBase & {
  type: CellType.GroupTab;
};

export type ILinearRowRecord = ILinearRowBase & {
  type: CellType.Record;
  groupHeadRecordId: string;
  displayIndex: number;
};

export type ILinearRow = ILinearRowBlank | ILinearRowAdd | ILinearRowGroupTab | ILinearRowRecord;

interface ISetGalleryStyleBase {
  viewId: string;
}

interface ISetGalleryStyleLayoutType extends ISetGalleryStyleBase {
  styleKey: GalleryStyleKeyType.LayoutType;
  styleValue: LayoutType;
}

interface ISetGalleryStyleCardCount extends ISetGalleryStyleBase {
  styleKey: GalleryStyleKeyType.CardCount;
  styleValue: number;
}

interface ISetGalleryStyleCoverFieldId extends ISetGalleryStyleBase {
  styleKey: GalleryStyleKeyType.CoverFieldId;
  styleValue: string;
}

interface ISetGalleryStyleIsCoverFit extends ISetGalleryStyleBase {
  styleKey: GalleryStyleKeyType.IsCoverFit;
  styleValue: boolean;
}

interface ISetGalleryStyleIsColNameVisible extends ISetGalleryStyleBase {
  styleKey: GalleryStyleKeyType.IsColNameVisible;
  styleValue: boolean;
}

interface ISetGalleryStyleIsAutoLayout extends ISetGalleryStyleBase {
  styleKey: GalleryStyleKeyType.IsAutoLayout;
  styleValue: boolean;
}

export type ISetGalleryStyle =
  | ISetGalleryStyleLayoutType
  | ISetGalleryStyleCardCount
  | ISetGalleryStyleCoverFieldId
  | ISetGalleryStyleIsCoverFit
  | ISetGalleryStyleIsColNameVisible
  | ISetGalleryStyleIsAutoLayout;

interface ISetGanttStyleColorOption {
  styleKey: GanttStyleKeyType.ColorOption;
  styleValue: {
    type: GanttColorType;
    color: number;
  };
}

interface ISetGanttStyleStartFieldId {
  styleKey: GanttStyleKeyType.StartFieldId;
  styleValue: string;
}

interface ISetGanttStyleEndFieldId {
  styleKey: GanttStyleKeyType.EndFieldId;
  styleValue: string;
}

interface ISetGanttStyleWorkDays {
  styleKey: GanttStyleKeyType.WorkDays;
  styleValue: number[];
}

interface ISetGanttStyleOnlyCalcWorkDay {
  styleKey: GanttStyleKeyType.OnlyCalcWorkDay;
  styleValue: boolean;
}

interface ISetGanttStyleLinkFieldId {
  styleKey: GanttStyleKeyType.LinkFieldId;
  styleValue: string;
}

interface ISetGanttStyAutoTaskLayout {
  styleKey: GanttStyleKeyType.AutoTaskLayout;
  styleValue: boolean;
}

export type ISetGanttStyle =
  | ISetGanttStyleColorOption
  | ISetGanttStyleStartFieldId
  | ISetGanttStyAutoTaskLayout
  | ISetGanttStyleEndFieldId
  | ISetGanttStyleWorkDays
  | ISetGanttStyleOnlyCalcWorkDay
  | ISetGanttStyleLinkFieldId;

interface ISetCalendarStyleColorOption {
  styleKey: CalendarStyleKeyType.ColorOption;
  styleValue: {
    type: CalendarColorType;
    color: number;
  };
}

interface ISetCalendarStyleStartFieldId {
  styleKey: CalendarStyleKeyType.StartFieldId;
  styleValue: string;
}

interface ISetCalendarStyleEndFieldId {
  styleKey: CalendarStyleKeyType.EndFieldId;
  styleValue: string;
}

interface ISetCalendarStyleColNameVisible {
  styleKey: CalendarStyleKeyType.IsColNameVisible;
  styleValue: boolean;
}

export type ISetCalendarStyle =
  | ISetCalendarStyleColorOption
  | ISetCalendarStyleStartFieldId
  | ISetCalendarStyleEndFieldId
  | ISetCalendarStyleColNameVisible;

interface ISetOrgChartStyleBase {
  viewId: string;
}

interface ISetOrgChartStyleCoverFieldId extends ISetOrgChartStyleBase {
  styleKey: OrgChartStyleKeyType.CoverFieldId;
  styleValue: string;
}

interface ISetOrgChartStyleIsCoverFit extends ISetOrgChartStyleBase {
  styleKey: OrgChartStyleKeyType.IsCoverFit;
  styleValue: boolean;
}

interface ISetOrgChartStyleIsColNameVisible extends ISetOrgChartStyleBase {
  styleKey: OrgChartStyleKeyType.IsColNameVisible;
  styleValue: boolean;
}

interface ISetOrgChartStyleLinkFieldId extends ISetOrgChartStyleBase {
  styleKey: OrgChartStyleKeyType.LinkFieldId;
  styleValue: string;
}

interface ISetOrgChartStyleHorizontal extends ISetOrgChartStyleBase {
  styleKey: OrgChartStyleKeyType.Horizontal;
  styleValue: boolean;
}

export type ISetOrgChartStyle =
  | ISetOrgChartStyleCoverFieldId
  | ISetOrgChartStyleIsCoverFit
  | ISetOrgChartStyleLinkFieldId
  | ISetOrgChartStyleIsColNameVisible
  | ISetOrgChartStyleHorizontal;

export interface IRecordAlarm {
  id: string;
  subtract?: string;
  time?: string;
  alarmUsers?: IAlarmUser[];
  recordId?: string;
  fieldId?: string;
  alarmAt?: string;
}

/**
 *
 * a data structure for client-side.
 * if you want to change, use re-selector.
 *
 * the data structure for server-side use `IRecordAlarm`
 */
export type IRecordAlarmClient = Omit<IRecordAlarm, 'recordId' | 'fieldId' | 'alarmUsers'> & {
  alarmUsers: string[];
  target: AlarmUsersType;
};

export type IAlarmTypeKeys = keyof IRecordAlarmClient;

export interface IAlarmUser {
  type: AlarmUsersType;
  data: string;
}

export enum AlarmUsersType {
  Field = 'field',
  Member = 'member',
}

export interface ISetViewDerivation {
  type: typeof actions.SET_VIEW_DERIVATION;
  payload: {
    viewId: string;
    viewDerivation: IViewDerivation;
  };
}

export interface IPatchViewDerivation {
  type: typeof actions.PATCH_VIEW_DERIVATION;
  payload: {
    viewId: string;
    viewDerivation: Partial<IViewDerivation>;
  };
}

export interface IDeleteViewDerivation {
  type: typeof actions.DELETE_VIEW_DERIVATION;
  payload: {
    viewId: string;
  };
}

export interface ITriggerViewDerivationComputed {
  type: typeof actions.TRIGGER_VIEW_DERIVATION_COMPUTED;
  payload: {
    datasheetId: string;
    viewId: string;
  };
}

export interface IClearActiveRowInfo {
  type: typeof actions.CLEAR_ACTIVE_ROW_INFO;
}

export interface ISetActiveRowInfo {
  type: typeof actions.SET_ACTIVE_ROW_INFO;
  payload: IActiveRowInfo;
}
