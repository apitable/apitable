
import { Strings, t } from '@vikadata/core';
import * as React from 'react';
import { useDrop } from 'react-dnd';
import { RECORD } from '../../constants';
import styles from './styles.module.less';

interface IDrop {
  children: React.ReactElement | React.ReactElement[];
  update?: (id: number | string, startDate: Date | null, endDate: Date | null) => void;
}

export const DropList = ({ children, update }: IDrop) => {
  const [{ isOver, isOverCurrent }, drop] = useDrop(
    () => ({
      accept: RECORD,
      drop(item: any, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (update) {
          update(item.id, null, null);
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
    <div
      ref={drop} 
      className={styles.dropList}
    >
      {active && (
        <div className={styles.dropMask}>
          <div className={styles.dropMaskText}>
            {t(Strings.calendar_drag_clear_time)}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};