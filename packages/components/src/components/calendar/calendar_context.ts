import { createContext } from 'react';
import { Direction } from './constants';
import { Id } from './interface';

export interface ICalendarContext {
  space: number;
  listHeight: number;
  defaultListHeight: number;
  disabled?: boolean;
  disableResize: boolean;
  onResizeStart: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string | number, direction: Direction) => void;
  Drag: any;
  Drop: any;
  listStyle?: React.CSSProperties;
  startListStyle?: React.CSSProperties;
  warnText: any;
  update?: (id: Id, startDate: Date, endDate: Date) => void;
  lang: 'zh' | 'en';
  month: number;
  rowMixCount: number;
  year: number;
  today: string;
  isMobile: boolean;
  moreText?: string;
  moveTaskId?: string;
}

export const CalendarContext = createContext({} as ICalendarContext);