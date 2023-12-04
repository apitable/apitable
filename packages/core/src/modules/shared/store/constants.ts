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

import { Strings, t } from 'exports/i18n';
import { FieldType, IField } from 'types';
import { IPermissions } from 'exports/store/interfaces';

export const DEFAULT_PERMISSION: IPermissions = {
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
  rowArchivable: false,
  rowUnarchivable: false,
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

/**
 * manageable manager's permissions
 */
export const DEFAULT_MANAGER_PERMISSION: IPermissions = {
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
  rowArchivable: true,
  rowUnarchivable: true,
  cellEditable: true,
  fieldPermissionManageable: true,
  viewLayoutEditable: true,
  viewStyleEditable: true,
  viewKeyFieldEditable: true,
  viewColorOptionEditable: true,
  viewManualSaveManageable: true,
  viewOptionSaveEditable: true
};

/**
 * editor's permissions
 */
export const DEFAULT_EDITOR_PERMISSION: IPermissions = {
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
  rowArchivable: false,
  rowUnarchivable: false,
  cellEditable: true,
  fieldPermissionManageable: false,
  viewLayoutEditable: true,
  viewStyleEditable: true,
  viewKeyFieldEditable: true,
  viewColorOptionEditable: true,
  viewManualSaveManageable: false,
  viewOptionSaveEditable: true
};

/**
 * default readonly permissions
 */
export const DEFAULT_READ_ONLY_PERMISSION: IPermissions = {
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
  rowArchivable: false,
  rowUnarchivable: false,
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

  // special: this is a component in the toolbar, just clean for "display" component, so place it here to control.by @mayne
  ViewSwitcher = 'ViewSwitcher',
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

export const PREVIEW_DATASHEET_BACKUP = 'previewDatasheetBackup';

export enum DispatchToStore {
  Local = 'local',
  Remote = 'remote',
  All = 'all'
}
