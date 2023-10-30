import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import { TimeDimension } from 'pc/components/space_manage/space_info/components/credit_cost_card/enum';

dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(localizedFormat);

export const formatDate = (timeDimension: TimeDimension, value: string) => formatStrategy[timeDimension](value);

const formatStrategy = {
  [TimeDimension.TODAY]: (value: string) => {
    return formatToday(value);
  },
  [TimeDimension.WEEKDAY]: (value: string) => {
    return formatWeekday(value);
  },
  [TimeDimension.MONTH]: (value: string) => {
    return formatMonth(value);
  },
  [TimeDimension.YEAR]: (value: string) => {
    return formatYear(value);
  },
};

const formatToday = (value: string) => {
  // format 23:00
  return `${dayjs.unix(Number(value)).format('H')}h`;
};

const formatWeekday = (value: string) => {
  // format Monday-Sunday, expect 1 = Monday, 7 = Sunday
  return dayjs.tz().day(Number(value)).format('dddd');
};

const formatMonth = (value: string) => {
  // format 1-31
  return dayjs.tz().date(Number(value)).format('DD');
};

const formatYear = (value: string) => {
  // format January-December, expect 0 = January, 11 = December
  return dayjs.tz()
    .month(Number(value) - 1)
    .format('MMMM');
};
