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

export const NextTimePreview: FC<{
  title: string
  times: Date[]
}> = ({ title , times }) => {
  const colors = useCssColors();
  return (<Box borderColor={colors.borderCommonDefault} borderWidth={'1px'} padding={'8px 12px'}>
    <Typography color={colors.textCommonTertiary} variant={'body4'}>{title}</Typography>

    <Box display={'flex'} flexDirection={'column'} gap={'8px'}>
      {
        times.map((time, index) => {

          return (
            <Typography color={colors.textCommonTertiary} variant={'body4'}>{dayjs(time).format('YYYY-MM-DD HH:mm')}</Typography>
          );
        })
      }
    </Box>
  </Box>);
};
