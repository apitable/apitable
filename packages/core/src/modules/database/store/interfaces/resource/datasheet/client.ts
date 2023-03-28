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

import { DateUnitType, FieldOperateType } from '../../../../../shared/store/constants';
import { ISelectFieldOption } from 'types/field_types';
import * as actions from '../../../../../shared/store/action_constants';

export interface IGridViewDragState {
  dragTarget: IDragTarget;
  hoverRecordId: string | null;
  hoverRowOfAddRecord: string | null;
  hoverGroupHeadRecordId?: string | null;
}

export interface IDragTarget {
  recordId?: string;
  fieldId?: string;
  columnIndex?: number;
}

export interface ISelectedRecord {
  [recordId: string]: boolean;
}

export interface ISelectedItem {
  recordId: string;
  rowIndex: number;
}

export interface IHoverRecordId {
  type: typeof actions.SET_HOVER_RECORD_ID;
  payload: string | null;
}

export interface ISetHoverRowOfAddRecord {
  type: typeof actions.SET_HOVER_ROW_OF_ADD_RECORD;
  payload: string | null;
}

export interface IDragTargetAction {
  type: typeof actions.SET_DRAG_TARGET;
  payload: IDragTarget;
}

export enum SetFieldFrom {
  EXPAND_RECORD = 'EXPAND_RECORD',
  CONTEXT_MENU = 'CONTEXT_MENU',
}

export interface ISetFieldInfoState {
  from?: SetFieldFrom;
  fieldId: string;
  fieldIndex: number;
  fieldRectBottom: number;
  fieldRectLeft: number;
  clickLogOffsetX: number;
  operate: FieldOperateType | null;
  hiddenColumn?: boolean;
}

export type ITempSelection = ISelectFieldOption[];

export interface IGridViewActiveFieldState extends ISetFieldInfoState {
  tempSelection: ISelectFieldOption[];
}

export interface ISetFieldInfoAction {
  type: typeof actions.SET_ACTIVE_FIELD_STATE;
  payload: ISetFieldInfoState;
}

export interface ISetTempSelection {
  type: typeof actions.SET_TEMP_SELECTION;
  payload: ISetFieldInfoState;
}

export interface IClearFieldInfoAction {
  type: typeof actions.CLEAR_FIELD_INFO;
}

export interface ISetHoverGroupPath {
  type: typeof actions.SET_HOVER_GROUP_PATH;
  payload: string | null;
}

/**
 * for Grid View, in-table search need to be accurate to cell
 */
export type ISearchCellResult = [string, string][];

/**
 * for Gallery View,  Kanban View and other views, in-table search need to be accurate to row
 */
export type ISearchRecordResult = string[];

export type ISearchResult = ISearchCellResult;

export interface IWidgetPanelStatus {
  opening: boolean;
  width: number;
  activePanelId: string | null;
  loading: boolean;
}

export interface IGanttViewStatus {
  gridWidth: number;
  gridVisible: boolean;
  settingPanelWidth: number;
  settingPanelVisible: boolean;
  dateUnitType: DateUnitType;
}

export interface ICalendarViewStatus {
  guideStatus: boolean;
  gridWidth: number;
  gridVisible: boolean;
  settingPanelVisible: boolean;
  settingPanelWidth: number;
}

export interface IOrgChartViewStatus {
  guideStatus: boolean;
  rightPanelWidth: number;
  rightPanelVisible: boolean;
  settingPanelVisible: boolean;
  settingPanelWidth: number;
}

export interface IKanbanViewStatus {
  groupSettingVisible: boolean;
}

export interface ISetSearchKeyword {
  type: typeof actions.SET_SEARCH_KEYWORD;
  payload: string;
  datasheetId: string;
}
