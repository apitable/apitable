import { TimeDimension } from 'pc/components/space_manage/space_info/components/credit_cost_card/enum';
import { formatDate } from './date';

// const weekend = JSON.parse(t(Strings.ai_credit_time_dimension_weekend));

type IDataItem = {
  dateline: string;
  count: number;
};

export const convertDate = (timeDimension: TimeDimension, data: IDataItem[]) => {
  if (!data) return [];
  return formatData(timeDimension, data);
};

export const formatData = (timeDimension: TimeDimension, data: IDataItem[]) => {
  return data.map((item) => {
    return {
      dateline: formatDate(timeDimension, item.dateline),
      credit: item.count,
    };
  });
};
