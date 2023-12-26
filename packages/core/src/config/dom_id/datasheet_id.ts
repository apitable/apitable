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
// The id of the datasheet (parts of, excluding the working directory)

const PREFIX = 'DATASHEET_';

export const VIEW_EXPORT = PREFIX + 'VIEW_EXPORT'; // view export

export const ADD_VIEW_BTN = PREFIX + 'ADD_VIEW_BTN'; // New view icon button
export const FIELD_CONTEXT = PREFIX + 'FIELD_CONTEXT'; // Right-click menu of the Wig table header

export const VIEW_TOOL_BAR = PREFIX + 'TOOL_BAR'; // view toolbar

export const SWITCH_VIEW_TYPE_CONTAINER = PREFIX + 'SWITCH_VIEW_TYPE_CONTAINER'; // create a new view card
export const GRID_CUR_COLUMN_TYPE = PREFIX + 'GRID_CUR_COLUMN_TYPE';
export const FILL_HANDLE_AREA = PREFIX + 'FILL_HANDLE_AREA';
export const VIKABY = PREFIX + 'VIKABY'; // vikaby
// view tab bar
export const VIEW_TAB_BAR = PREFIX + 'VIEW_TAB_BAR'; // view tab bar
export const API_BTN = PREFIX + 'API_BTN'; // view tab bar - api panel
export const FORM_BTN = PREFIX + 'FORM_BTN'; // View Tab Bar - Magic Form
export const WIDGET_BTN = PREFIX + 'WIDGET_BTN'; // View Tab Bar - Widget
export const ROBOT_BTN = PREFIX + 'ROBOT_BTN'; // View Tab Bar - Robot
export const COPILOT_BTN = PREFIX + 'COPILOT_BTN'; // View Tab Bar - Copilot
export const FORM_LIST_PANEL = PREFIX + 'FORM_LIST_PANEL'; // view tab bar - magic form list
export const TIME_MACHINE_BTN = PREFIX + 'TIME_MACHINE_BTN'; // View Tab Bar - Time Machine
export const ARCHIVED_RECORDS_BTN = PREFIX + 'ARCHIVED_RECORDS_BTN'; // View Tab Bar - Archived Records

// Wig table content (Wig view)
export const DOM_CONTAINER = PREFIX + 'DOM_CONTAINER'; // Wig table content (Wig view)
export const ADD_COLUMN_BTN = PREFIX + 'ADD_COLUMN_BTN'; // New column button

// create a new view context
export const VIEW_CREATOR_KANBAN = PREFIX + 'CREATE_KANBAN_VIEW';
export const VIEW_CREATOR_GALLERY = PREFIX + 'CREATE_GALLERY_VIEW';
export const VIEW_CREATOR_GRID = PREFIX + 'CREATE_GRID_VIEW';
export const VIEW_CREATOR_FORM = PREFIX + 'CREATE_FORM_VIEW';
export const VIEW_CREATOR_CALENDAR = PREFIX + 'CREATE_CALENDAR_VIEW';
export const VIEW_CREATOR_ORG_CHART = PREFIX + 'CREATOR_ORG_CHART';
export const VIEW_CREATOR_GANTT = PREFIX + 'CREATE_GANTT_VIEW';
export const VIEW_CREATOR_TABLE = PREFIX + 'CREATE_TABLE';

// view operation context
export const VIEW_OPERATION_ITEM_RENAME = PREFIX + 'RENAME_VIEW';
export const VIEW_OPERATION_ITEM_COPY = PREFIX + 'COPY_VIEW';
export const VIEW_OPERATION_ITEM_COPY_FORM = PREFIX + 'COPY_VIEW_FORM';
export const VIEW_OPERATION_ITEM_COPY_MIRROR = PREFIX + 'COPY_VIEW_MIRROR';
export const VIEW_OPERATION_ITEM_EXPORT_VIEW_TO_CSV = PREFIX + 'EXPORT_VIEW_CSV';
export const VIEW_OPERATION_ITEM_EXPORT_VIEW_TO_EXCEL = PREFIX + 'EXPORT_VIEW_EXCEL';
export const VIEW_OPERATION_ITEM_EXPORT_VIEW_TO_IMAGE = PREFIX + 'EXPORT_VIEW_IMAGE';
export const VIEW_OPERATION_ITEM_DELETE = PREFIX + 'DELETE_VIEW';
export const VIEW_OPERATION_ITEM_LOCK = PREFIX + 'LOCK_VIEW';
export const VIEW_OPERATION_ITEM_LOCK_CHECK = PREFIX + 'LOCK_VIEW_CHECK';
export const VIEW_OPERATION_ITEM_CHANGE_AUTO_SAVE = PREFIX + 'CHANGE_AUTO_SAVE';
export const VIEW_OPERATION_ITEM_CHANGE_AUTO_SAVE_CHECK = PREFIX + 'CHANGE_AUTO_SAVE_CHECK';

// view list view button
export const VIEW_LIST_SHOW_BTN = PREFIX + 'SHOW_VIEW_LIST_BTN';
// view list context
export const VIEW_LIST_CREATE_GRID_VIEW = PREFIX + 'CREATE_GRID_IN_VIEW_LIST';
export const VIEW_LIST_CREATE_KANBAN_VIEW = PREFIX + 'CREATE_KANBAN_IN_VIEW_LIST';
export const VIEW_LIST_CREATE_GALLERY_VIEW = PREFIX + 'CREATE_GALLERY_IN_VIEW_LIST';
export const VIEW_LIST_CREATE_GANTT_VIEW = PREFIX + 'CREATE_GANTT_IN_VIEW_LIST';
export const CREATE_CALENDAR_IN_VIEW_LIST = PREFIX + 'CREATE_CALENDAR_IN_VIEW_LIST';
export const CREATE_ORG_IN_VIEW_LIST = PREFIX + 'CREATE_ORG_IN_VIEW_LIST';

// floating frame
export const APPLICATION_JOIN_SPACE_BTN = PREFIX + 'APPLICATION_JOIN_SPACE_BTN';
export const ADD_RECORD_BTN = PREFIX + 'ADD_RECORD_BTN';

// magic form
export const FORM_CONTAINER_SETTING = PREFIX + 'FORM_CONTAINER_SETTING'; // Magical form content page - setting button

// Gantt chart
export const GANTT_CONFIG_COLOR_HELP = PREFIX + 'GANTT_CONFIG_COLOR_HELP';

// Organization Chart
export const ORG_CHART_RECORD_LIST = PREFIX + 'ORG_CHART_RECORD_LIST'; // Organization Chart - Record List

// toolbar
export const TOOL_BAR_VIEW_SETTING = PREFIX + 'TOOL_BAR_VIEW_SETTING'; // Toolbar - new record

// side record card
export const SIDE_RECORD_PANEL = PREFIX + 'SIDE_RECORD_PANEL';
