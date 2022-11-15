import { ITask } from '@apitable/components';
import { 
  IFieldMap, ICalendarViewColumn, ISnapshot, ICalendarViewStyle, 
  IViewProperty, ICalendarViewStatus, IPermissions, ICell } from '@apitable/core';
import { createContext } from 'react';

export type IPosition = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
};

export type IRecordModal = [string, boolean, IPosition];

export interface ICalendarContext {
  // Left-click shortcut to calendar view records
  setRecordModal: (recordMes?: IRecordModal) => void;
  recordModal?: IRecordModal;
  // Cached data
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
  // Caching methods
  getCellValue: (rId: string, fId: string) => any;
  isMobile: boolean;
  tasks?: ITask[];
  activeCell: ICell | null;
}

export const CalendarContext = createContext({} as ICalendarContext);