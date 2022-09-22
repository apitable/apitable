import { Strings, t } from 'i18n';
import { FieldType, IField } from 'types';

export const DEFAULT_PERMISSION = {
  allowEditConfigurable: false,
  allowSaveConfigurable: false,
  childCreatable: false,
  copyable: false,
  descriptionEditable: false,
  editable: false,
  iconEditable: false,
  importable: false,
  manageable: false,
  movable: false,
  nodeAssignable: false,
  readable: false,
  removable: false,
  renamable: false,
  sharable: false,
  templateCreatable: false,
  exportable: false,
  // 0.5之后整理的详细数表权限
  viewCreatable: false,
  viewRenamable: false,
  viewRemovable: false,
  viewMovable: false,
  viewExportable: false,
  viewFilterable: false,
  columnSortable: false,
  columnHideable: false,
  fieldSortable: false,
  fieldGroupable: false,
  rowHighEditable: false,
  columnWidthEditable: false,
  columnCountEditable: false,
  fieldCreatable: false,
  fieldRenamable: false,
  fieldPropertyEditable: false,
  fieldRemovable: false,
  rowCreatable: false,
  rowRemovable: false,
  cellEditable: false,
  rowSortable: false,
  fieldPermissionManageable: false,
  viewLayoutEditable: false,
  viewStyleEditable: false,
  viewKeyFieldEditable: false,
  viewColorOptionEditable: false,
  viewManualSaveManageable: false,
  viewOptionSaveEditable: false
};

// 可管理权限
export const DEFAULT_MANAGER_PERMISSION = {
  allowEditConfigurable: true,
  allowSaveConfigurable: true,
  childCreatable: true,
  copyable: true,
  descriptionEditable: true,
  editable: true,
  iconEditable: true,
  exportable: true,
  importable: true,
  manageable: true,
  movable: true,
  nodeAssignable: true,
  readable: true,
  removable: true,
  renamable: true,
  sharable: true,
  templateCreatable: true,
  // 0.5之后整理的详细数表权限
  viewCreatable: true,
  viewRenamable: true,
  viewRemovable: true,
  viewMovable: true,
  viewExportable: true,
  viewFilterable: true,
  columnSortable: true,
  columnHideable: true,
  rowSortable: true,
  fieldSortable: true,
  fieldGroupable: true,
  rowHighEditable: true,
  columnWidthEditable: true,
  columnCountEditable: true,
  fieldCreatable: true,
  fieldRenamable: true,
  fieldPropertyEditable: true,
  fieldRemovable: true,
  rowCreatable: true,
  rowRemovable: true,
  cellEditable: true,
  fieldPermissionManageable: true,
  viewLayoutEditable: true,
  viewStyleEditable: true,
  viewKeyFieldEditable: true,
  viewColorOptionEditable: true,
  viewManualSaveManageable: true,
  viewOptionSaveEditable: true
};

// 编辑者权限
export const DEFAULT_EDITOR_PERMISSION = {
  allowEditConfigurable: false,
  allowSaveConfigurable: false,
  childCreatable: false,
  copyable: false,
  descriptionEditable: false,
  editable: true,
  iconEditable: false,
  exportable: false,
  importable: false,
  manageable: false,
  movable: false,
  nodeAssignable: false,
  readable: true,
  removable: false,
  renamable: false,
  sharable: true,
  templateCreatable: false,
  // 0.5之后整理的详细数表权限
  viewCreatable: true,
  viewRenamable: true,
  viewRemovable: true,
  viewMovable: true,
  viewExportable: false,
  viewFilterable: true,
  columnSortable: true,
  columnHideable: true,
  rowSortable: true,
  fieldSortable: true,
  fieldGroupable: true,
  rowHighEditable: true,
  columnWidthEditable: true,
  columnCountEditable: true,
  fieldCreatable: false,
  fieldRenamable: false,
  fieldPropertyEditable: false,
  fieldRemovable: false,
  rowCreatable: true,
  rowRemovable: true,
  cellEditable: true,
  fieldPermissionManageable: false,
  viewLayoutEditable: true,
  viewStyleEditable: true,
  viewKeyFieldEditable: true,
  viewColorOptionEditable: true,
  viewManualSaveManageable: false,
  viewOptionSaveEditable: true
};

// 默认可读权限
export const DEFAULT_READ_ONLY_PERMISSION = {
  allowEditConfigurable: false,
  allowSaveConfigurable: false,
  childCreatable: false,
  copyable: false,
  descriptionEditable: false,
  exportable: false,
  editable: false,
  iconEditable: false,
  importable: false,
  manageable: false,
  movable: false,
  nodeAssignable: false,
  readable: true,
  removable: false,
  renamable: false,
  sharable: false,
  templateCreatable: false,
  // 0.5之后整理的详细数表权限
  viewCreatable: false,
  viewRenamable: false,
  viewRemovable: false,
  viewMovable: false,
  viewExportable: false,
  viewFilterable: false,
  columnSortable: false,
  columnHideable: false,
  fieldSortable: false,
  fieldGroupable: false,
  rowHighEditable: false,
  columnWidthEditable: false,
  columnCountEditable: false,
  fieldCreatable: false,
  fieldRenamable: false,
  fieldPropertyEditable: false,
  fieldRemovable: false,
  rowCreatable: false,
  rowRemovable: false,
  cellEditable: false,
  rowSortable: false,
  fieldPermissionManageable: false,
  viewLayoutEditable: false,
  viewStyleEditable: false,
  viewKeyFieldEditable: false,
  viewColorOptionEditable: false,
  viewManualSaveManageable: false,
  viewOptionSaveEditable: false
};

export const NotSupportFieldInstance: IField = {
  id: 'fldError',
  name: t(Strings.error_wrong_data_in_current_column),
  type: FieldType.NotSupport,
  property: null,
};

export enum ToolBarMenuCardOpenState {
  None = 'None',
  FieldHidden = 'FieldHidden',
  ExclusiveFieldHidden = 'ExclusiveFieldHidden',
  Filter = 'Filter',
  Group = 'Group',
  Sort = 'Sort',
  RowHeight = 'RowHeight',
  GallerySetting = 'GallerySetting',
  OrgChartSetting = 'OrgChartSetting',
  ViewSwitcher = 'ViewSwitcher', // 这个不是 toolbar 内的组件，为了 display 组件统一，还是放在这里控制
  KanbanFieldHidden = 'KanbanFieldHidden',
  Share = 'Share',
}

export const ScreenWidth = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1440,
  xxxl: 1600,
};

export enum GuideUiTypeConstant {
  Modal = 'modal',
  Slideout = 'slideout',
  Hotspot = 'hotspot',
  Popover = 'popover',
  Notice = 'notice',
  Questionnaire = 'questionnaire',
  Breath = 'breath',
  PrivacyModal = 'privacyModal',
}

export enum GuideWizardModule {
  Notice = 'notice',
  Guide = 'guide',
}

export enum DropDirectionType {
  BEFORE = 'before',
  AFTER = 'after',
  NONE = '',
}

export enum ViewType {
  NotSupport = 0,
  Grid = 1,
  Kanban = 2,
  Gallery = 3,
  Form = 4,
  Calendar = 5,
  Gantt = 6,
  OrgChart = 7,
}

export enum RowHeightLevel {
  Short = 1,
  Medium = 2,
  Tall = 3,
  ExtraTall = 4,
}

export const RowHeight = {
  Short: 32,
  Medium: 57,
  Tall: 104,
  ExtraTall: 152,
};

export const GanttRowHeight = {
  Short: 32,
  Medium: 40,
  Tall: 56,
};

export const DEFAULT_COLUMN_WIDTH = 200;
export const MIN_COLUMN_WIDTH = 80;

export enum LayoutType {
  Flex = 'flex',
  List = 'list',
}

export enum PageType {
  Datasheet,
  DataSpace,
}

export enum CellType {
  GroupTab = 'GroupTab',
  Add = 'AddRecord',
  Blank = 'Blank',
  Record = 'Record',
}

export enum GalleryStyleKeyType {
  LayoutType = 'layoutType',
  CardCount = 'cardCount',
  CoverFieldId = 'coverFieldId',
  IsCoverFit = 'isCoverFit',
  IsAutoLayout = 'isAutoLayout',
  IsColNameVisible = 'isColNameVisible',
}

export enum KanbanStyleKey {
  CoverFieldId = 'coverFieldId',
  IsCoverFit = 'isCoverFit',
  KanbanFieldId = 'kanbanFieldId',
  IsColNameVisible = 'isColNameVisible',
  HiddenGroupMap = 'hiddenGroupMap',
}

export enum CalendarColorType {
  Custom = 'Custom',
}

export enum GanttColorType {
  Custom = 'Custom',
  SingleSelect = 'SingleSelect',
}

export enum GanttStyleKeyType {
  ColorOption = 'colorOption',
  StartFieldId = 'startFieldId',
  EndFieldId = 'endFieldId',
  WorkDays = 'workDays',
  OnlyCalcWorkDay = 'onlyCalcWorkDay',
  LinkFieldId = 'linkFieldId',
  AutoTaskLayout = 'autoTaskLayout',
}

export enum CalendarStyleKeyType {
  ColorOption = 'colorOption',
  StartFieldId = 'startFieldId',
  EndFieldId = 'endFieldId',
  IsColNameVisible = 'isColNameVisible',
}

export enum OrgChartStyleKeyType {
  CoverFieldId = 'coverFieldId',
  IsCoverFit = 'isCoverFit',
  IsColNameVisible = 'isColNameVisible',
  LinkFieldId = 'linkFieldId',
  Horizontal = 'horizontal',
}

export enum BindAccount {
  DINGDING,
  WECHAT,
  QQ,
  WECOM
}

export enum QrAction {
  LOGIN,
  BIND,
  TO_WORK_SPACE,
}

export enum FieldOperateType {
  FieldSetting,
  FieldDesc,
}

export const UN_GROUP = 'UN_GROUP';

export enum SearchResultType {
  Cell = 'Cell',
  Record = 'Record',
}

export enum RecordMoveType {
  OutOfView = 'OutOfView',
  WillMove = 'WillMove',
  NotMove = 'NotMove',
  Deleted = 'Deleted',
}

export enum WhyRecordMoveType {
  UpdateRecord = 'UpdateRecord',
  NewRecord = 'NewRecord',
}

export enum DateUnitType {
  Week = 'Week',
  Month = 'Month',
  Quarter = 'Quarter',
  Year = 'Year',
}

export const DEFAULT_FIELD_PERMISSION = {
  editable: false,
  readable: false,
};

export const PREVIEW_DATASHEET_ID = 'previewDatasheet';

export enum DispatchToStore {
  Local = 'local',
  Remote = 'remote',
  All = 'all'
}
