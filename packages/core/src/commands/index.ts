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
  FixConsistency = 'FixConsistency', // 特殊 command，用于修复数据一致性问题
  SystemSetRecords = 'SystemSetRecords', // 特殊 command，用于部分特殊 Record 只在中间层进行数据设置，以修复数据一致性问题
  SystemSetFieldAttr = 'SystemSetFieldAttr', // 特殊 command，用于部分特殊 Field 只在中间层进行属性设置，以修复数据一致性问题
  SetKanbanStyle = 'SetKanbanStyle',
  InsertComment = 'InsertComment', // 在记录中插入评论
  UpdateComment = 'UpdateComment',
  DeleteComment = 'DeleteComment',// 删除记录中的某条评论
  SystemCorrectComment = 'SystemCorrectComment', // 特殊的 command，修正评论中的时间
  Rollback = 'Rollback', // 快照回滚

  // widgetPanel
  AddWidgetPanel = 'AddWidgetPanel',
  MoveWidgetPanel = 'MoveWidgetPanel',
  ModifyWidgetPanelName = 'ModifyWidgetPanelName',
  DeleteWidgetPanel = 'DeleteWidgetPanel',
  AddWidgetToPanel = 'AddWidgetToPanel',
  DeleteWidget = 'DeleteWidget',
  ChangeWidgetInPanelHeight = 'ChangeWidgetInPanelHeight',
  MoveWidget = 'MoveWidget',

  // resource
  SetGlobalStorage = 'SetGlobalStorage',
  SetWidgetName = 'SetWidgetName',

  // Dashboard
  AddWidgetToDashboard = 'AddWidgetToDashboard',
  ChangeDashboardLayout = 'ChangeDashboardLayout',
  DeleteDashboardWidget = 'DeleteDashboardWidget',
  SetWidgetDepDstId = 'SetWidgetDepDstId',

  // Form
  UpdateFormProps = 'UpdateFormProps',

  // 日期单元格闹钟
  SetDateTimeCellAlarm = 'SetDateTimeCellAlarm',

  // 手动保存视图配置
  ManualSaveView = 'ManualSaveView',

  // 修改配置的保存模式
  SetViewAutoSave = 'SetViewAutoSave',

  // 特殊的 command，修正单向关联DstId
  FixOneWayLinkDstId = 'FixOneWayLinkDstId'
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
  ISetDateTimeCellAlarmOptions;

export * from './datasheet';
