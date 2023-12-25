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

import React, { FC, useCallback, useMemo } from 'react';
import { DropdownSelect } from '../select';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';
import { TimeInput } from './time_input';
import CronTime from 'cron-time-generator';
import { ICronSchema } from './types';
import { CronConverter } from './utils';
import { MultipleSelect } from '../select/dropdown/multiple';
import { ScheduleOptions } from './ScheduleOptions';
import { Box } from 'components/box';
import { Maybe } from 'purify-ts';
import { Strings, t } from '@apitable/core';
import { Typography } from 'components/typography';
import styled, { css } from 'styled-components';
import { useCssColors } from '../../hooks/use_css_colors';

dayjs.extend(advancedFormat);

interface Props {
  interval: 'day' | 'month' | 'week' | 'hour';
  readonly?: boolean;
  value: ICronSchema;
  onUpdate?: (value: Props['value']) => void;
}

const GapBox = styled(Box)<{ gap: string }>`
  flex-wrap: wrap;
  ${(props) =>
    props.gap &&
    css`
      gap: ${props.gap};
    `}
`;
export const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1).map((num) => ({
  label: String(num),
  value: num.toString(),
}));

export const minuteOptions = Array.from({ length: 60 }, (_, i) => i).map((num) => ({
  label: num < 10 ? `0${num}` : String(num),
  value: num.toString(),
}));

export const Timing: FC<Props> = ({ interval, readonly = false, value, onUpdate }) => {
  const handleUpdateItem = useCallback(
    (cron: ICronSchema) => {
      console.info('new cron', cron);
      onUpdate?.(cron);
    },
    [onUpdate]
  );

  const dayOptionsWithLastDay = useMemo(() => ScheduleOptions.getDayOptions(), []);
  const weekOptions = useMemo(() => ScheduleOptions.getWeekOptions(), []);

  const dayOptions = useMemo(() => ScheduleOptions.getHourIntervalOptions(), []);
  const dayIntervalOptions = useMemo(() => ScheduleOptions.getDayIntervalOptions(), []);
  const colors = useCssColors();

  switch (interval) {
    case 'hour': {
      const hourInterval = CronConverter.getEveryProps(value, 'hour', 1);
      const minutes = CronConverter.getNumericProps(value, 'minute', 0);

      return (
        <GapBox display={'flex'} alignItems={'center'} gap={'8px'}>
          <Typography variant={'body3'} color={colors.textCommonPrimary}>
            {Maybe.encase(() => t(Strings.every)).orDefault('Every')}
          </Typography>

          <DropdownSelect
            disabled={readonly}
            triggerStyle={{
              minWidth: '64px',
            }}
            listStyle={{
              width: '120px',
            }}
            dropDownOptions={{
              placement: 'bottom-start',
            }}
            openSearch
            searchPlaceholder={Maybe.encase(() => t(Strings.datasource_selector_search_placeholder)).orDefault('Search')}
            value={String(hourInterval)}
            options={dayOptions}
            onSelected={(node) => {
              const everyHour = CronTime.every(Number(node.value)).hours();
              handleUpdateItem(
                CronConverter.updateCronProps('hour', {
                  previous: value,
                  next: everyHour,
                })
              );
            }}
          />

          <Typography variant={'body3'} color={colors.textCommonPrimary}>
            {Maybe.encase(() => t(Strings.every_hour_at)).orDefault('小时的')}
          </Typography>

          <DropdownSelect
            dropDownOptions={{
              placement: 'bottom-start',
            }}
            triggerStyle={{
              minWidth: '64px',
            }}
            openSearch
            searchPlaceholder={Maybe.encase(() => t(Strings.datasource_selector_search_placeholder)).orDefault('Search')}
            suffixContent={
              <Box paddingLeft={'8px'} display={'inline-flex'} alignItems={'center'}>
                <Typography variant={'body3'} color={colors.textCommonPrimary}>
                  {Maybe.encase(() => t(Strings.by_min)).orDefault('Min')}
                </Typography>
              </Box>
            }
            hiddenArrow
            value={String(minutes)}
            disabled={readonly}
            options={minuteOptions}
            onSelected={(node) => {
              const miniute = Number(node.value);

              const everyHour = CronTime.everyHourAt(miniute);
              handleUpdateItem(
                CronConverter.updateCronProps('minute', {
                  previous: value,
                  next: everyHour,
                })
              );
            }}
          />
        </GapBox>
      );
    }
    case 'week': {
      const dayInMonths = CronConverter.getLists(value, 'dayOfWeek');
      return (
        <GapBox display={'flex'} alignItems={'center'} gap={'8px'}>
          <Typography variant={'body3'} color={colors.textCommonPrimary}>
            {Maybe.encase(() => t(Strings.every_week_at)).orDefault('Every weekday on')}
          </Typography>

          <MultipleSelect
            triggerStyle={{
              minWidth: '218px',
              width: '218px',
            }}
            disabled={readonly}
            value={dayInMonths}
            options={weekOptions}
            onChange={(list) => {
              handleUpdateItem(new CronConverter(value).setLists('dayOfWeek', list));
            }}
          />

          {Maybe.encase(() => t(Strings.by_at)).orDefault('at').length > 0 && (
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.by_at)).orDefault('at')}
            </Typography>
          )}

          <TimeInput
            readonly={readonly}
            time={new CronConverter(value).getHourTime()}
            onChange={(v) => {
              const newCro = new CronConverter(value).setHourTime(v);
              handleUpdateItem(newCro);
            }}
          />
        </GapBox>
      );
    }

    case 'month': {
      const monthInterval = CronConverter.getEveryProps(value, 'month', 1);
      const dayInMonths = CronConverter.getLists(value, 'dayOfMonth');
      return (
        <GapBox display={'flex'} alignItems={'center'} gap={'8px'}>
          <Typography variant={'body3'} color={colors.textCommonPrimary}>
            {Maybe.encase(() => t(Strings.every)).orDefault('Every')}
          </Typography>

          <DropdownSelect
            disabled={readonly}
            dropDownOptions={{
              placement: 'bottom-start',
            }}
            value={String(monthInterval)}
            triggerStyle={{
              minWidth: '64px',
            }}
            openSearch
            searchPlaceholder={Maybe.encase(() => t(Strings.datasource_selector_search_placeholder)).orDefault('Search')}
            listStyle={{
              width: '120px',
            }}
            options={monthOptions}
            onSelected={(node) => {
              const v = new CronConverter(value).setInterval('month', Number(node.value));
              handleUpdateItem(v);
            }}
          />

          <Typography variant={'body3'} color={colors.textCommonPrimary}>
            {Maybe.encase(() => t(Strings.every_month_at)).orDefault('month on')}
          </Typography>

          <MultipleSelect
            triggerStyle={{
              width: '142px',
            }}
            searchPlaceholder={Maybe.encase(() => t(Strings.datasource_selector_search_placeholder)).orDefault('Search')}
            openSearch
            value={dayInMonths}
            disabled={readonly}
            options={dayOptionsWithLastDay}
            onChange={(list) => {
              handleUpdateItem(new CronConverter(value).setLists('dayOfMonth', list));
            }}
          />

          {Maybe.encase(() => t(Strings.by_at)).orDefault('at').length > 0 && (
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.by_at)).orDefault('at')}
            </Typography>
          )}

          <TimeInput
            readonly={readonly}
            time={new CronConverter(value).getHourTime()}
            onChange={(v) => {
              const a = new CronConverter(value).setHourTime(v);
              handleUpdateItem(a);
            }}
          />
        </GapBox>
      );
    }
    case 'day': {
      const dayInterval = CronConverter.getEveryProps(value, 'dayOfMonth', 1);
      return (
        <GapBox display={'flex'} alignItems={'center'} gap={'8px'}>
          <Typography variant={'body3'} color={colors.textCommonPrimary}>
            {Maybe.encase(() => t(Strings.every)).orDefault('Every ')}
          </Typography>
          <DropdownSelect
            dropDownOptions={{
              placement: 'bottom-start',
            }}
            triggerStyle={{
              minWidth: '64px',
            }}
            openSearch
            searchPlaceholder={Maybe.encase(() => t(Strings.datasource_selector_search_placeholder)).orDefault('Search')}
            listStyle={{
              width: '120px',
            }}
            disabled={readonly}
            value={String(dayInterval)}
            options={dayIntervalOptions}
            onSelected={(node) => {
              const everyHour = CronTime.every(Number(node.value)).days();
              handleUpdateItem(
                CronConverter.updateCronProps('dayOfMonth', {
                  previous: value,
                  next: everyHour,
                })
              );
            }}
          />

          <Box display={'inline-flex'} alignItems={'center'}>
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.every_day_at)).orDefault('天的')}
            </Typography>
          </Box>

          <TimeInput
            readonly={readonly}
            time={new CronConverter(value).getHourTime()}
            onChange={(v) => {
              const a = new CronConverter(value).setHourTime(v);
              handleUpdateItem(a);
            }}
          />
        </GapBox>
      );
    }

    default: {
      return <></>;
    }
  }
};
