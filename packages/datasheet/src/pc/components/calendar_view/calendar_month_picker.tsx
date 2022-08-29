import dayjs from 'dayjs';
import { useState } from 'react';
import { ComponentDisplay, ScreenSize } from '../common/component_display/component_display';
import { FORMAT_DATE } from './constants';
import { formatString2Date } from './utils';
import { PickerContent } from '../editors/date_time_editor/mobile/picker_content';
import MonthPicker from '../editors/date_time_editor/date_picker/month_picker';
import { useClickAway } from 'ahooks';
import { get } from 'lodash';
interface ICalendarMonthPicker {
  showValue: string;
  lang: string;
  setDate: (date: dayjs.Dayjs | null) => void;
}

export const CalendarMonthPicker = (props: ICalendarMonthPicker) => {
  const { showValue, lang, setDate } = props;

  const isZh = lang === 'zh';
  const format =isZh ? 'YYYY年MM月' : 'YYYY MM';

  const [open, setOpen] = useState(false);

  useClickAway((event) => {
    const targetCls = get(event, 'target.className');
    if (targetCls && typeof targetCls === 'string' && targetCls.includes('cp-calendar')) {
      return;
    }
    setOpen(false);
  },
  () => document.querySelector('.cp-calendar')
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
          value={dayjs(formatString2Date(showValue))}
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
          onVisibleChange={() => {
            setOpen(!open);
          }}
          onChange={(val) => {
            setDate(dayjs(val));
            setOpen(!open);
          }}
          dateFormat={FORMAT_DATE}
          dateTimeFormat={format}
        />
      </ComponentDisplay>
    </>
  );
};