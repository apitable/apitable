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

import { Dayjs } from 'dayjs';
import { DateUnitType, ILinearRow } from '@apitable/core';
import { ICoordinate } from 'pc/components/konva_grid';
import { DateTimeType } from './utils';

export type CellPosition = {
  x: number;
  y: number;
  rowIndex: number;
  columnIndex: number;
};

export interface IGanttCoordinate extends ICoordinate {
  dateUnitType: DateUnitType;
  workDays?: number[];
  onlyCalcWorkDay?: boolean;
  columnThreshold?: number;
  initDateTime?: DateTimeType;
}

export interface IScrollOptions {
  rowSpeed?: number;
  columnSpeed?: number;
  scrollCb?: Function;
}

export interface IScrollHandler {
  scrollByValue: (scrollOptions: IScrollOptions, areaType?: AreaType) => void;
  stopScroll: (isClearAll?: boolean) => void;
}

export type Timeline = {
  text: string;
  date: Dayjs;
};

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export interface IScrollState {
  scrollTop: number;
  scrollLeft: number;
  isScrolling: boolean;
}

export interface ICellScrollState {
  scrollTop: number;
  totalHeight: number;
  isOverflow: boolean;
}

export type TimeoutID = {
  id: number;
};

export enum AreaType {
  Gantt = 'Gantt',
  Grid = 'Grid',
  Splitter = 'Splitter',
  None = 'None',
}

export enum ScrollViewType {
  Prev = 'Prev',
  Next = 'Next',
}

export type PointPosition = {
  x: number; // The mouse targets the visible area of the x
  y: number; // The mouse targets the visible area of the  y
  areaType: AreaType; // Fuzzy areaType, may contain blank spaces for graphics, currently used for scrolling recognition
  realAreaType: AreaType; // Real areaType, containing only valid areas, with targetName for valid click area identification
  targetName: string; // Fuzzy targetName that only identifies the type of area clicked, such as cell, head, operation, etc.
  realTargetName: string; // Real targetName, including the corresponding fieldId, recordId, etc., with areaType for valid click area identification
  rowIndex: number;
  columnIndex: number;
  offsetTop: number;
  offsetLeft: number;
};

export type CellBound = {
  width: number;
  height: number;
};

export interface IGanttGroupInfo {
  start: number | null;
  end: number | null;
  count: number;
}

export interface IGanttGroupMap {
  [groupId: string]: IGanttGroupInfo;
}

export interface ISplitterProps {
  x: number;
  visible: boolean;
}

export interface ITargetNameDetail {
  targetName: string | null;
  fieldId?: string | null;
  recordId?: string | null;
  mouseStyle?: string | null;
}

export interface ITaskLineSetting {
  x: number;
  y: number;
  sourceId: string;
  targetId: string;
  dashEnabled: boolean;
  fillColor: string;
}

export enum TaskPositionYType {
  Top = 'Top',
  Bottom = 'Bottom',
  Collapse = 'Collapse',
  Viewable = 'Viewable',
}

export interface IRowsCellValueMap {
  isCollapse?: boolean;
  startTime?: string;
  endTime?: string;
  positionYType?: TaskPositionYType;
  rowIndex?: number;
  groupHeadRecordId?: string;
}

export type IGroupLinearRow = ILinearRow & {
  groupHeadRecordId?: string;
  groupDepth?: number;
};

export interface ITargetTaskInfo {
  recordId: string;
  dashEnabled: boolean;
}

export interface IAdjacency {
  [recordId: string]: string[];
}
