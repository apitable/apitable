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

import React, { memo, useContext, useMemo } from 'react';
import format from 'date-fns/format';
import { FORMAT, MAX_LEVEL } from '../constants';
import { formatDayValue } from '../utils';
import { DaySpan, DayDiv } from './styled';
import classNames from 'classnames';
import { ILevelResult } from '../interface';
import { take } from 'lodash';
import { Task } from './task';
import { CalendarContext } from '../calendar_context';
import { MoreTask } from './more_task';

interface IWeek {
  week: {
    day: number;
    month: number;
  }[];
  weekLevel: number;
  levelTasks: ILevelResult[][];
  rowHeight: number;
}

export const WeekBase = (props: IWeek) => {
  const { week, weekLevel, levelTasks, rowHeight } = props;
  const { disabled, month, update, Drop, year, today } = useContext(CalendarContext);
  const takeLevels = take(levelTasks, MAX_LEVEL);

  const { moreTasks, more } = useMemo(() => {
    const more = new Array(7).fill(0);
    const moreTasks = new Array(7).fill([]);
    levelTasks.forEach(level => {
      level.forEach(levelItem => {
        const { left, len } = levelItem;
        for (let i = 0; i < len; i++) {
          const mIdx = left + i - 1;
          more[mIdx]++;
          moreTasks[mIdx] = moreTasks[mIdx].concat(levelItem);
        }
      });
    });
    return { more, moreTasks };
  }, [levelTasks]);
  return (
    <div className="week-row" key={weekLevel} style={{ height: rowHeight + 'px' }}>
      <div className="row-bg">
        {week.map((weekItem, idx) => {
          const { day, month: m } = weekItem;
          const currDay = new Date(year, m - 1, day);
          const isToday = today === format(currDay, FORMAT);
          let dayValue: string | number = day;
          if (day === 1 && !isToday) {
            const showMonth = m > 12 ? m % 12 : m;
            dayValue = formatDayValue(showMonth, day);
          }
          const dayContent = (
            <DaySpan className="day-value">
              {dayValue}
            </DaySpan>
          );
          return (
            <DayDiv
              key={`${m}-${day}`}
              className={classNames('day', {
                weekend: [0, 6].includes((idx + 1) % 7),
                curMonth: m === month,
                today: isToday
              })}
            >
              {Drop ? <Drop children={dayContent} date={currDay} update={update} disabled={disabled} /> : dayContent}
            </DayDiv>
          );
        })}
      </div>
      {takeLevels.map((level, levelIdx) => {
        return (
          <div className="level-row" key={levelIdx}>
            {level.map((levelItem, levelItemIdx) => (
              <Task key={levelItemIdx} levelItem={levelItem} levelIdx={levelIdx} />
            ))}
          </div>
        );
      })}
      {more.map((m, mIndex) => {
        if (m <= MAX_LEVEL) {
          return null;
        }
        const curDay = week[mIndex]!;
        return (
          <MoreTask
            key={mIndex}
            mIndex={mIndex}
            curDay={curDay}
            moreTasks={moreTasks[mIndex]}
            takeLevelLen={takeLevels.length}
          />
        );
      })}
    </div>
  );
};

export const Week = memo(WeekBase);