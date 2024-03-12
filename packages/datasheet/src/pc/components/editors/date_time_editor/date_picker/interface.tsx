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

import dayjs from 'dayjs';

export interface IPickerProps {
  id?: number | string;
  prefixCls?: string;
  format?: string;
  className?: string;
  locale?: any;
  getCalendarContainer?: (triggerNode: Element) => HTMLElement;
  open?: boolean;
  onOpenChange?: (status: boolean) => void;
  showDateInput?: boolean | true;
  readOnly?: boolean | true;
  align?: any;
  onInputBlur?: () => void;
  suffixIcon?: React.ReactNode;
  disabledDate?: (current: dayjs.Dayjs) => boolean;
}
export interface IDatePickerProps extends IPickerProps {
  value?: dayjs.Dayjs;
  className?: string;
  showToday?: boolean;
  placeholder?: string;
  inputDateValue: string;
  disabled: boolean;
  onChange?: (date: dayjs.Dayjs | null, dateString: string, displayDateStr: string) => void;
  onPanelValueChange?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  renderFooter?: () => React.ReactNode;
}

export interface IMonthPickerProps extends IPickerProps {
  value: dayjs.Dayjs | null;
  onChange?: (date: dayjs.Dayjs | null) => void;
  onPanelValueChange?: () => void;
  inputDateValue: string;
}
