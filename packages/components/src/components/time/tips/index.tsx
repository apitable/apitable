import { Strings, t } from '@apitable/core';
import React, { FC } from 'react';
import { Box } from '../../box';
import { Typography } from '../../typography';
import { useCssColors } from '../../../hooks/use_css_colors';
import { InfoCircleOutlined } from '@apitable/icons';
import { Maybe } from 'purify-ts/index';

export const TimeTips: FC<{
  interval: 'day' | 'month' | 'week' | 'hour';
}> = ({ interval }) => {
  const colors = useCssColors();
  if (interval === 'week') {
    return null;
  }

  let tips: string = '';
  if (interval === 'month') {
    tips = Maybe.encase(() => t(Strings.schedule_year_tips)).orDefault(
      '周期计算从每年的 1 月份开始算，假设设置为每隔 3 个月的 1 日，则每年的 1 月，4 月，7 月，10 月的第一天会触发'
    );
  } else if (interval === 'day') {
    tips = Maybe.encase(() => t(Strings.schedule_day_tips)).orDefault(
      '周期计算从每个月的 1 日开始算，假设设置为每隔 10 天，则每月的 1 日，11 日，21 日，31 日会触发'
    );
  } else if (interval === 'hour') {
    tips = Maybe.encase(() => t(Strings.schedule_hour_tips)).orDefault(
      '周期计算从每天的 0 点开始算，假设设置为每隔 3 个小时的 0 分，则每天的 0 点，3 点，6 点，9 点，12 点，15 点，18 点，21 点会触发'
    );
  }

  return (
    <Box display={'flex'} flexDirection={'row'} marginTop={'16px'} padding={'8px'} borderRadius={'4px'} backgroundColor={colors.bgControlsDefault}>
      <Box flex={'0 0 max-content'} paddingTop={'2px'}>
        <InfoCircleOutlined size={16} color={colors.textCommonTertiary} />
      </Box>

      <Box flex={'1 1 auto'} paddingLeft={'8px'}>
        <Typography color={colors.textCommonTertiary} variant={'body4'}>
          {tips}
        </Typography>
      </Box>
    </Box>
  );
};
