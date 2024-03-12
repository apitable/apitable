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

import { Modal } from 'antd';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { IGridViewColumn, Selectors, Strings, t, StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { CellValue } from '../cell/cell_value';
import styles from './styles.module.less';

const { getSnapshot, getVisibleColumns, getGridViewDragState } = Selectors;

const MicroRowBase: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { snapshot, recordRanges, rowsIndexMap, visibleColumn, dragTarget, datasheetId } = useAppSelector((state) => {
    const { dragTarget } = getGridViewDragState(state);
    return {
      snapshot: getSnapshot(state)!,
      dragTarget,
      recordRanges: Selectors.getSelectionRecordRanges(state),
      visibleColumn: getVisibleColumns(state),
      rowsIndexMap: Selectors.getRowsIndexMap(state),
      datasheetId: Selectors.getActiveDatasheetId(state)!,
    };
  });
  const fieldMap = snapshot.meta.fieldMap;
  const recordId = dragTarget.recordId!;
  const recordDataCollection: string[] = [];
  const isExistInQueue = recordRanges && recordRanges.includes(recordId);

  if (recordId && !rowsIndexMap.has(recordId)) {
    // Determine if the current record being dragged has been deleted by the collaborator
    store.dispatch(StoreActions.setDragTarget(datasheetId, {}));
    Modal.error({
      title: t(Strings.error_something_wrong),
      content: t(Strings.error_the_field_dragged_has_been_deleted_or_hidden),
      okText: t(Strings.submit),
    });
    return <></>;
  }

  if (!isExistInQueue) {
    if (recordId) {
      recordDataCollection.push(recordId);
    }
  } else {
    recordRanges && recordDataCollection.push(...recordRanges);
  }

  function CellElement(recordId: string) {
    return visibleColumn.slice(0, 6).map(({ fieldId }: IGridViewColumn) => {
      const field = fieldMap[fieldId];
      const cellValue = Selectors.getCellValue(store.getState(), snapshot, recordId, fieldId);
      if (!cellValue) {
        return <div className={styles.type} key={fieldId} />;
      }
      return <CellValue key={fieldId} recordId={recordId} field={field} cellValue={cellValue} />;
    });
  }

  return (
    <div className={styles.microRowWrapper}>
      {recordDataCollection.slice(0, 3).map((recordId) => {
        return (
          <div className={styles.microRowLine} key={recordId}>
            {CellElement(recordId)}
          </div>
        );
      })}
    </div>
  );
};

export const MicroRow = React.memo(MicroRowBase, shallowEqual);
