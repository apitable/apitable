
import { memo, useContext, useState } from 'react';
import * as React from 'react';
import { useDrop } from 'react-dnd';
import { AddOutlined } from '@vikadata/icons';
import { PRE_RECORD, RECORD } from './constants';
import dayjs from 'dayjs';
import classNames from 'classnames';
import styles from './styles.module.less';
import { CollaCommandName, ExecuteResult, Selectors, StoreActions, WhyRecordMoveType } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { CalendarContext } from './calendar_context';
import { getPosition } from './utils';
import { ITask, useThemeColors } from '@vikadata/components';
import { dispatch } from 'pc/worker/store';
import { store } from 'pc/store';
interface IDrop {
  children: React.ReactElement[];
  date: Date;
  update?: (id: number | string, startDate: Date | null, endDate: Date | null) => void;
  tasks: ITask[];
  disabled?: boolean;
}

const DropBase = ({ children, date, update, disabled }: IDrop) => {
  const colors = useThemeColors();
  const { 
    view, calendarStyle, setRecordModal, isStartDateTimeField,
    isEndDateTimeField, isMobile, tasks, datasheetId,
    permissions,
  } = useContext(CalendarContext);
  const { startFieldId, endFieldId } = calendarStyle;
  const [showAdd, setShowAdd] = useState(false);
  const [{ isOver, isOverCurrent }, drop] = useDrop(
    () => ({
      accept: [RECORD, PRE_RECORD],
      drop(item: any, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (update) {
          const task = tasks?.filter(t => item.id === t.id)[0];
          if (task) {
            let { startDate, endDate } = task;
            // diff 天为单位时，忽略天以下的时间单位
            const formatDate = dayjs(date).format('YYYY/MM/DD');
            const formatDiff = dayjs(startDate ? startDate : endDate).format('YYYY/MM/DD');
            const diffDay = dayjs(formatDate).diff(dayjs(formatDiff), 'day');
            if (diffDay > 0) {
              endDate = dayjs(endDate).add(diffDay, 'day').toDate();
              startDate = dayjs(startDate).add(diffDay, 'day').toDate();
            } else if (diffDay < 0) {
              endDate = dayjs(endDate).subtract(-diffDay, 'day').toDate();
              startDate = dayjs(startDate).subtract(-diffDay, 'day').toDate();
            }
            update(task.id, startDate, endDate);
          } else if (isStartDateTimeField) {
            // 有 endFieldId 并且 type 为 PRE_RECORD 表示从列表拖拽到日历补全结束时间
            update(item.id, date, endFieldId && item.type === PRE_RECORD ? date : null);
          } else {
            update(item.id, null, date);
          }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [tasks],
  );
  const active = isOver || isOverCurrent;
  
  const addRecord = (e: React.MouseEvent) => {
    const dateValue = dayjs(date).valueOf();
    const cellValue: { [x: string]: number; } = {};
    if (isStartDateTimeField) {
      cellValue[startFieldId] = dateValue;
    }
    if (isEndDateTimeField) {
      cellValue[endFieldId] = dateValue;
    }
    const collaCommandManager = resourceService.instance!.commandManager;
    const result = collaCommandManager.execute({
      cmd: CollaCommandName.AddRecords,
      count: 1,
      viewId: view.id,
      index: 0,
      cellValues: [cellValue]
    });
    if (
      result.result === ExecuteResult.Success
    ) {
      const newRecordId = result.data && result.data[0];
      // move type
      if (newRecordId) {
        const state = store.getState();
        const rowsMap = Selectors.getVisibleRowsIndexMap(state);
        const isRecordInView = rowsMap.has(newRecordId);
        if (!isRecordInView) {
          const newRecordSnapshot = Selectors.getRecordSnapshot(state, newRecordId);
          if (newRecordSnapshot) {
            dispatch(
              StoreActions.setActiveCell(datasheetId, {
                recordId: newRecordId,
                fieldId: view.columns[0].fieldId,
              }),
            );
            dispatch(StoreActions.setActiveRowInfo(datasheetId, {
              type: WhyRecordMoveType.NewRecord,
              positionInfo: {
                recordId: newRecordId,
                visibleRowIndex: 0,
                isInit: false,
              },
              recordSnapshot: newRecordSnapshot
            }));
          }
        }
      }
      const position = getPosition(e);
      /**
       * 延迟设置 modal 选中行
       * modal 存在时，点击 + 号新增记录会先触发 useClickAway 关闭 modal，再设置 recordId 打开新记录 modal
       */
      setTimeout(() => {
        setRecordModal([newRecordId, true, position]);
      }, 0);
    }
  };
  
  const isAllowAddRecord = !isMobile && permissions.rowCreatable;

  return (
    <div
      ref={drop} 
      className={classNames(styles.day, {
        active,
        [styles.hover]: isAllowAddRecord,
      })}
      onMouseOver={() => {
        !isMobile && setShowAdd(true);
      }}
      onMouseLeave={() => {
        !isMobile && setShowAdd(false);
      }}
      onDoubleClick={isAllowAddRecord ? addRecord : undefined}
    >
      {isAllowAddRecord && showAdd ? (
        <span className={styles.add} onClick={addRecord}>
          <AddOutlined size={14} color={colors.fc0}/>
        </span>
      ) : <React.Fragment />}
      {children}
    </div>
  );
};

export const Drop = memo(DropBase);