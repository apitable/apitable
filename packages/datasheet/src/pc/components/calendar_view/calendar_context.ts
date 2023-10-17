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

import { createContext } from 'react';
import { ITask } from '@apitable/components';
import {
  IFieldMap,
  ICalendarViewColumn,
  ISnapshot,
  ICalendarViewStyle,
  IViewProperty,
  ICalendarViewStatus,
  IPermissions,
  ICell,
} from '@apitable/core';

export interface ICalendarContext {
  // Cached data
  fieldMap: IFieldMap;
  columns: ICalendarViewColumn[];
  snapshot: ISnapshot;
  calendarStyle: ICalendarViewStyle;
  view: IViewProperty;
  permissions: IPermissions;
  currentSearchRecordId: string | undefined;
  calendarViewStatus: ICalendarViewStatus;
  firstFieldId: string;
  isSearching: boolean;
  isStartDateTimeField: boolean;
  isEndDateTimeField: boolean;
  datasheetId: string;
  draggable: boolean;
  isCryptoStartField: boolean;
  isCryptoEndField: boolean;
  keyword: string;
  setKeyword: (word: string) => void;
  onCloseGrid: () => void;
  // Caching methods
  getCellValue: (rId: string, fId: string) => any;
  isMobile: boolean;
  tasks?: ITask[];
  activeCell: ICell | null;
}

export const CalendarContext = createContext({} as ICalendarContext);
