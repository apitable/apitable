import { IRemoteChangeset } from 'engine/ot';
import { FillDirection, ICell, ICellValue, IFieldRanges, IRange, IRecordRanges, StatType } from 'model';
import { 
  CellType, GalleryStyleKeyType, IUnitValue, IUserValue, LayoutType, RowHeightLevel, ViewType, WhyRecordMoveType 
} from 'store';
import { CalendarColorType, CalendarStyleKeyType, GanttColorType, GanttStyleKeyType, OrgChartStyleKeyType } from 'store/constants';
import { IField, IStandardValue } from 'types/field_types';
import { IFilterInfo, IGroupInfo, ISortedField, ISortInfo } from 'types/view_types';
import * as actions from '../../../action_constants';
import { IPermissions, Role } from '../../catalog_tree';
import {
  ICalendarViewStatus, IGanttViewStatus, IGridViewActiveFieldState, IGridViewDragState, IKanbanViewStatus, IOrgChartViewStatus, ISearchResult, IWidgetPanelStatus
} from './client';

export interface ISnapshot {
  meta: IMeta;
  recordMap: IRecordMap;
  datasheetId: string;
}

/**
 * 以单元格最小上下文作为主维度提供的快照
 * fieldMap 中可以自由选择传入稀疏的数据。1 条或者多条都可，不需要包含全表的 field
 * recordMap 中可以自由选择传入稀疏的数据。1 条或者多条都可，不需要包含全表的 record
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
  fieldExtraMap?: IFieldExtraMap,
  createdAt?: Date | number;
  updatedAt?: Date | number;
  createdBy?: string;
  updatedBy?: string;
}

export interface IRecord {
  id: string;

  /**
   * record 中的数据
   * 只有当 record 某一列存在内容时，data 中才会有这一列的fieldId key
   */
  data: IRecordCellValue;

  /**
   * @description 统计当前 record 中存在的评论数
   * @type {number}
   */
  commentCount: number;

  /**
   * @description 通过请求返回的当前 record 内的所有评论
   * @type {IComments[]}
   */
  comments?: IComments[];

  changesets?: IRemoteChangeset[];

  /**
   * @type: timestamp
   * @desc: 被删除时间的时间戳
   */
  deleteAt?: number;

  /**
   * @desc: 记录 createdAt/updatedAt/createdBy/updatedBy 以及 fieldUpdatedMap
   */
  recordMeta?: IRecordMeta;

  /**
   * @desc
   * 数组中存储的是原 Operation 的revision，数组下标是当前 record 的 revision
   * 服务端存储和广播的 record 必须带上这个字段
   * 客户端生成的 record 不需要这个字段
   */
  revisionHistory?: number[];

  /**
   * @type: timestamp
   * @desc: 创建时间的时间戳
   */
  createdAt?: number;

  /**
   * @type: timestamp
   * @desc: 最后修改时间
   */
  updatedAt?: number;
}

export interface IComments {
  revision: number;
  /**
   * @description 创建时间
   * @type {number}
   */
  createdAt: number;

  /**
   * @description 当前评论的 id
   * @type {string}
   */
  commentId: string;

  /**
   * @description 评论创建者的 userId
   * @type {string}
   */
  unitId: string;

  /**
   * @description 评论的详情
   * @type {ICommentMsg}
   */
  commentMsg: ICommentMsg;

  /**
   * @description 更新时间，给评论编辑预留
   * @type {number}
   */
  updatedAt?: number;
}

export interface ICommentMsg {
  /**
   * @description 编辑器类型
   * @type {string}
   */
  type: string;

  /**
   * @description 对应编辑器的文档结构
   * @type {string}
   */
  content: any;

  /**
   * @description rich text editor 通用的 HTML 结构
   * @type {string}
   */
  html: string;

  /**
   * @description 对应编辑器的回复
   * @type {any}
   */
  reply?: any;

  /**
   * @description 对应编辑器的点赞表情
   * @type {any}
   */
  emojis?: {
    [emojiKey: string]: string[]
  };
}

export interface IStandardValueTable {
  datasheetId?: string;
  viewId?: string;
  header: IField[];
  body: IStandardValue[][];
  recordIds?: string[];
}

// 支持储存多个 datasheet 的状态
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
  spaceId: string;
  role: Role;
  permissions: IPermissions;
  revision: number;
  isGhostNode?: boolean;
  activeView?: string;
}

export interface IDatasheetState extends INodeMeta {
  // active 比较特殊，虽然不做协同和持久化，但是是和数表渲染息息相关，所以放进这里
  activeView: string;
  // 快照信息，包含了渲染表格所需要的全部数据
  snapshot: ISnapshot;
  /**
   * 用于标识当前 datasheet 是否只包含一部分数据。也可以用于判断本表是否是作为被关联表被加载进来的。
   * 在加载关联字段的数据时，我们只需要加载被关联表的在本表被关联的 records 数据即可。
   */
  isPartOfData?: boolean;
  /**
   * 用于标识当前数表数据加载于哪个数据源，
   * 如果单纯打开数表而加载了数据，则不会存在 sourceId，
   * 这么做主要是为了如 form 加载关联表数据后，不影响后续打开关联表的权限和数据，
   * 当监测到有 sourceId 后，表示这份数据不是原数表加载的，
   * 那么打开原数表后，则需要重新加载所有相关数据
   */
  sourceId?: string;
  /**
   * 用于标识当前的数表是否为时光机回滚时预览的数据, 并且指明当前预览的版本号
   */
  preview?: string;
}

export interface ILoadingRecord {
  [recordId: string]: boolean;
}

export interface IActiveUpdateRowInfo {
  type: WhyRecordMoveType.UpdateRecord,
  positionInfo: {
    fieldId: string;
    recordId: string;
    visibleRowIndex: number;
    isInit: boolean;
  };
  recordSnapshot: IRecordSnapshot;
}

export interface IActiveNewRowInfo {
  type: WhyRecordMoveType.NewRecord,
  positionInfo: {
    recordId: string;
    visibleRowIndex: number;
    isInit: boolean;
  };
  recordSnapshot: IRecordSnapshot;
}

export type IActiveRowInfo = IActiveUpdateRowInfo | IActiveNewRowInfo;

export interface IDatasheetClientState {
  collaborators?: ICollaborator[];
  groupingCollapseIds?: string[]; // 分组的收起状态，使用时时 set
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
  exportViewId?: string | null;
}

export interface INetworking {
  loading: boolean; // 数表数据的加载状态
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
  loading: boolean; // 数表数据的加载状态
  /**
   * datasheet connected 和 space connected 不同的地方在于,
   * datasheet 要在成功 watch 之后才算 connected，而 space 中只要 socket.io 建立连接了就算 connected
   */
  connected: boolean;
  syncing: boolean;
  datasheet: IDatasheetState | null;
  errorCode?: number | null;
  // 一些需要在客户端维护的状态，不进行持久化
  client?: IDatasheetClientState;
  // 本表中设置的列权限的信息
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

// 数表基本数据结构包
export interface IBaseDatasheetPack {
  snapshot: ISnapshot;
  datasheet: INodeMeta;
  fieldPermissionMap?: IFieldPermissionMap;
}

// 关联表数据结构
export interface IForeignDatasheetMap {
  foreignDatasheetMap?: { [foreignDatasheetId: string]: IBaseDatasheetPack };
}

// 成员数据结构
export interface IDatasheetUnits {
  units?: (IUnitValue | IUserValue)[];
}

// 单视图数据结构
export interface IViewPack {
  view: IViewProperty;
  revision: number;
}

// 来组服务端的 datasheetPack 数据结构
export type IServerDatasheetPack = IBaseDatasheetPack &
  IForeignDatasheetMap &
  IDatasheetUnits;

// 来自服务端的 gerRecords 接口数据
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

// 视图锁的数据结构
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
  // 视图配置是否自动协同
  autoSave?: boolean;
  description?: string;
  hidden?: boolean;
  filterInfo?: IFilterInfo;
  sortInfo?: ISortInfo;
  lockInfo?: IViewLockInfo;
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
    type: GanttColorType,
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
  isAutoLayout: boolean; // 自动布局情况下，cardCount 失效。
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
    type: GanttColorType,
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
  style: IOrgChartViewStyle,
}

export type IViewProperty =
  IGridViewProperty |
  IGalleryViewProperty |
  IKanbanViewProperty |
  IGanttViewProperty |
  ICalendarViewProperty |
  IOrgChartViewProperty;

export interface IPageParams {
  // type: PageType;
  // spaceId?: string;
  shareId?: string;
  datasheetId?: string;
  viewId?: string;
  recordId?: string;
  fieldId?: string;
  folderId?: string;
  formId?: string;
  templateId?: string;
  categoryId?: string;
  memberId?: string;
  widgetId?: string;
  dashboardId?: string;
  resourceId?: string;
  nodeId?: string;
  mirrorId?: string;
}

export interface ICollaboratorParams {
  activeDatasheet: string;
  userName?: string;
  memberName?: string;
  avatar?: string;
  userId?: string;
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
 * Api 相关
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
 * Action 相关
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

// export interface IJOTActionPayloadForDatasheet {
//   type: typeof actions.JOT_ACTION;
//   datasheetId: string;
//   payload: { operations: IOperation[] };
// }

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

// 刷新 snapshot，引起视图变化。
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

export type ILinearRow =
  | ILinearRowBlank
  | ILinearRowAdd
  | ILinearRowGroupTab
  | ILinearRowRecord;

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

export type ISetGalleryStyle = ISetGalleryStyleLayoutType | ISetGalleryStyleCardCount |
  ISetGalleryStyleCoverFieldId | ISetGalleryStyleIsCoverFit | ISetGalleryStyleIsColNameVisible |
  ISetGalleryStyleIsAutoLayout;

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

export type ISetGanttStyle = ISetGanttStyleColorOption | ISetGanttStyleStartFieldId | ISetGanttStyAutoTaskLayout |
  ISetGanttStyleEndFieldId | ISetGanttStyleWorkDays | ISetGanttStyleOnlyCalcWorkDay | ISetGanttStyleLinkFieldId;

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

export type ISetCalendarStyle = ISetCalendarStyleColorOption | ISetCalendarStyleStartFieldId |
  ISetCalendarStyleEndFieldId | ISetCalendarStyleColNameVisible;

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
}

/**
 * 提供给客户端使用的数据结构，改数据结构通过 re-selector 生成
 * 数据库的真实结构还是要用 IRecordAlarm
 */
export type IRecordAlarmClient = Omit<IRecordAlarm, 'recordId' | 'fieldId' | 'alarmUsers'> & {
  alarmUsers: string[];
  target: AlarmUsersType
};
export type IAlarmTypeKeys = keyof IRecordAlarmClient;

export interface IAlarmUser {
  type: AlarmUsersType,
  data: string;
}

export enum AlarmUsersType {
  Field = 'field',
  Member = 'member',
}

