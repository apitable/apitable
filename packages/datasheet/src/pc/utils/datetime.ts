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
import { t, Strings } from '@apitable/core';

// The time format is xxxx-mm-dd hh:ss, e.g. 2020-05-25 13:30
export const timeFormatter = (time: string): string => {
  const timeValue = Date.parse(time);
  const timeNew = new Date().valueOf();
  const timeDiffer = timeNew - timeValue;
  let text = '';
  switch (true) {
    // Within a minute
    case timeDiffer <= 60000: {
      text = t(Strings.just_now);
      break;
    }
    // Within 1 hour
    case timeDiffer <= 3600000: {
      text = t(Strings.minutes_of_count, {
        count: Math.floor(timeDiffer / 60000),
      });
      break;
    }
    // More than 1 hour and within the same day
    case dayjs.tz().isSame(time, 'd'): {
      text = dayjs.tz(time).format(t(Strings.time_format_today));
      break;
    }
    // Yesterday
    case dayjs.tz(time).add(1, 'day').isSame(dayjs.tz(), 'd'): {
      text = dayjs.tz(time).format(t(Strings.time_format_yesterday));
      break;
    }
    // This year
    case dayjs.tz().isSame(time, 'y'): {
      text = dayjs.tz(time).format(t(Strings.time_format_month_and_day));
      break;
    }
    default:
      text = dayjs.tz(time).format(t(Strings.time_format_year_month_and_day));
      break;
  }
  return text;
};
