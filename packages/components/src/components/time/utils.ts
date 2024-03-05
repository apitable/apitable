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

import { ICronSchema } from './types';

import { Just, Maybe, Nothing } from 'purify-ts/index';
import parser from 'cron-parser';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CronTime from 'cron-time-generator';

dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const integratedMinitue = (value: number) => {
  return String(value < 10 ? `0${value}` : value);
};

export type AutomationInterval = 'day' | 'month' | 'week' | 'hour';
type AutomationCron = string;

export const getUTCOffset = (time: Date, timezone: string): string => {
  // dayjs(time).tz(options.userTimezone).utcOffset() / 60
  try {
    const utcOffset = dayjs(time).tz(timezone).utcOffset();
    const r = utcOffset / 60;
    return r < 0 ? `${r}` : `+${r}`;
  } catch {
    const utcOffset = dayjs().utcOffset();
    const r = utcOffset / 60;
    return r < 0 ? `${r}` : `+${r}`;
  }
};
export class CronConverter {
  cron: ICronSchema;

  static setDaysOfMonth = (test: ICronSchema, list: IDayOption[]): ICronSchema => {
    const REPLACEMENTS = '1-30';

    const sorted = list.sort((a, b) => String(a).localeCompare(String(b)));
    const text = sorted.join(',');

    const every2Day = CronTime.between(1, 30).days().replace(REPLACEMENTS, text);
    const newCon = CronConverter.updateCronProps('dayOfMonth', {
      previous: test,
      next: every2Day,
    });
    return newCon;
  };

  static extractCron = (cronExpression: string): undefined | ICronSchema => {
    try {
      parser.parseExpression(cronExpression);
    } catch (e) {
      return undefined;
    }
    const matches = cronExpression.split(/\s/);
    if (matches.length !== 5) {
      return undefined;
    }

    const minute = matches[0];
    const hour = matches[1];
    const dayOfMonth = matches[2];
    const month = matches[3];
    const dayOfWeek = matches[4];
    if (minute && hour && dayOfMonth && hour && dayOfMonth) {
      return {
        minute,
        hour,
        dayOfWeek,
        month,
        dayOfMonth,
      };
    }
    return undefined;
  };

  static getHumanReadableInformation = (
    cron: string,
    tz: string,
    options: {
      userTimezone: string;
    }
  ): string[] => {
    return Maybe.encase(() => {
      const interval = parser.parseExpression(cron, {
        startDate: new Date(),
        currentDate: new Date(),
        iterator: true,
        tz: tz,
      });

      const newTimes = [
        interval.next().value.toDate(),
        interval.next().value.toDate(),
        interval.next().value.toDate(),
        interval.next().value.toDate(),
        interval.next().value.toDate(),
        interval.next().value.toDate(),
        interval.next().value.toDate(),
        interval.next().value.toDate(),
        interval.next().value.toDate(),
        interval.next().value.toDate(),
      ];

      return newTimes.map(
        (time) =>
          `${dayjs(time).tz(options.userTimezone).format(CONST_FORMAT_AUTOMATION_TIME)} UTC${getUTCOffset(time, options.userTimezone)} (${
            options.userTimezone
          })`
      );
    }).orDefault([]);
  };

  static convertCronPropsString = (cron: ICronSchema): string => {
    return [cron.minute, cron.hour, cron.dayOfMonth, cron.month, cron.dayOfWeek].join(' ');
  };
  constructor(cron: ICronSchema | string) {
    if (typeof cron === 'string') {
      const resp = CronConverter.extractCron(cron);
      if (resp != null) {
        this.cron = resp;
      } else {
        this.cron = CronConverter.extractCron(CronTime.everyDay())!;
      }
    } else {
      this.cron = cron;
    }
  }

  static getHourTime = (text: string) => {
    const arry = text.split(':');
    const hour = Maybe.fromPredicate((x: number) => !isNaN(x))(Number(arry[0])).orDefault(0);

    const minute = Maybe.fromPredicate((x: number) => !isNaN(x))(Number(arry[1])).orDefault(0);
    return `${integratedMinitue(hour)}:${integratedMinitue(minute)}`;
  };

  public setHourTime = (text: string) => {
    const arry = text.split(':');
    const hour = Maybe.fromPredicate((x: number) => !isNaN(x))(Number(arry[0])).orDefault(0);

    const minute = Maybe.fromPredicate((x: number) => !isNaN(x))(Number(arry[1])).orDefault(0);

    const newInfo = CronTime.everyDayAt(hour, minute);

    const newCon = CronConverter.updateCronProps('hour', {
      previous: this.cron,
      next: newInfo,
    });
    return CronConverter.updateCronProps('minute', {
      previous: newCon,
      next: newInfo,
    });
  };

  public getHourTime = () => {
    const hour = this.cron.hour;
    const minute = this.cron.minute;

    const hourText = Maybe.fromPredicate((x: number) => !isNaN(x))(Number(hour)).orDefault(0);
    const hourMiniute = Maybe.fromPredicate((x: number) => !isNaN(x))(Number(minute)).orDefault(0); // TODO
    return `${integratedMinitue(hourText)}:${integratedMinitue(hourMiniute)}`;
  };

  static getDefaultValue = (interval: AutomationInterval): AutomationCron => {
    switch (interval) {
      case 'hour': {
        return CronTime.everyHourAt(0);
      }
      case 'day': {
        return CronTime.everyDayAt(0, 0);
      }
      case 'week': {
        return CronTime.onSpecificDaysAt([6], 0, 0);
      }
      case 'month': {
        return CronTime.everyMonthOn(1, 0, 0);
      }
      default: {
        return CronTime.everyHourAt(0);
      }
    }
  };

  static minuteFormatter = (value: number) => {
    return String(value < 10 ? `0${value}` : value);
  };

  static updateCronProps = <T extends keyof ICronSchema>(
    name: T,
    option: {
      previous: ICronSchema;
      next: string;
    }
  ): ICronSchema => {
    const { previous, next } = option;
    const data = CronConverter.extractCron(next);
    if (!data) {
      return previous;
    }
    return {
      ...previous,
      [name]: data[name],
    };
  };

  static getEveryPropsOption1 = <K extends keyof ICronSchema>(item: ICronSchema, name: K): Maybe<number> => {
    const cronExpression = item[name];
    if (!cronExpression) {
      return Nothing;
    }

    const regex = /^\*\/(\d+)$/;
    const matches = String(cronExpression).match(regex);
    const mayOption = Maybe.fromNullable(matches)
      .map((r) => r[1])
      .map((r) => Number(r));
    return mayOption;
  };

  public setLists = <K extends keyof ICronSchema>(name: K, list: (string | number)[]): ICronSchema => {
    if (list.length === 0) {
      return this.cron;
    }
    const sorted = list.sort((a, b) => String(a).localeCompare(String(b))).join(',');

    return {
      ...this.cron,
      [name]: sorted,
    };
  };

  static getLists = <K extends keyof ICronSchema>(item: ICronSchema, name: K): string[] => {
    const cronExpression = item[name];
    if (!cronExpression) {
      return [];
    }
    return Maybe.encase(() => String(cronExpression).split(',')).orDefault([]);
  };

  public setInterval = <K extends keyof ICronSchema>(name: K, interval: number) => {
    if (Number.isNaN(interval)) {
      return this.cron;
    }
    return {
      ...this.cron,
      [name]: `*/${interval}`,
    };
  };

  static getEveryProps = <K extends keyof ICronSchema>(item: ICronSchema, name: K, defaultValue: number) => {
    const cronExpression = item[name];
    if (!cronExpression) {
      return defaultValue;
    }

    const regex = /^\*\/(\d+)$/;
    const matches = String(cronExpression).match(regex);
    const mayOption = Maybe.fromNullable(matches)
      .map((r) => r[1])
      .map((r) => Number(r));
    return mayOption.orDefault(defaultValue);
  };

  static getNumericProps = <K extends keyof ICronSchema>(item: ICronSchema, name: K, defaultValue: number) => {
    const cronExpression = item[name];
    if (!cronExpression) {
      return defaultValue;
    }

    const mayOption = Maybe.fromNullable(cronExpression)
      .map((r) => Number(r))
      .chain((x) => (isNaN(x) ? Nothing : Just(x)));
    return mayOption.orDefault(defaultValue);
  };
}

export const CONST_FORMAT_AUTOMATION = 'YYYY-MM-DD HH:mm zzz z';
export const CONST_FORMAT_AUTOMATION_TIME = 'YYYY-MM-DD HH:mm';

type IDayOption = string | number;
