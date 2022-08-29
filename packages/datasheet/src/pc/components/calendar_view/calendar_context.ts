import { ITask } from '@vikadata/components';
import { 
  IFieldMap, ICalendarViewColumn, ISnapshot, ICalendarViewStyle, 
  IViewProperty, ICalendarViewStatus, IPermissions, ICell } from '@vikadata/core';
import { createContext } from 'react';

export type IPosition = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
};

export type IRecordModal = [string, boolean, IPosition];

export interface ICalendarContext {
  // 左键快捷操作日历视图记录
  setRecordModal: (recordMes?: IRecordModal) => void;
  recordModal?: IRecordModal;
  // 缓存数据
  fieldMap: IFieldMap;
  columns: ICalendarViewColumn[];
  snapshot: ISnapshot;
  calendarStyle: ICalendarViewStyle;
  view: IViewProperty;
  permissions: IPermissions;
  currentSearchCell: string | [string, string] | undefined;
  calendarViewStatus: ICalendarViewStatus;
  firstFieldId: string;
  isSearching: boolean;
  isStartDateTimeField: boolean;
  isEndDateTimeField: boolean;
  datasheetId: string;
  draggable: boolean;
  isCryptoStartField: boolean;
  isCryptoEndField: boolean;
  keyword: string,
  setKeyword: (word: string) => void;
  onCloseGrid: () => void;
  // 缓存方法
  getCellValue: (rId: string, fId: string) => any;
  isMobile: boolean;
  tasks?: ITask[];
  activeCell: ICell | null;
}

export const CalendarContext = createContext({} as ICalendarContext);