import { IOption } from '@apitable/components';
import { Strings, t } from '@apitable/core';

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
    label: t(Strings.ai_credit_time_dimension_today),
  },
  {
    value: TimeDimension.WEEKDAY,
    label: t(Strings.ai_credit_time_dimension_week),
  },
  {
    value: TimeDimension.MONTH,
    label: t(Strings.ai_credit_time_dimension_month),
  },
  {
    value: TimeDimension.YEAR,
    label: t(Strings.ai_credit_time_dimension_year),
  },
];
