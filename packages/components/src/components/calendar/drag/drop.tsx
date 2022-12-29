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

import React from 'react';
import { useDrop } from 'react-dnd';
import { TYPE } from '../constants';
import differenceInDays from 'date-fns/differenceInDays';
import add from 'date-fns/add';
import subDays from 'date-fns/subDays';
import classNames from 'classnames';
import { DayDiv } from '../month/styled';
import { IDrop } from '../interface';

export const Drop = ({ children, date, update }: IDrop) => {
  const [{ isOver, isOverCurrent }, drop] = useDrop(
    () => ({
      accept: TYPE,
      drop(item: any, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (update) {
          const { task } = item;
          if (task) {
            let { endDate } = task;
            const { startDate } = task;
            const diffDay = differenceInDays(date, startDate ? startDate : endDate);
            if (diffDay > 0) {
              endDate = add(endDate, { days: diffDay });
            } else if (diffDay < 0) {
              endDate = subDays(endDate, -diffDay);
            }
            update(task.id, date, endDate);
          }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [],
  );
  const active = isOver || isOverCurrent;
  return (
    <DayDiv
      ref={drop}
      className={classNames({
        active,
      })}
    >
      {children}
    </DayDiv>
  );
};