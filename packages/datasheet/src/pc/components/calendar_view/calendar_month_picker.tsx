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

import { useClickAway } from 'ahooks';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { useState } from 'react';
import { getLanguage } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import MonthPicker from '../editors/date_time_editor/date_picker/month_picker';
import { PickerContent } from '../editors/date_time_editor/mobile/picker_content';
import { FORMAT_DATE } from './constants';
import { formatString2Date } from './utils';
interface ICalendarMonthPicker {
  showValue: string;
  setDate: (date: dayjs.Dayjs | null) => void;
}

export const CalendarMonthPicker = (props: ICalendarMonthPicker) => {
  const { showValue, setDate } = props;
  const lang = getLanguage().split('-')[0];
  const isZh = lang === 'zh';
  const format = isZh ? 'YYYY年MM月' : 'YYYY MM';

  const [open, setOpen] = useState(false);

  useClickAway(
    (event) => {
      const targetCls = get(event, 'target.className');
      if (targetCls && typeof targetCls === 'string' && (targetCls as string).includes('cp-calendar')) {
        return;
      }
      setOpen(false);
    },
    () => document.querySelector('.cp-calendar'),
  );

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <MonthPicker
          format={FORMAT_DATE}
          prefixCls="cp-calendar"
          showDateInput={false}
          align={{
            offset: [-8, 31],
          }}
          value={dayjs.tz(formatString2Date(showValue))}
          onChange={(val) => {
            setDate(val);
            setOpen(!open);
          }}
          open={open}
          readOnly
          inputDateValue={showValue}
          onOpenChange={() => {
            setOpen(!open);
          }}
        />
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <PickerContent
          value={new Date(formatString2Date(showValue))}
          mode="month"
          editable
          visible={open}
          onChange={(val) => {
            setDate(dayjs.tz(val));
            setOpen(!open);
          }}
          dateFormat={FORMAT_DATE}
          dateTimeFormat={format}
          setVisible={setOpen}
        />
      </ComponentDisplay>
    </>
  );
};
