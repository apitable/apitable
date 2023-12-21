import React, { FC } from 'react';
import { Timing, NextTimePreview, CronConverter, ICronSchema } from '@apitable/components';

import { Strings, t } from '@apitable/core';

export const AutomationTiming: FC<{
  tz?: string;
  value?: ICronSchema;
  scheduleType?: 'day' | 'month' | 'week' | 'hour';
  options: {
    userTimezone: string;
  };
  onUpdate: (value: ICronSchema) => void;
}> = ({ tz, options, scheduleType, value, onUpdate }) => {
  const settingTimezone = tz ?? options?.userTimezone;

  const cron = CronConverter.convertCronPropsString(value!);
  if (scheduleType == null || value == undefined) {
    return null;
  }
  return (
    <>
      <Timing interval={scheduleType} value={value} onUpdate={onUpdate} readonly={false} />
      <NextTimePreview title={t(Strings.preview_next_automation_execution_time)} cron={cron} tz={settingTimezone} options={options} />
    </>
  );
};
