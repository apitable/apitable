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
  month: number;
  rowMixCount: number;
  year: number;
  today: string;
  isMobile: boolean;
  moreText?: string;
  moveTaskId?: string;
}

export const CalendarContext = createContext({} as ICalendarContext);