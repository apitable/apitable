import { ReactText } from 'react';
import { Direction } from './constants';

export type Id = ReactText | number | string;

export interface ICalendar {
  /** 默认时间，首次打开日历为当前月份 */
  defaultDate?: Date;
  /** 任务列表，数据结构为：ITask { id: Id; title: string; startDate: Date; endDate: Date; startDisabled?: boolean, endDisabled?: boolean } */
  tasks?: ITask[];
  /** 更新任务函数 */
  update?: (id: Id, startDate: Date, endDate: Date) => void;
  /** 国际化支持 */
  lang?: 'zh' | 'en';
  /** 拖拽组件（beta 版本） */
  dnd?: any[];
  /** 任务样式 */
  listStyle?: React.CSSProperties;
  /** 标记任务开始时间位置样式 */
  startListStyle?: React.CSSProperties;
  /** 告警信息 */
  warnText?: React.ReactElement;
  /** 日历行展示行最小个数 */
  rowMixCount?: number;
  /** 禁用 */
  disabled?: boolean;
  /** 支持拉伸，允许拉升任务两端调整任务时间 */
  resizable?: boolean;
  moreText?: string;
  moveTaskId?: string;
  monthPicker?: (showValue: string) => JSX.Element;
}
export interface ITask {
  id: Id;
  title: string;
  startDate: Date;
  endDate: Date;
  startDisabled?: boolean,
  endDisabled?: boolean,
}

export interface IData {
  month: number;
  day: number;
}

export interface IResizeHook {
  height: number[];
  width?: number;
  update?: (id: Id, startDate: Date, endDate: Date) => void;
  setResizeDay: (val: number) => void;
  tasks: ITask[];
}

export interface IResizeRef {
  id: Id;
  clientX: number;
  clientY: number;
  top: number;
  direction: Direction;
  day: number;
}
export interface ILevel {
  week: IData[];
  year: number;
  tasks: ITask[];
  resizeMsg?: {
    id?: Id;
    direction: Direction;
    day: number;
  }
}

export interface ILevelResult {
  task: ITask;
  len: number;
  left: number;
  right: number;
  isStart: boolean;
  isEmptyStart: boolean;
  isEnd: boolean;
  isEmptyEnd: boolean;
  warn: boolean;
}

export interface IDrop {
  children: React.ReactElement[];
  /** 拖拽到的日期 */
  date: Date;
  /** 更新任务 */
  update?: (id: Id, startDate: Date, endDate: Date) => void;
  /** 任务列表 */
  tasks: ITask[];
}

export interface IDrag {
  children: Element | string;
  task: ITask;
  id: Id;
}

export interface IResizeFormat {
  startDate: Date;
  endDate: Date;
  day: number;
  direction: Direction;
}