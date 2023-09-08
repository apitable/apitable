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

import * as React from 'react';
import { useDrop } from 'react-dnd';
import { Strings, t } from '@apitable/core';
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
    <div ref={drop} className={styles.dropList}>
      {active && (
        <div className={styles.dropMask}>
          <div className={styles.dropMaskText}>{t(Strings.calendar_drag_clear_time)}</div>
        </div>
      )}
      {children}
    </div>
  );
};
