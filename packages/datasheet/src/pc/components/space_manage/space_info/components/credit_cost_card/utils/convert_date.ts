import { Strings, t } from '@apitable/core';
import { TimeDimension } from 'pc/components/space_manage/space_info/components/credit_cost_card/enum';

const weekend = JSON.parse(t(Strings.ai_credit_time_dimension_weekend));

type IDataItem = {
  dateline: string;
  count: number;
};

const convertStrategy = {
  [TimeDimension.TODAY]: (data: IDataItem[]) => {
    return data;
  },
  [TimeDimension.WEEKDAY]: (data: IDataItem[]) => {
    return data.map((item, index) => {
      return {
        dateline: weekend[index],
        count: item.count,
      };
    });
  },
  [TimeDimension.MONTH]: (data: IDataItem[]) => {
    return data;
  },
  [TimeDimension.YEAR]: (data: IDataItem[]) => {
    return data;
  },
};

export const convertDate = (timeDimension: TimeDimension, data: IDataItem[]) => {
  if (!data) return [];
  return convertStrategy[timeDimension](data);
};
