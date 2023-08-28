import { IOption } from '@apitable/components';

export enum TimeDimension {
  WEEKDAY = 'WEEKDAY',
  TODAY = 'TODAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export const GET_CREDIT_STATISTICS = '/space/:spaceId/credit/chart';

export const SELECT_LIST: IOption[] = [
  {
    value: TimeDimension.TODAY,
    label: '今日',
  },
  {
    value: TimeDimension.WEEKDAY,
    label: '本周',
  },
  {
    value: TimeDimension.MONTH,
    label: '本月',
  },
  {
    value: TimeDimension.YEAR,
    label: '今年',
  },
];
