import { ICalendarViewColumn, t, Strings } from '@apitable/core';
import { FieldTitle } from 'pc/components/expand_record/field_editor';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { FC, memo, useContext } from 'react';
import { CalendarContext } from '../calendar_context';
import styles from './styles.module.less';
import cls from 'classnames';

interface IRecordItem {
  id: string;
  column: ICalendarViewColumn
}

const RecordItemBase: FC<IRecordItem> = props => {
  const { id, column } = props;
  const { fieldMap, firstFieldId, getCellValue, calendarStyle, datasheetId } = useContext(CalendarContext);
  const { isColNameVisible } = calendarStyle;
  const field = fieldMap[column.fieldId];
  const cellValue = getCellValue(id, field && field.id);
  const isFirst = firstFieldId === column.fieldId;
  if (isFirst && !cellValue) {
    return (
      <div className={styles.empty}>
        {t(Strings.record_unnamed)}
      </div>
    );
  }
  if (!cellValue) return null;
  return (
    <div key={column.fieldId} className={cls(styles.recordItem, {
      [styles.bolder]: isFirst,
      [styles.high]: !isFirst && isColNameVisible,
    })}>
      {calendarStyle.isColNameVisible && !isFirst && (
        <FieldTitle
          fieldId={column.fieldId}
          datasheetId={datasheetId}
        />
      )}
      <CellValue
        recordId={id}
        field={field}
        cellValue={cellValue}
        readonly
      />
    </div>
  );
};

export const RecordItem = memo(RecordItemBase);