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
            // isMore 为 true 是，会多出一行展示时间区间，需要添加额外的高度
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