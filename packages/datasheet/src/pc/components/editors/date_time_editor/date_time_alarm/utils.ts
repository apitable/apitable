import { IRecordAlarm, IRecordAlarmClient } from '@vikadata/core';
import { omit } from 'lodash';

export const convertAlarmStructure = (alarm?: IRecordAlarmClient | undefined): IRecordAlarm | undefined => {
  if (!alarm) {
    return;
  }
  const alarmUsers = alarm.alarmUsers.map(id => {
    return {
      type: alarm.target,
      data: id
    };
  });
  return {
    ...omit(alarm, 'target'),
    alarmUsers
  };
};
