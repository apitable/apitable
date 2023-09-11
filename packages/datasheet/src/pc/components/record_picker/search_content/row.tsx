import classNames from 'classnames';
import React, { memo } from 'react';
import { ListChildComponentProps } from 'react-window';
import { RecordCard } from './record_card';
import styles from './style.module.less';

export const Row: React.FC<ListChildComponentProps> = memo((props) => {
  const { index, data, style } = props;

  const { rows, columns, fieldMap, selectedSet, datasheetId, onClick } = data;
  const row = rows[index];
  const recordId = row.recordId;
  const isSelected = selectedSet.has(recordId);

  return (
    <div key={recordId} style={style}>
      <div
        className={classNames(styles.recordCardWrapper, {
          [styles.recordCardWrapperSelected]: isSelected,
        })}
      >
        <RecordCard row={row} columns={columns} fieldMap={fieldMap} datasheetId={datasheetId} onClick={onClick} />
      </div>
    </div>
  );
});
