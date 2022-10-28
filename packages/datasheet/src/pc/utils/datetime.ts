import { t, Strings } from '@apitable/core';
import dayjs from 'dayjs';

// The time format is xxxx-mm-dd hh:ss, e.g. 2020-05-25 13:30
export const timeFormatter = (time: string): string => {
  const timeValue = Date.parse(time);
  const timeNew = (new Date()).valueOf();
  const timeDiffer = timeNew - timeValue;
  let text = '';
  switch (true) {
    // Within a minute
    case (timeDiffer <= 60000): {
      text = t(Strings.just_now);
      break;
    }
    // Within 1 hour
    case (timeDiffer <= 3600000): {
      text = t(Strings.minutes_of_count, {
        count: Math.floor(timeDiffer / 60000),
      });
      break;
    }
    // More than 1 hour and within the same day
    case (dayjs().isSame(time, 'd')): {
      text = dayjs(time).format(t(Strings.time_format_today));
      break;
    }
    // Yesterday
    case (dayjs(time).add(1, 'day').isSame(dayjs(), 'd')): {
      text = dayjs(time).format(t(Strings.time_format_yesterday));
      break;
    }
    // This year
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
