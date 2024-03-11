import dayjs from 'dayjs';
import { t, Strings } from '@apitable/core';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

import 'dayjs/locale/zh';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/zh-tw';
import { Maybe } from 'purify-ts/index';

export const ScheduleOptions = {
  getDayIntervalOptions: () => {
    const dayIntervalOptions = Array.from({ length: 30 }, (_, i) => {
      return i + 1;
    }).map((num) => ({
      label: String(num),
      value: String(num),
    }));
    return dayIntervalOptions;
  },
  getWeekOptions: () => {
    const weekOptions = Array.from({ length: 7 }, (_, i) => i)
      .map((item) => dayjs().day(item))
      .map((num) => ({
        label: num.format('dddd'),
        value: num.day().toString(),
      }));
    return weekOptions;
  },
  getHourIntervalOptions: () => {
    const hourOptions = Array.from({ length: 24 }, (_, i) => i + 1).map((num) => ({
      label: String(num),
      value: num.toString(),
    }));
    return hourOptions;
  },
  getDayOptions: () => {
    const dayOptions = Array.from({ length: 31 }, (_, i) => {
      return dayjs().set('date', i + 1);
    }).map((num) => ({
      label: num.format('Do'),
      value: num.date().toString(),
    }));
    const dayOptionsWithLastDay = dayOptions.concat({
      label: Maybe.encase(() => t(Strings.last_day)).orDefault('最后一天'),
      value: '1L',
    });
    return dayOptionsWithLastDay;
  },
};
