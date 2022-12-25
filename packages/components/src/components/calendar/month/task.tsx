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

import React, { memo, useContext } from 'react';
import { ILevelResult } from '../interface';
import classNames from 'classnames';
import { Direction } from '../constants';
import { CalendarContext } from '../calendar_context';
import { get } from 'lodash';

interface ITask {
  levelItem: ILevelResult;
  levelIdx?: number;
  isMore?: boolean;
}

const TaskBase = (props: ITask) => {
  const { levelItem, levelIdx, isMore } = props;
  const {
    space, listHeight, defaultListHeight, disabled, disableResize,
    onResizeStart, Drag, listStyle, startListStyle, warnText, moveTaskId
  } = useContext(CalendarContext);
  const { task, isEnd, isStart, isEmptyEnd, left, len, warn } = levelItem;
  const { id, title, startDisabled, endDisabled } = task;
  const style = levelIdx !== undefined ? {
    top: levelIdx * (listHeight + space) + defaultListHeight + 4 + 'px',
    left: (left - 1) * (100 / 7) + '%',
    width: (len || 1) * (100 / 7) + '%',
  } : { 
    position: 'relative'
  };
  return (
    <div
      key={id}
      className={classNames('task', {
        endClose: !(isEnd || isEmptyEnd),
        startClose: !isStart,
        draggable: disabled,
        isMove: moveTaskId === id,
      })}
      style={style as any}
    >
      {!disableResize && !isEmptyEnd && !startDisabled && isStart && (
        <div
          className="left-resize"
          onMouseDown={(e) => {
            onResizeStart(e, id, Direction.Left);
            e.preventDefault();
          }}
        />
      )}
      {!disableResize && !endDisabled && isEnd && (
        <div
          className="right-resize"
          onMouseDown={(e) => {
            onResizeStart(e, id, Direction.Right);
            e.preventDefault();
          }}
        />
      )}
      {Drag ? (
        <Drag
          id={id} 
          listStyle={{
            ...listStyle,
            ...(isStart ? startListStyle : {}),
            // If isMore is true, an additional line will be displayed to show the time interval, and additional height needs to be added
            height: parseInt(get(listStyle, 'height', '0') as string) + (isMore ? 22 : 0) + 'px',
          }}
          task={task}
          disabled={disabled}
          isMore={isMore}
        >
          {title}
        </Drag>
      ) : <div className="list" style={{
        ...listStyle,
        ...(isStart ? startListStyle : {})
      }}>
        {title}
      </div>}
      {warn && warnText}
    </div>
  );
};

export const Task = memo(TaskBase);