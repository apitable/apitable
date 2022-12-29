
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