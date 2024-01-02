/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { FC } from 'react';
import { useCssColors } from '../../hooks/use_css_colors';
import { Box } from '../box';
import { Typography } from '../typography';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { CronConverter } from './utils';
import styled, { css } from 'styled-components';
dayjs.extend(timezone);

const GapBox = styled(Box)<{ gap: string }>`
  ${(props) =>
    props.gap &&
    css`
      gap: ${props.gap};
    `}
`;

export const NextTimePreview: FC<{
  cron: string;
  title: string;
  tz?: string;
  options: {
    userTimezone: string;
  };
}> = ({ title, cron, tz = 'Asia/Shanghai', options }) => {
  const colors = useCssColors();

  return (
    <GapBox
      borderColor={colors.borderCommonDefault}
      borderWidth={'1px'}
      borderStyle={'solid'}
      paddingTop={'16px'}
      padding={'8px 12px'}
      borderRadius={'4px'}
    >
      <Typography
        color={colors.textCommonTertiary}
        variant={'body4'}
        style={{
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      <Box display={'flex'} flexDirection={'column'} gap={'4px'} marginTop={'4px'}>
        {CronConverter.getHumanReadableInformation(cron, tz, options).map((time, index) => {
          return (
            <Typography key={index} color={colors.textCommonTertiary} variant={'body4'}>
              {time}
            </Typography>
          );
        })}
      </Box>
    </GapBox>
  );
};
