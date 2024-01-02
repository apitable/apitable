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

/* eslint-disable */
export enum ContextName {
  true = 'true', // when is always true
  isEditing = 'isEditing', // When cell editing.
  isMenuOpening = 'isMenuOpening', // When a menu is open (e.g. column configuration menu)
  isGlobalEditing = 'isGlobalEditing', // When any input box is in focus.
  isFocusing = 'isFocusing', // When the cell is in focus.
  hasActiveCell = 'hasActiveCell', // exists to activate the cell.
  isRecordExpanding = 'isRecordExpanding', // When the card editor is activated.
  visualizationEditable = 'visualizationEditable', // View toolbar editing
  recordEditable = 'recordEditable', // Record Record Editing
  modalVisible = 'modalVisible', // Is the modal window currently open
  isQuickSearchExpanding = 'isQuickSearchExpanding', // quick search is expanding
}

export enum ShortcutActionName {
  None = 'None', // -> When this happens, it is usually an error in filling out the config form
  Help = 'Help', // Keyboard shortcuts help panel
  Undo = 'Undo',
  Redo = 'Redo',
  ToastForSave = 'ToastForSave',
  EndEdit = 'EndEdit',
  ToggleEditing = 'ToggleEditing',
  ToggleNextEditing = 'ToggleNextEditing',
  ToggleWidgetPanel = 'ToggleWidgetPanel',

  // Cell movement
  CellLeft = 'CellLeft',
  CellRight = 'CellRight',
  CellUp = 'CellUp',
  CellDown = 'CellDown',
  CellUpEdge = 'CellUpEdge',
  CellDownEdge = 'CellDownEdge',
  CellLeftEdge = 'CellLeftEdge',
  CellRightEdge = 'CellRightEdge',
  CellTab = 'CellTab', // Exit the edit state and move one frame to the right
  CellShiftTab = 'CellShiftTab', // Exit the edit state and move one space to the left
  RecordTab = 'RecordTab', // In card editing, exit the edit state and move down one frame
  RecordShiftTab = 'RecordShiftTab', // In a card edit, exit the edit state and move up one frame
  // Constituency expansion
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

  // Catalogue tree
  SearchNode = 'SearchNode',
  NewFolder = 'NewFolder',
  NewDatasheet = 'NewDatasheet',
  NewAi = 'NewAi',
  RenameNode = 'Rename',
  CopyNode = 'CopyNode',
  Permission = 'Permission',
  CreateBackup = 'CreateBackup',
  Share = 'Share',
  SaveAsTemplate = 'SaveAsTemplate',
  ToggleCatalogPanel = 'ToggleCatalogPanel',

  // View toolbar
  ToggleFindPanel = 'ToggleFindPanel',
  ToggleApiPanel = 'ToggleApiPanel',
  ToggleRobotPanel = 'ToggleRobotPanel',
  ToggleTimeMachinePanel = 'ToggleTimeMachinePanel',
  ToggleCopilotPanel = 'ToggleCopilotPanel',
  ToggleArchivedRecordsPanel = 'ToggleArchivedRecordsPanel',
  // Expand the card
  PreviousRecord = 'PreviousRecord',
  NextRecord = 'NextRecord',
  // Close the unfolded card
  CloseExpandRecord = 'CloseExpandRecord',
  // Developer Panel
  ToggleDevPanel = 'ToggleDevPanel',
  // Quick Search Modal
  QuickSearchUp = 'QuickSearchUp',
  QuickSearchDown = 'QuickSearchDown',
  QuickSearchTab = 'QuickSearchTab',
  QuickSearchEnter = 'QuickSearchEnter',
}
