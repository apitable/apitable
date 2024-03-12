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
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { IDragTarget, IFieldRanges, IGridViewColumn, ILinearRow, ISnapshot, IViewRow, Selectors, StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { CellValue } from '../cell/cell_value';
import { Header } from './header';
import styles from './styles.module.less';

const { getSnapshot, getVisibleColumns, getGridViewDragState } = Selectors;

const DEFAULT_COLUMN_WIDTH = 200;
interface IMicroColumnStateProps {
  snapshot: ISnapshot;
  dragTarget: IDragTarget;
  visibleColumns: IGridViewColumn[];
  fieldRanges: IFieldRanges | null | undefined;
  datasheetId: string;
  linearRows: ILinearRow[];
  rowHeight: number;
  fieldIndexMap: Map<string, number>;
}

const MicroColumnBase: React.FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const { snapshot, fieldRanges, dragTarget, visibleColumns, datasheetId, linearRows, rowHeight, fieldIndexMap } = useAppSelector(
    (state): IMicroColumnStateProps => {
      const rowHeightLevel = Selectors.getViewRowHeight(state);
      return {
        snapshot: getSnapshot(state)!,
        dragTarget: getGridViewDragState(state).dragTarget,
        fieldRanges: Selectors.getFieldRanges(state),
        fieldIndexMap: Selectors.getVisibleColumnsMap(state),
        visibleColumns: getVisibleColumns(state),
        linearRows: Selectors.getLinearRows(state) || [],
        datasheetId: Selectors.getActiveDatasheetId(state)!,
        rowHeight: Selectors.getRowHeightFromLevel(rowHeightLevel),
      };
    },
    shallowEqual,
  );
  const fieldMap = snapshot.meta.fieldMap;
  const recordFieldCollection: Pick<IGridViewColumn, 'fieldId' | 'width'>[] = [];
  const existInQueue = fieldRanges && fieldRanges.includes(dragTarget.fieldId!);

  if (dragTarget.fieldId && !visibleColumns.some((item) => item.fieldId === dragTarget.fieldId)) {
    store.dispatch(StoreActions.setDragTarget(datasheetId, {}));
    return <></>;
  }
  if (!existInQueue) {
    if (dragTarget.fieldId) {
      recordFieldCollection.push({
        fieldId: dragTarget.fieldId,
        width: visibleColumns.find((column) => column.fieldId === dragTarget.fieldId)?.width,
      });
    }
  } else {
    if (fieldRanges) {
      const fieldIndexRanges = visibleColumns.slice(fieldIndexMap.get(fieldRanges[0]), fieldIndexMap.get(fieldRanges[fieldRanges.length - 1])! + 1);

      fieldIndexRanges?.forEach((column) => recordFieldCollection.push({ fieldId: column.fieldId, width: column.width }));
    }
  }

  function returnMicroElement(fieldId: string) {
    const field = fieldMap[fieldId];
    return linearRows.slice(0, Math.min(3, linearRows.length)).map(({ recordId }: IViewRow, index) => {
      const cellValue = Selectors.getCellValue(store.getState(), snapshot, recordId, fieldId);
      return (
        <div
          key={index}
          style={{
            height: rowHeight,
            borderBottom: `1px solid ${colors.sheetLineColor}`,
          }}
        >
          <CellValue field={field} recordId={recordId} cellValue={cellValue} />
        </div>
      );
    });
  }

  return (
    <div className={styles.wrapper}>
      {recordFieldCollection.map((item) => {
        return (
          <div
            className={styles.content}
            key={item.fieldId}
            style={{
              width: item.width || DEFAULT_COLUMN_WIDTH,
            }}
          >
            <Header field={fieldMap[item.fieldId]} />
            <div style={{ backgroundColor: colors.lowestBg }}>{returnMicroElement(item.fieldId)}</div>
          </div>
        );
      })}
    </div>
  );
};

export const MicroColumn = React.memo(MicroColumnBase, shallowEqual);
