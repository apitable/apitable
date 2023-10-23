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

import classNames from 'classnames';
import dayjs from 'dayjs';
import { memo, useContext, useState } from 'react';
import * as React from 'react';
import { useDrop } from 'react-dnd';
import { ITask, useThemeColors } from '@apitable/components';
import { CollaCommandName, ExecuteResult, Selectors, StoreActions, WhyRecordMoveType } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { dispatch } from 'pc/worker/store';
import { CalendarContext } from './calendar_context';
import { PRE_RECORD, RECORD } from './constants';
import styles from './styles.module.less';
interface IDrop {
  children: React.ReactElement[];
  date: Date;
  update?: (id: number | string, startDate: Date | null, endDate: Date | null) => void;
  tasks: ITask[];
  disabled?: boolean;
}

const DropBase = ({ children, date, update }: IDrop) => {
  const colors = useThemeColors();
  const { view, calendarStyle, isStartDateTimeField, isEndDateTimeField, isMobile, tasks, datasheetId, permissions } =
    useContext(CalendarContext);
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
          const task = tasks?.filter((t) => item.id === t.id)[0];
          if (task) {
            let { startDate, endDate } = task;
            // diff ignores units of time below the day when the unit is a day
            const formatDate = dayjs.tz(date).format('YYYY/MM/DD');
            const formatDiff = dayjs.tz(startDate ? startDate : endDate).format('YYYY/MM/DD');
            const diffDay = dayjs.tz(formatDate).diff(dayjs.tz(formatDiff), 'day');
            if (diffDay > 0) {
              endDate = dayjs.tz(endDate).add(diffDay, 'day').toDate();
              startDate = dayjs.tz(startDate).add(diffDay, 'day').toDate();
            } else if (diffDay < 0) {
              endDate = dayjs.tz(endDate).subtract(-diffDay, 'day').toDate();
              startDate = dayjs.tz(startDate).subtract(-diffDay, 'day').toDate();
            }
            update(task.id, startDate, endDate);
          } else if (isStartDateTimeField) {
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

  const addRecord = () => {
    const dateValue = dayjs.tz(date).valueOf();
    const cellValue: { [x: string]: number } = {};
    if (isStartDateTimeField) {
      cellValue[startFieldId] = dateValue;
    }
    if (isEndDateTimeField) {
      cellValue[endFieldId] = dateValue;
    }
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      count: 1,
      viewId: view.id,
      index: 0,
      cellValues: [cellValue],
    });
    if (result.result === ExecuteResult.Success) {
      const newRecordId = result.data && result.data[0];
      // move type
      if (newRecordId) {
        const state = store.getState();
        const rowsMap = Selectors.getVisibleRowsIndexMap(state);
        const isRecordInView = rowsMap.has(newRecordId);
        if (!isRecordInView) {
          const newRecordSnapshot = Selectors.getRecordSnapshot(state, datasheetId, newRecordId);
          if (newRecordSnapshot) {
            dispatch(
              StoreActions.setActiveCell(datasheetId, {
                recordId: newRecordId,
                fieldId: view.columns[0].fieldId,
              }),
            );
            dispatch(
              StoreActions.setActiveRowInfo(datasheetId, {
                type: WhyRecordMoveType.NewRecord,
                positionInfo: {
                  recordId: newRecordId,
                  visibleRowIndex: 0,
                  isInit: false,
                },
                recordSnapshot: newRecordSnapshot,
              }),
            );
          }
        }
      }
      /**
       * Delay setting modal Checked row
       * When a modal exists, clicking on the + sign to add a new record will first trigger useClickAway to close the modal,
       * then set the recordId to open the new record modal
       */
      setTimeout(() => {
        expandRecordIdNavigate(newRecordId);
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
          <AddOutlined size={14} color={colors.fc0} />
        </span>
      ) : (
        <React.Fragment />
      )}
      {children}
    </div>
  );
};

export const Drop = memo(DropBase);
