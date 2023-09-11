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

import cls from 'classnames';
import { memo, MouseEvent, useContext } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { useContextMenu } from '@apitable/components';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { GRID_RECORD_MENU } from 'pc/components/multi_grid/context_menu/record_menu';
import { CalendarContext } from '../../calendar_context';
import { PRE_RECORD } from '../../constants';
import { RecordItem } from '../../record_item';
import styles from './styles.module.less';

interface IDrag {
  id: string;
  disabled?: boolean;
}

const DragItemBase = ({ id, disabled }: IDrag) => {
  const { fieldMap, calendarStyle, columns, currentSearchRecordId, isStartDateTimeField, isEndDateTimeField, draggable, isCryptoStartField } =
    useContext(CalendarContext);
  const { startFieldId, endFieldId } = calendarStyle;
  const noRequiredField = (!startFieldId && !endFieldId) || (!isStartDateTimeField && !isEndDateTimeField);
  const isCurrentSearchCell = currentSearchRecordId === id;
  const isStartFieldDeleted = startFieldId && !isCryptoStartField && !fieldMap[startFieldId];

  const { show } = useContextMenu({
    id: GRID_RECORD_MENU,
  });

  const onContextMenu = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    show(e, {
      props: {
        recordId: id,
      },
    });
  };
  const [{ opacity }, drag] = useDrag(() => ({
    type: PRE_RECORD,
    item: { id, type: PRE_RECORD },
    collect: (monitor: DragSourceMonitor) => ({
      opacity: monitor.isDragging() ? 0.6 : 1,
    }),
  }));
  const isDisabledDraggable = noRequiredField || isStartFieldDeleted || disabled || !draggable;
  return (
    <div
      ref={isDisabledDraggable ? undefined : drag}
      className={cls(styles.dragItem, {
        [styles.highlight]: isCurrentSearchCell,
        [styles.draggable]: !isDisabledDraggable,
      })}
      style={{
        opacity,
      }}
      onClick={() => expandRecordIdNavigate(id)}
      onContextMenu={onContextMenu}
    >
      {columns.map((column) => (
        <RecordItem key={column.fieldId} column={column} id={id} />
      ))}
    </div>
  );
};

export const DragItem = memo(DragItemBase);
