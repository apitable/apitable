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

import { Dayjs } from 'dayjs';
import { FC, useRef, memo, useContext } from 'react';
import { DateUnitType, Strings, t } from '@apitable/core';
import { GanttCoordinate } from 'pc/components/gantt_view';
import { Rect, Text, autoSizerCanvas } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';

interface IOperationBarProps {
  instance: GanttCoordinate;
  scrollLeft: number;
  columnStartIndex: number;
  columnStopIndex: number;
  ganttWidth: number;
}

const TAB_BAR_HEIGHT = 40;
const INNER_PADDING = 24;
const TEXT_MARGIN_LEFT = 24;

export const OperationBar: FC<React.PropsWithChildren<IOperationBarProps>> = memo((props) => {
  const { instance, scrollLeft, columnStartIndex: _columnStartIndex, columnStopIndex } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const columnStartIndex = _columnStartIndex + 1;
  const textSizer = useRef(autoSizerCanvas);
  const startDateList: { date: Dayjs; x: number }[] = [];
  const { unitType, dateUnitType } = instance;
  const formatStr =
    dateUnitType === DateUnitType.Year ? t(Strings.gantt_date_form_start_time_year) : t(Strings.gantt_date_form_start_time_year_month);

  for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex - 1; columnIndex++) {
    switch (dateUnitType) {
      case DateUnitType.Week:
      case DateUnitType.Month: {
        const dateOfMonth = instance.getDateFromStartDate(columnIndex);
        if (dateOfMonth.date() === 1) {
          startDateList.push({
            x: instance.getColumnOffset(columnIndex),
            date: dateOfMonth,
          });
        }
        break;
      }
      case DateUnitType.Quarter: {
        const dateOfQuarter = instance.getDateFromStartDate(columnIndex, unitType);
        const endDateOfWeek = dateOfQuarter.endOf('week');
        const startDateOfMonth = endDateOfWeek.startOf('month');
        if (startDateOfMonth.isSame(endDateOfWeek, 'week')) {
          const diffCount = instance.getIndexFromStartDate(startDateOfMonth);
          startDateList.push({
            x: instance.getUnitOffset(diffCount),
            date: startDateOfMonth,
          });
        }
        break;
      }
      case DateUnitType.Year: {
        const dateOfYear = instance.getDateFromStartDate(columnIndex, unitType);
        if (dateOfYear.month() === 0) {
          startDateList.push({
            x: instance.getColumnOffset(columnIndex),
            date: dateOfYear,
          });
        }
      }
    }
  }

  // Availability of time-accurate start dates within the visible range
  const isStartDateExist = Boolean(startDateList.length);
  const diff = Math.floor(isStartDateExist ? startDateList[0].x - scrollLeft : -1);
  const prevDate = instance.getDateFromStartDate(columnStartIndex * instance.unitScale);
  const curDate = instance.getDateFromStartDate((columnStartIndex + 1) * instance.unitScale);
  const prevDateFormatStr = prevDate ? prevDate.format(formatStr) : '';
  const curDateFormatStr = curDate ? curDate.format(formatStr) : '';
  const maxThreshold = textSizer.current.measureText(prevDateFormatStr).width + INNER_PADDING + 5;
  // Display of real time distances within the upper and lower thresholds
  const flagX = 0 <= diff && diff <= maxThreshold ? scrollLeft + INNER_PADDING - maxThreshold + diff : scrollLeft + INNER_PADDING;
  const flagText = diff < INNER_PADDING ? curDateFormatStr : prevDateFormatStr;

  return (
    <>
      {isStartDateExist &&
        startDateList.map((item, index) => {
          if (index === 0 && diff <= 0) return;
          const { x, date } = item;
          const formatText = date.format(formatStr);
          return <Text key={index} x={x + TEXT_MARGIN_LEFT} height={TAB_BAR_HEIGHT} text={formatText} fill={colors.fc1} />;
        })}
      <Text x={flagX} height={TAB_BAR_HEIGHT} text={flagText} fill={colors.fc1} />
      <Rect x={scrollLeft} y={1} width={INNER_PADDING} height={TAB_BAR_HEIGHT - 2} />
    </>
  );
});
