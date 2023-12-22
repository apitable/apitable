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
  addFields,
  addRecords,
  addViews,
  addWidgetPanel,
  addWidgetToPanel,
  archiveRecord,
  unarchiveRecords,
  deleteArchivedRecords,
  changeWidgetInPanelHeight,
  deleteComment,
  deleteField,
  deleteRecord,
  deleteViews,
  deleteWidget,
  deleteWidgetPanel,
  fillDataToCell,
  IAddFieldsOptions,
  IAddRecordsOptions,
  IAddViewsOptions,
  IAddWidgetPanel,
  IAddWidgetToPanel,
  IChangeWidgetInPanelHeight,
  IDeleteComment,
  IDeleteFieldOptions,
  IDeleteRecordOptions,
  IDeleteViewsOptions,
  IDeleteWidgetAction,
  IDeleteWidgetPanel,
  IFillDataToCellOptions,
  IInsertComment,
  IModifyViewsOptions,
  IMoveColumnOptions,
  IMoveRowOptions,
  IMoveViewsOptions,
  IMoveWidget,
  IMoveWidgetPanel,
  ISetViewFrozenColumnCount,
  IPasteSetFieldsOptions,
  IPasteSetRecordsOptions,
  IRollbackOptions,
  ISetCalendarStyleOptions,
  ISetColumnsPropertyOptions,
  ISetFieldAttrOptions,
  ISetGalleryStyleOptions,
  ISetGanttStyleOptions,
  ISetGroupOptions,
  ISetKanbanStyleOptions,
  ISetOrgChartStyleOptions,
  ISetRecordsOptions,
  ISetRowHeightOptions,
  ISetSortInfoOptions,
  ISetViewFilterOptions,
  ISetViewLockInfo,
  IUpdateComment,
  IFixOneWayLinkDstId,
  ISetDateTimeCellAlarmOptions,
  ISetAutoHeadHeightOptions,
  modifyViews,
  moveColumn,
  insertComment,
  moveRow,
  moveViews,
  moveWidget,
  moveWidgetPanel,
  pasteSetFields,
  pasteSetRecords,
  rollback,
  setCalendarStyle,
  setColumnsProperty,
  setFieldAttr,
  setGalleryStyle,
  setGanttStyle,
  setGroup,
  setKanbanStyle,
  setOrgChartStyle,
  setRecords,
  setRowHeight,
  setSortInfo,
  setViewFilter,
  setViewLockInfo,
  updateComment,
  fixOneWayLinkDstId,
  setDateTimeCellAlarm,
  setViewFrozenColumnCount,
  setAutoHeadHeight,
  IArchiveRecordOptions,
  IUnarchiveRecordsOptions,
  IDeleteArchivedRecordsOptions,
} from './datasheet';
import {
  IModifyWidgetPanelName,
  ISetGlobalStorage,
  ISetWidgetDepDstId,
  ISetWidgetName,
  modifyWidgetPanelName,
  setGlobalStorage,
  setWidgetDepDstId,
  setWidgetName,
} from './widget';
import {
  addWidgetToDashboard,
  changeDashboardLayout,
  deleteDashboardWidget,
  IAddWidgetToDashboard,
  IChangeDashboardLayout,
  IDeleteDashboardWidget,
} from './dashboard';
import { IUpdateFormProps, updateFormProps } from './form';
import { IManualSaveView, manualSaveView } from 'commands/datasheet/manual_save_view';
import { ISetViewAutoSave, setViewAutoSave } from 'commands/datasheet/set_view_auto_save';
import { IResetRecordsOptions, resetRecords } from './datasheet/reset_records';
export { IInternalFix } from 'commands/common/field';
import { CollaCommandName } from './enum';
export { CollaCommandName };
export const COLLA_COMMAND_MAP: { [name: string]: ICollaCommandDef } = {
  [CollaCommandName.AddFields]: addFields,
  [CollaCommandName.AddRecords]: addRecords,
  [CollaCommandName.ArchiveRecords]: archiveRecord,
  [CollaCommandName.UnarchiveRecords]: unarchiveRecords,
  [CollaCommandName.DeleteArchivedRecords]: deleteArchivedRecords,
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

export type ICollaCommandOptions =
  | ISetRecordsOptions
  | IAddFieldsOptions
  | IArchiveRecordOptions
  | IUnarchiveRecordsOptions
  | ISetFieldAttrOptions
  | IPasteSetFieldsOptions
  | IPasteSetRecordsOptions
  | IAddRecordsOptions
  | IMoveViewsOptions
  | IModifyViewsOptions
  | IDeleteViewsOptions
  | IAddViewsOptions
  | IMoveRowOptions
  | IDeleteRecordOptions
  | IMoveColumnOptions
  | IDeleteFieldOptions
  | ISetSortInfoOptions
  | ISetRowHeightOptions
  | ISetAutoHeadHeightOptions
  | ISetColumnsPropertyOptions
  | ISetViewFilterOptions
  | ISetGroupOptions
  | ISetGalleryStyleOptions
  | ISetGanttStyleOptions
  | ISetCalendarStyleOptions
  | ISetOrgChartStyleOptions
  | IFillDataToCellOptions
  | ISetKanbanStyleOptions
  | IInsertComment
  | IUpdateComment
  | IDeleteComment
  | IAddWidgetPanel
  | IMoveWidgetPanel
  | IModifyWidgetPanelName
  | IDeleteWidgetPanel
  | ISetGlobalStorage
  | IAddWidgetToPanel
  | IDeleteWidgetAction
  | IChangeWidgetInPanelHeight
  | ISetWidgetName
  | IMoveWidget
  | IAddWidgetToDashboard
  | IChangeDashboardLayout
  | IDeleteDashboardWidget
  | ISetWidgetDepDstId
  | IRollbackOptions
  | IUpdateFormProps
  | IManualSaveView
  | ISetViewAutoSave
  | ISetViewLockInfo
  | IFixOneWayLinkDstId
  | ISetViewFrozenColumnCount
  | ISetDateTimeCellAlarmOptions
  | IResetRecordsOptions
  | IDeleteArchivedRecordsOptions;

export * from './datasheet';

export * as FieldCmd from './common/field';
