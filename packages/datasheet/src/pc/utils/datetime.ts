import { t, Strings } from '@vikadata/core';
import dayjs from 'dayjs';

// time格式为xxxx-mm-dd hh:ss，如2020-05-25 13:30
export const timeFormatter = (time: string): string => {
  const timeValue = Date.parse(time);
  const timeNew = (new Date()).valueOf();
  const timeDiffer = timeNew - timeValue;
  let text = '';
  switch (true) {
    // 一分钟内
    case (timeDiffer <= 60000): {
      text = t(Strings.just_now);
      break;
    }
    // 1小时内
    case (timeDiffer <= 3600000): {
      text = t(Strings.minutes_of_count, {
        count: Math.floor(timeDiffer / 60000),
      });
      break;
    }
    // 1小时以上且当天以内
    case (dayjs().isSame(time, 'd')): {
      text = dayjs(time).format(t(Strings.time_format_today));
      break;
    }
    // 昨天
    case (dayjs(time).add(1, 'day').isSame(dayjs(), 'd')): {
      text = dayjs(time).format(t(Strings.time_format_yesterday));
      break;
    }
    // 今年
    case (dayjs().isSame(time, 'y')): {
      text = dayjs(time).format(t(Strings.time_format_month_and_day));
      break;
    }
    default:
      text = dayjs(time).format(t(Strings.time_format_year_month_and_day));
      break;
  }
  return text;
};
