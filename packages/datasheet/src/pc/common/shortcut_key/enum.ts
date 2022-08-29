/* eslint-disable */
export enum ContextName {
  true = 'true',  // when一直为true
  isEditing = 'isEditing', // 单元格编辑的时候。
  isMenuOpening = 'isMenuOpening', // 菜单打开的时候（例如：列配置菜单）
  isGlobalEditing = 'isGlobalEditing', // 任意输入框聚焦的时候。
  isFocusing = 'isFocusing', // 单元格聚焦的时候。
  hasActiveCell = 'hasActiveCell', // 存在激活单元格的时候。
  isRecordExpanding = 'isRecordExpanding', // 卡片编辑激活的时候。
  visualizationEditable = 'visualizationEditable', // 视图工具栏编辑
  recordEditable = 'recordEditable', // Record 记录编辑
  modalVisible = 'modalVisible',  // 当前是否打开了模态窗
}

export enum ShortcutActionName {
  None = 'None', // -> 出现这个，一般就是填config表出错了
  Help = 'Help', // 键盘快捷键帮助面板
  Undo = 'Undo',
  Redo = 'Redo',
  ToastForSave = 'ToastForSave',
  EndEdit = 'EndEdit',
  ToggleEditing = 'ToggleEditing',
  ToggleNextEditing = 'ToggleNextEditing',
  ToggleWidgetPanel = 'ToggleWidgetPanel',

  // 单元格移动
  CellLeft = 'CellLeft',
  CellRight = 'CellRight',
  CellUp = 'CellUp',
  CellDown = 'CellDown',
  CellUpEdge = 'CellUpEdge',
  CellDownEdge = 'CellDownEdge',
  CellLeftEdge = 'CellLeftEdge',
  CellRightEdge = 'CellRightEdge',
  CellTab = 'CellTab', // 退出编辑状态，并向右移动一格
  CellShiftTab = 'CellShiftTab', // 退出编辑状态，并向左移动一格
  RecordTab = 'RecordTab', // 卡片编辑中，退出编辑状态，并向下移动一格
  RecordShiftTab = 'RecordShiftTab', // 卡片编辑中，退出编辑状态，并向上移动一格
  // 选区扩展
  SelectionLeft = 'SelectionLeft',
  SelectionRight = 'SelectionRight',
  SelectionUp = 'SelectionUp',
  SelectionDown = 'SelectionDown',
  SelectionAll = 'SelectionAll',
  SelectionUpEdge = 'SelectionUpEdge',
  SelectionDownEdge = 'SelectionDownEdge',
  SelectionLeftEdge = 'SelectionLeftEdge',
  SelectionRightEdge = 'SelectionRightEdge',

  ExpandRecord = 'ExpandRecord',
  Clear = 'Clear',
  CompleteEditing = 'CompleteEditing',
  ExitEditing = 'ExitEditing',
  AppendRow = 'AppendRow',
  PrependRow = 'PrependRow',
  Copy = 'Copy',
  Cut = 'Cut',
  Paste = 'Paste',
  Focus = 'Focus',
  PageDown = 'PageDown',
  PageUp = 'PageUp',
  PageLeft = 'PageLeft',
  PageRight = 'PageRight',
  PageDownEdge = 'PageDownEdge',
  PageUpEdge = 'PageUpEdge',
  ViewPrev = 'ViewPrev',
  ViewNext = 'ViewNext',

  // 目录树
  SearchNode = 'SearchNode',
  NewFolder = 'NewFolder',
  NewDatasheet = 'NewDatasheet',
  RenameNode = 'Rename',
  CopyNode = 'CopyNode',
  Permission = 'Permission',
  Share = 'Share',
  SaveAsTemplate = 'SaveAsTemplate',
  ToggleCatalogPanel = 'ToggleCatalogPanel',

  // 视图工具栏
  ToggleFindPanel = 'ToggleFindPanel',
  ToggleApiPanel = 'ToggleApiPanel',
  ToggleRobotPanel = 'ToggleRobotPanel',
  ToggleTimeMachinePanel = 'ToggleTimeMachinePanel',
  // 展开卡片
  PreviousRecord = 'PreviousRecord',
  NextRecord = 'NextRecord',
  // 关闭展开的卡片
  CloseExpandRecord = 'CloseExpandRecord',
  // 开发者面板
  ToggleDevPanel = 'ToggleDevPanel',
}
