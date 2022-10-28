import { IGridViewColumn, Selectors, Strings, t, StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { Modal } from 'antd';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { CellValue } from '../cell/cell_value';
import styles from './styles.module.less';
const { getSnapshot, getVisibleColumns, getGridViewDragState } = Selectors;

const MicroRowBase: React.FC = () => {
  const {
    snapshot, recordRanges, rowsIndexMap,
    visibleColumn, dragTarget, datasheetId,
  } = useSelector(state => {
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

  if (recordId && !(rowsIndexMap.has(recordId))) {
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
      {
        recordDataCollection.slice(0, 3).map(recordId => {
          return (
            <div className={styles.microRowLine} key={recordId}>
              {CellElement(recordId)}
            </div>
          );
        })
      }
    </div>
  );
};

export const MicroRow = React.memo(MicroRowBase, shallowEqual);
