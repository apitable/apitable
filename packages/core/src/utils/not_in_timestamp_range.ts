import { DateRange, ITimestamp } from 'types/field_types';

export const notInTimestampRange = (timestamp: ITimestamp) => {
  return timestamp < DateRange.MinTimeStamp || timestamp > DateRange.MaxTimeStamp;
};