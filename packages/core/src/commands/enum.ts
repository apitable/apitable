export enum CollaCommandName {
  AddFields = 'AddFields',
  AddRecords = 'AddRecords',
  ArchiveRecords = 'ArchiveRecords',
  UnarchiveRecords = 'UnarchiveRecords',
  DeleteArchivedRecords = 'DeleteArchivedRecords',
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
  DeleteComment = 'DeleteComment', // delete a comment in the record
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