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
import { isNil } from 'lodash';
import { FC, memo, useContext } from 'react';
import { ICalendarViewColumn, t, Strings } from '@apitable/core';
import { FieldTitle } from 'pc/components/expand_record/field_editor';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { CalendarContext } from '../calendar_context';
import styles from './styles.module.less';

interface IRecordItem {
  id: string;
  column: ICalendarViewColumn;
}

const RecordItemBase: FC<React.PropsWithChildren<IRecordItem>> = (props) => {
  const { id, column } = props;
  const { fieldMap, firstFieldId, getCellValue, calendarStyle, datasheetId } = useContext(CalendarContext);
  const { isColNameVisible } = calendarStyle;
  const field = fieldMap[column.fieldId];
  const cellValue = getCellValue(id, field && field.id);
  const isFirst = firstFieldId === column.fieldId;
  if (isFirst && !cellValue) {
    return <div className={styles.empty}>{t(Strings.record_unnamed)}</div>;
  }
  if (isNil(cellValue)) return null;
  return (
    <div
      key={column.fieldId}
      className={cls(styles.recordItem, {
        [styles.bolder]: isFirst,
        [styles.high]: !isFirst && isColNameVisible,
      })}
    >
      {calendarStyle.isColNameVisible && !isFirst && <FieldTitle fieldId={column.fieldId} datasheetId={datasheetId} />}
      <CellValue recordId={id} field={field} cellValue={cellValue} readonly />
    </div>
  );
};

export const RecordItem = memo(RecordItemBase);
