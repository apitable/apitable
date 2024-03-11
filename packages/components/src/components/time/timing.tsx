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
import { Maybe } from 'purify-ts/index';
import { Strings, t } from '@apitable/core';
import { Typography } from 'components/typography';
import styled, { css } from 'styled-components';
import { useCssColors } from '../../hooks/use_css_colors';

dayjs.extend(advancedFormat);
export const CONST_EMTPTY = '__DANGER_EMPTY__';

interface Props {
  interval: 'day' | 'month' | 'week' | 'hour';
  readonly?: boolean;
  value: ICronSchema;
  onUpdate?: (value: Props['value']) => void;
}

const GapBox = styled(Box)<{ gap: string; columnGap?: string; rowGap?: string }>`
  flex-wrap: wrap;
  white-space: pre;
  ${(props) =>
    props.rowGap &&
    css`
      row-gap: ${props.rowGap};
    `}
  ${(props) =>
    props.columnGap &&
    css`
      column-gap: ${props.columnGap};
    `}
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
        <GapBox display={'flex'} alignItems={'center'} rowGap={'8px'}>
          <Typography variant={'body3'} color={colors.textCommonPrimary}>
            {Maybe.encase(() => t(Strings.starting_from_midnight)).orDefault('从每天 0 点起，')}
          </Typography>

          <GapBox display={'flex'} flex={'0 0 max-content'} alignItems={'center'} gap={'8px'} flexDirection={'row'}>
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.by_every)).orDefault('每隔')}
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
              {Maybe.encase(() => t(Strings.every_hour_at)).orDefault('小时')}
            </Typography>
          </GapBox>

          <GapBox display={'flex'} flex={'0 0 max-content'} alignItems={'center'} gap={'8px'} flexDirection={'row'}>
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.by_in)).orDefault('的')}
            </Typography>

            <DropdownSelect
              dropDownOptions={{
                placement: 'bottom-start',
              }}
              listStyle={{
                width: '120px',
              }}
              openSearch
              searchPlaceholder={Maybe.encase(() => t(Strings.datasource_selector_search_placeholder)).orDefault('Search')}
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
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.by_min)).orDefault('minute(s)')}
            </Typography>
          </GapBox>
        </GapBox>
      );
    }
    case 'week': {
      const dayInMonths = CronConverter.getLists(value, 'dayOfWeek');
      return (
        <GapBox display={'flex'} alignItems={'center'} rowGap={'8px'} columnGap={'8px'} gap={'8px'}>
          <Box alignItems={'center'} display={'flex'} flex={' 0 0  max-content'}>
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.every_week_at)).orDefault('Every weekday on')}
            </Typography>
          </Box>

          <Box flex={'1 1 auto'} alignItems={'center'} display={'flex'}>
            <MultipleSelect
              triggerStyle={{
                width: '100%',
              }}
              disabled={readonly}
              value={dayInMonths}
              options={weekOptions}
              onChange={(list) => {
                handleUpdateItem(new CronConverter(value).setLists('dayOfWeek', list));
              }}
            />
          </Box>

          <GapBox display={'flex'} flexDirection={'8px'} alignItems={'center'} flex={'0 0 max-content'} gap={'8px'}>
            <Box display={'flex'} alignItems={'center'} flex={'0 0 max-content'}>
              <Typography variant={'body3'} color={colors.textCommonPrimary}>
                {Maybe.encase(() => t(Strings.by_at)).orDefault('at')}
              </Typography>
            </Box>

            <Box display={'flex'} alignItems={'center'} flex={'0 0'}>
              <TimeInput
                readonly={readonly}
                time={new CronConverter(value).getHourTime()}
                onChange={(v) => {
                  const newCro = new CronConverter(value).setHourTime(v);
                  handleUpdateItem(newCro);
                }}
              />
            </Box>
          </GapBox>
        </GapBox>
      );
    }

    case 'month': {
      const monthInterval = CronConverter.getEveryProps(value, 'month', 1);
      const dayInMonths = CronConverter.getLists(value, 'dayOfMonth');
      return (
        <GapBox display={'flex'} alignItems={'center'} flexDirection={'row'} rowGap={'8px'}>
          <GapBox display={'flex'} alignItems={'center'} flex={'0 0 max-content'}>
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.schedule_start_month)).orDefault('从每年 1 月份起，')}
            </Typography>
          </GapBox>
          <GapBox display={'flex'} alignItems={'center'} flex={'0 0 max-content'} gap={'8px'}>
            <Box display={'flex'} alignItems={'center'} flex={'0 0 max-content'}>
              <Typography variant={'body3'} color={colors.textCommonPrimary}>
                {Maybe.encase(() => t(Strings.by_every)).orDefault('每隔')}
              </Typography>
            </Box>
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
              {Maybe.encase(() => t(Strings.every_month_at)).orDefault('month(s)')}
            </Typography>
          </GapBox>

          <GapBox display={'inline-flex'} alignItems={'center'} flex={'0 0 max-content'} gap={'8px'} flexDirection={'row'}>
            <Box display={'flex'} alignItems={'center'} flex={'0 0 max-content'}>
              <Typography variant={'body3'} color={colors.textCommonPrimary}>
                {Maybe.encase(() => t(Strings.by_on)).orDefault(' on the')}
              </Typography>
            </Box>
            <MultipleSelect
              triggerStyle={{
                minWidth: '150px',
              }}
              listStyle={{
                minWidth: '40px',
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
          </GapBox>

          <GapBox flex={'0 0 max-content'} alignItems={'center'} display={'flex'} flexDirection={'row'} gap={'8px'} paddingLeft={'8px'}>
            <GapBox flex={'0 0 max-content'}>
              <Typography variant={'body3'} color={colors.textCommonPrimary}>
                {Maybe.encase(() => t(Strings.by_at)).orDefault('at')}
              </Typography>
            </GapBox>

            <Box display={'flex'} alignItems={'center'} flex={'0 0 '}>
              <TimeInput
                readonly={readonly}
                time={new CronConverter(value).getHourTime()}
                onChange={(v) => {
                  const a = new CronConverter(value).setHourTime(v);
                  handleUpdateItem(a);
                }}
              />
            </Box>
          </GapBox>
        </GapBox>
      );
    }
    case 'day': {
      const dayInterval = CronConverter.getEveryProps(value, 'dayOfMonth', 1);
      return (
        <GapBox display={'flex'} alignItems={'center'} rowGap={'8px'}>
          <Typography variant={'body3'} color={colors.textCommonPrimary}>
            {Maybe.encase(() => t(Strings.schedule_start_day)).orDefault('从每月 1 日起，')}
          </Typography>
          <GapBox display={'flex'} alignItems={'center'} gap={'8px'} flex={'0 0 max-content'}>
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.by_every)).orDefault('every')}
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
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.every_day_at)).orDefault('天')}
            </Typography>
          </GapBox>

          <GapBox display={'flex'} alignItems={'center'} gap={'8px'} flex={'0 0 max-content'}>
            <Typography variant={'body3'} color={colors.textCommonPrimary}>
              {Maybe.encase(() => t(Strings.by_in)).orDefault(' at')}
            </Typography>

            <TimeInput
              readonly={readonly}
              time={new CronConverter(value).getHourTime()}
              onChange={(v) => {
                const a = new CronConverter(value).setHourTime(v);
                handleUpdateItem(a);
              }}
            />
          </GapBox>
        </GapBox>
      );
    }

    default: {
      return <></>;
    }
  }
};
