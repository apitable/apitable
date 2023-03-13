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

import { ICollaCommandDef } from '../command_manager';
import {
  addFields, addRecords, addViews, addWidgetPanel, addWidgetToPanel, changeWidgetInPanelHeight, deleteComment, deleteField, deleteRecord, deleteViews,
  deleteWidget, deleteWidgetPanel, fillDataToCell, IAddFieldsOptions, IAddRecordsOptions, IAddViewsOptions, IAddWidgetPanel, IAddWidgetToPanel,
  IChangeWidgetInPanelHeight, IDeleteComment, IDeleteFieldOptions, IDeleteRecordOptions, IDeleteViewsOptions, IDeleteWidgetAction, IDeleteWidgetPanel,
  IFillDataToCellOptions, IInsertComment, IModifyViewsOptions, IMoveColumnOptions, IMoveRowOptions, IMoveViewsOptions, IMoveWidget, IMoveWidgetPanel,
  ISetViewFrozenColumnCount, IPasteSetFieldsOptions, IPasteSetRecordsOptions, IRollbackOptions, ISetCalendarStyleOptions, ISetColumnsPropertyOptions,
  ISetFieldAttrOptions, ISetGalleryStyleOptions, ISetGanttStyleOptions, ISetGroupOptions, ISetKanbanStyleOptions, ISetOrgChartStyleOptions,
  ISetRecordsOptions, ISetRowHeightOptions, ISetSortInfoOptions, ISetViewFilterOptions, ISetViewLockInfo, IUpdateComment, IFixOneWayLinkDstId,
  ISetDateTimeCellAlarmOptions, ISetAutoHeadHeightOptions, modifyViews, moveColumn, insertComment,
  moveRow, moveViews, moveWidget, moveWidgetPanel, pasteSetFields, pasteSetRecords, rollback, setCalendarStyle, setColumnsProperty, setFieldAttr,
  setGalleryStyle, setGanttStyle, setGroup, setKanbanStyle, setOrgChartStyle, setRecords, setRowHeight, setSortInfo, setViewFilter, setViewLockInfo,
  updateComment, fixOneWayLinkDstId, setDateTimeCellAlarm, setViewFrozenColumnCount, setAutoHeadHeight
} from './datasheet';
import {
  IModifyWidgetPanelName, ISetGlobalStorage, ISetWidgetDepDstId, ISetWidgetName, modifyWidgetPanelName, setGlobalStorage, setWidgetDepDstId,
  setWidgetName
} from './widget';
import {
  addWidgetToDashboard, changeDashboardLayout, deleteDashboardWidget, IAddWidgetToDashboard, IChangeDashboardLayout, IDeleteDashboardWidget,
} from './dashboard';
import { IUpdateFormProps, updateFormProps } from './form';
import { IManualSaveView, manualSaveView } from 'commands/datasheet/manual_save_view';
import { ISetViewAutoSave, setViewAutoSave } from 'commands/datasheet/set_view_auto_save';
import { IResetRecordsOptions, resetRecords } from './datasheet/reset_records';
export { IInternalFix } from 'commands/common/field';

export enum CollaCommandName {
  AddFields = 'AddFields',
  AddRecords = 'AddRecords',
  SetRecords = 'SetRecords',
  SetFieldAttr = 'SetFieldAttr',
  PasteSetFields = 'PasteSetFields',
  PasteSetRecords = 'PasteSetRecords',
  MoveViews = 'MoveViews',
  ModifyViews = 'ModifyViews',
  DeleteViews = 'DeleteViews',
  AddViews = 'AddViews',
  MoveRow = 'MoveRow',
  DeleteRecords = 'DeleteRecords',
  MoveColumn = 'MoveColumn',
  DeleteField = 'DeleteField',
  SetSortInfo = 'SetSortInfo',
  SetRowHeight = 'SetRowHeight',
  SetAutoHeadHeight = 'SetAutoHeadHeight',
  SetColumnsProperty = 'SetColumnsProperty',
  SetViewFilter = 'SetViewFilter',
  SetViewLockInfo = 'SetViewLockInfo',
  SetViewFrozenColumnCount = 'SetViewFrozenColumnCount',
  SetGroup = 'SetGroup',
  SetGalleryStyle = 'SetGalleryStyle',
  SetGanttStyle = 'SetGanttStyle',
  SetOrgChartStyle = 'SetOrgChartStyle',
  SetCalendarStyle = 'SetCalendarStyle',
  FillDataToCells = 'FillDataToCells',
  FixConsistency = 'FixConsistency', // special command to fix data consistency issues
  // special command, used for some special records to set data only in the middle layer to fix the data consistency problem
  SystemSetRecords = 'SystemSetRecords', 
  // special command, used for some special fields to set attributes only in the middle layer to fix the data consistency problem
  SystemSetFieldAttr = 'SystemSetFieldAttr', 
  SetKanbanStyle = 'SetKanbanStyle',
  InsertComment = 'InsertComment', // insert a comment into the record
  UpdateComment = 'UpdateComment',
  DeleteComment = 'DeleteComment',// delete a comment in the record
  SystemCorrectComment = 'SystemCorrectComment', // special command, correct time in comment
  Rollback = 'Rollback', // snapshot rollback
  // widgetPanel
  AddWidgetPanel = 'AddWidgetPanel',
  MoveWidgetPanel = 'MoveWidgetPanel',
  ModifyWidgetPanelName = 'ModifyWidgetPanelName',
  DeleteWidgetPanel = 'DeleteWidgetPanel',
  AddWidgetToPanel = 'AddWidgetToPanel',
  DeleteWidget = 'DeleteWidget',
  ChangeWidgetInPanelHeight = 'ChangeWidgetInPanelHeight',
  MoveWidget = 'MoveWidget',

  // Widget
  SetGlobalStorage = 'SetGlobalStorage',
  SetWidgetName = 'SetWidgetName',

  // Dashboard
  AddWidgetToDashboard = 'AddWidgetToDashboard',
  ChangeDashboardLayout = 'ChangeDashboardLayout',
  DeleteDashboardWidget = 'DeleteDashboardWidget',
  SetWidgetDepDstId = 'SetWidgetDepDstId',

  // Form
  UpdateFormProps = 'UpdateFormProps',
  // Date cell alarm
  SetDateTimeCellAlarm = 'SetDateTimeCellAlarm',

  // Manually save the view configuration
  ManualSaveView = 'ManualSaveView',

  // Modify the save mode of the configuration
  SetViewAutoSave = 'SetViewAutoSave',

  // special command, correct one-way association DstId
  FixOneWayLinkDstId = 'FixOneWayLinkDstId',

  // Only used for Fusion API for reload recordMap
  ResetRecords = 'ResetRecords',
}

export const COLLA_COMMAND_MAP: { [name: string]: ICollaCommandDef } = {
  [CollaCommandName.AddFields]: addFields,
  [CollaCommandName.AddRecords]: addRecords,
  [CollaCommandName.SetRecords]: setRecords,
  [CollaCommandName.SetFieldAttr]: setFieldAttr,
  [CollaCommandName.PasteSetFields]: pasteSetFields,
  [CollaCommandName.PasteSetRecords]: pasteSetRecords,
  [CollaCommandName.MoveViews]: moveViews,
  [CollaCommandName.ModifyViews]: modifyViews,
  [CollaCommandName.DeleteViews]: deleteViews,
  [CollaCommandName.AddViews]: addViews,
  [CollaCommandName.MoveRow]: moveRow,
  [CollaCommandName.DeleteRecords]: deleteRecord,
  [CollaCommandName.DeleteField]: deleteField,
  [CollaCommandName.MoveColumn]: moveColumn,
  [CollaCommandName.SetSortInfo]: setSortInfo,
  [CollaCommandName.SetRowHeight]: setRowHeight,
  [CollaCommandName.SetAutoHeadHeight]: setAutoHeadHeight,
  [CollaCommandName.SetColumnsProperty]: setColumnsProperty,
  [CollaCommandName.SetViewFilter]: setViewFilter,
  [CollaCommandName.SetGroup]: setGroup,
  [CollaCommandName.SetGalleryStyle]: setGalleryStyle,
  [CollaCommandName.SetGanttStyle]: setGanttStyle,
  [CollaCommandName.SetCalendarStyle]: setCalendarStyle,
  [CollaCommandName.SetOrgChartStyle]: setOrgChartStyle,
  [CollaCommandName.FillDataToCells]: fillDataToCell,
  [CollaCommandName.SetKanbanStyle]: setKanbanStyle,
  [CollaCommandName.InsertComment]: insertComment,
  [CollaCommandName.UpdateComment]: updateComment,
  [CollaCommandName.DeleteComment]: deleteComment,
  [CollaCommandName.AddWidgetPanel]: addWidgetPanel,
  [CollaCommandName.MoveWidgetPanel]: moveWidgetPanel,
  [CollaCommandName.ModifyWidgetPanelName]: modifyWidgetPanelName,
  [CollaCommandName.DeleteWidgetPanel]: deleteWidgetPanel,
  [CollaCommandName.AddWidgetToPanel]: addWidgetToPanel,
  [CollaCommandName.DeleteWidget]: deleteWidget,
  [CollaCommandName.SetGlobalStorage]: setGlobalStorage,
  [CollaCommandName.ChangeWidgetInPanelHeight]: changeWidgetInPanelHeight,
  [CollaCommandName.SetWidgetName]: setWidgetName,
  [CollaCommandName.MoveWidget]: moveWidget,
  [CollaCommandName.AddWidgetToDashboard]: addWidgetToDashboard,
  [CollaCommandName.ChangeDashboardLayout]: changeDashboardLayout,
  [CollaCommandName.DeleteDashboardWidget]: deleteDashboardWidget,
  [CollaCommandName.SetWidgetDepDstId]: setWidgetDepDstId,
  [CollaCommandName.Rollback]: rollback,
  [CollaCommandName.UpdateFormProps]: updateFormProps,
  [CollaCommandName.SetViewLockInfo]: setViewLockInfo,
  [CollaCommandName.ManualSaveView]: manualSaveView,
  [CollaCommandName.SetViewAutoSave]: setViewAutoSave,
  [CollaCommandName.FixOneWayLinkDstId]: fixOneWayLinkDstId,
  [CollaCommandName.SetViewFrozenColumnCount]: setViewFrozenColumnCount,
  [CollaCommandName.SetDateTimeCellAlarm]: setDateTimeCellAlarm,
  [CollaCommandName.ResetRecords]: resetRecords,
};

export type ICollaCommandOptions = ISetRecordsOptions |
  IAddFieldsOptions |
  ISetFieldAttrOptions |
  IPasteSetFieldsOptions |
  IPasteSetRecordsOptions |
  IAddRecordsOptions |
  IMoveViewsOptions |
  IModifyViewsOptions |
  IDeleteViewsOptions |
  IAddViewsOptions |
  IMoveRowOptions |
  IDeleteRecordOptions |
  IMoveColumnOptions |
  IDeleteFieldOptions |
  ISetSortInfoOptions |
  ISetRowHeightOptions |
  ISetAutoHeadHeightOptions |
  ISetColumnsPropertyOptions |
  ISetViewFilterOptions |
  ISetGroupOptions |
  ISetGalleryStyleOptions |
  ISetGanttStyleOptions |
  ISetCalendarStyleOptions |
  ISetOrgChartStyleOptions |
  IFillDataToCellOptions |
  ISetKanbanStyleOptions |
  IInsertComment |
  IUpdateComment |
  IDeleteComment |
  IAddWidgetPanel |
  IMoveWidgetPanel |
  IModifyWidgetPanelName |
  IDeleteWidgetPanel |
  ISetGlobalStorage |
  IAddWidgetToPanel |
  IDeleteWidgetAction |
  IChangeWidgetInPanelHeight |
  ISetWidgetName |
  IMoveWidget |
  IAddWidgetToDashboard |
  IChangeDashboardLayout |
  IDeleteDashboardWidget |
  ISetWidgetDepDstId |
  IRollbackOptions |
  IUpdateFormProps |
  IManualSaveView |
  ISetViewAutoSave |
  ISetViewLockInfo |
  IFixOneWayLinkDstId |
  ISetViewFrozenColumnCount |
  ISetDateTimeCellAlarmOptions | 
  IResetRecordsOptions;

export * from './datasheet';

export * as FieldCmd from './common/field';
