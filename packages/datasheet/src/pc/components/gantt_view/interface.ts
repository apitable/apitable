import { Dayjs } from 'dayjs';
import { DateUnitType } from '@vikadata/core';
import { ICoordinate } from 'pc/components/konva_grid';
import { DateTimeType } from './utils';

export type CellPositionMap = Record<string, CellPosition>;

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
  x: number; // 鼠标针对可视区域的 x
  y: number; // 鼠标针对可视区域的 y
  areaType: AreaType; // 模糊的 areaType，可能包含图形的空白处，目前用于滚动识别
  realAreaType: AreaType; // 真实的 areaType，只包含有效区域，配合 targetName 进行有效点击区域识别
  targetName: string; // 模糊的 targetName，只能识别点击区域的类型，如 cell、head、operation 等区域
  realTargetName: string; // 真实的 targetName，包含对应的 fieldId、recordId 等信息，配合 areaType 进行有效点击区域识别
  rowIndex: number;
  columnIndex: number;
  offsetTop: number;
  offsetLeft: number;
};

export type EditorPosition = {
  rowIndex: number;
  columnIndex: number;
  recordId: string | null | undefined;
};

export type Splitter = {
  x: number;
  visible: boolean;
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
  targetName: string | null, 
  fieldId?: string | null, 
  recordId?: string | null, 
  mouseStyle?: string | null 
}