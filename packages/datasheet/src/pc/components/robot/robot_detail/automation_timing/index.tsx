import React, { FC, memo } from 'react';
import { TimeTips, Timing, NextTimePreview, CronConverter, ICronSchema, Box } from '@apitable/components';

import { Strings, t } from '@apitable/core';

const AutomationTimingComp: FC<{
  tz?: string;
  value?: ICronSchema;
  scheduleType?: 'day' | 'month' | 'week' | 'hour';
  options: {
    userTimezone: string;
  };
  onUpdate?: (_: ICronSchema) => void;
}> = ({ tz, options, scheduleType, value, onUpdate }) => {
  const settingTimezone = tz ?? options?.userTimezone;

  const cron = CronConverter.convertCronPropsString(value!);
  if (scheduleType == null || value == undefined) {
    return null;
  }
  return (
    <Box>
      <Timing interval={scheduleType} value={value} onUpdate={onUpdate} readonly={false} />

      <TimeTips interval={scheduleType} />

      <Box marginTop={'16px'}>
        <NextTimePreview title={t(Strings.preview_next_automation_execution_time)} cron={cron} tz={settingTimezone} options={options} />
      </Box>
    </Box>
  );
};

export const AutomationTiming = memo(AutomationTimingComp);
