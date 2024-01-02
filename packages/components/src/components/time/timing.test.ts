import { CronConverter } from './utils';
import CronTime from 'cron-time-generator';
import dayjs from 'dayjs';

import 'dayjs/locale/zh';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/zh-tw';

describe('timing test', () => {
  it('default get default value', () => {
    expect(CronConverter.getDefaultValue('week')).toBe('0 0 * * 6'); // At 00:00 on Saturday
    expect(CronConverter.getDefaultValue('month')).toBe('0 0 1 * *'); // At 00:00 on day-of-month 1.
  });

  it('default render validate', () => {
    // At minute 0 past every 5th hour.
    const cron = '0 */5 *';
    expect(CronConverter.extractCron(cron) == null).toBe(true);
  });

  it('default render 1', () => {
    // At minute 0 past every 5th hour.
    const cron = '0 */5 * * 1L';
    expect(CronConverter.extractCron(cron) == null).toBe(false);
  });

  it('check every hour', () => {
    const every2Day = CronTime.every(Number(2)).days();

    expect(every2Day).toBe('0 0 */2 * *');
    expect(CronConverter.extractCron(every2Day)).toBeDefined();
    expect(CronConverter.getEveryProps(CronConverter.extractCron(every2Day)!, 'dayOfMonth', 0)).toBe(2);
  });

  it('check mutiple day', () => {
    const every2Day = CronTime.onSpecificDays([2, 3]); //At 00:00 on Tuesday and Wednesday.
    expect(every2Day).toBe('0 0 * * 2,3');
  });

  it('check mutiple day of month', () => {
    const everyDay = CronTime.everyDay();
    // https://crontab.guru/#0_0_1,3_*_*
    // At 00:00 on day-of-month 1 and 3.
    expect(CronConverter.convertCronPropsString(CronConverter.setDaysOfMonth(CronConverter.extractCron(everyDay)!, [1, 2, 3]))).toBe('0 0 1,2,3 * *');
  });

  it('check every hour', () => {
    const every2Day = CronTime.every(Number(2)).days();
    expect(every2Day).toBe('0 0 */2 * *');

    const every3Day = CronTime.everyHour();

    const newCon = CronConverter.updateCronProps('hour', {
      previous: CronConverter.extractCron(every2Day)!,
      next: every3Day,
    });

    // https://crontab.guru/#0_*_*/2_*_*
    expect(CronConverter.convertCronPropsString(newCon)).toBe('0 * */2 * *'); //“At minute 0 on every 2nd day-of-month
  });

  it('check get interval hour', () => {
    expect(dayjs.locale()).toBe('en');
  });

  it('check get interval hour', () => {
    expect(dayjs().locale('zh-cn').format('Do')).toContain('日');
    expect(dayjs().locale('zh-cn').format('dddd')).toContain('星期');
  });

  it('check get interval hour', () => {
    expect(
      CronConverter.getEveryProps(
        {
          hour: '*/3',
        },
        'hour',
        0
      )
    ).toBe(3);
  });

  it('read human timezone info', () => {
    expect(
      CronConverter.getHumanReadableInformation('0 */5 * * *', 'Europe/London', {
        userTimezone: 'Asia/Shanghai',
      }).length
    ).toBe(10);
  });

  it('check every hour', () => {
    // At minute 0 past every 5th hour.
    const d = '0 */5 * * *';
    expect(CronConverter.extractCron(d) == null).toBe(false);

    const r = CronConverter.extractCron(d);
    if (r != undefined) {
      expect(CronConverter.getEveryProps(r, 'hour', 0)).toBe(5);
    }
  });

  it('default convertCronPropsString', () => {
    const data = CronConverter.convertCronPropsString({
      minute: '5',
      hour: '*/5',
      month: '*',
      dayOfWeek: '*',
      dayOfMonth: '*',
    });
    expect(data).toBe('5 */5 * * *');
  });

  it('check get interval Utc ', () => {
    expect(dayjs().tz('Asia/Shanghai').utcOffset() / 60).toBe(8);
  });
});
