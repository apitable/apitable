import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { TimeDimension } from 'pc/components/space_manage/space_info/components/credit_cost_card/enum';

dayjs.extend(weekday);
export const formatDate = (timeDimension: TimeDimension, value: number) => {
  if (timeDimension === TimeDimension.MONTH) {
    return formatMonth(value);
  }
  if (timeDimension === TimeDimension.WEEKDAY) {
    return formatWeekday(value);
  }
  if (timeDimension === TimeDimension.TODAY) {
    return formatToday(value);
  }
  return formatYear(value);
};

const formatMonth = (value: number) => {
  return dayjs().date(value).format('YYYY-MM-DD');
};

const formatWeekday = (value: number) => {
  return dayjs().weekday(value).format('YYYY-MM-DD');
};

const formatToday = (value: number) => {
  return dayjs().hour(value).format('hh:mm');
};

const formatYear = (value: number) => {
  return dayjs().month(value).format('YYYY-MM');
};
