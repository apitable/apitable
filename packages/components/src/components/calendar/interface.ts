import { ReactText } from 'react';
import { Direction } from './constants';

export type Id = ReactText | number | string;

export interface ICalendar {
  /**
   * default date. the first opened calendar is the current month
  */
  defaultDate?: Date;
  /**
   * task list, data structure is：ITask { id: Id; title: string; startDate: Date; endDate: Date; startDisabled?: boolean, endDisabled?: boolean }
   */
  tasks?: ITask[];
  /**
   * update task function
  */
  update?: (id: Id, startDate: Date, endDate: Date) => void;
  /**
   * i18n
   */
  lang?: 'zh' | 'en';
  /**
   * drag and drop components
  */
  dnd?: any[];
  /**
   * list inline styles
  */
  listStyle?: React.CSSProperties;
  /**
   * mark task start position inline styles
   */
  startListStyle?: React.CSSProperties;
  /**
   * abnormal task warn message
   */
  warnText?: React.ReactElement;
  /**
   * the minimum decimal number displayed in each calendar line
   */
  rowMixCount?: number;
  /**
   * whether disabled actions
  */
  disabled?: boolean;
  /**
   * task support resizable
  */
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
  /**
   * drop date
   */
  date: Date;
  /**
   * update task function
   */
  update?: (id: Id, startDate: Date, endDate: Date) => void;
  /**
   * task list
   */
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