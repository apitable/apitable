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

import _ from 'lodash';
import { IFieldRanges, StoreActions, ICell, Selectors, DATASHEET_ID, IRange, IViewRow, IViewColumn } from '@apitable/core';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { useDispatch } from 'pc/hooks';
import { store } from 'pc/store';
import { getParentNodeByClass } from 'pc/utils';
import { MouseDownType } from '../../multi_grid';

interface IUseAttachEventProps {
  datasheetId: string;
  activeCell: ICell | null;
  visibleRows: IViewRow[];
  visibleColumns?: IViewColumn[];
  selectRanges: IRange[];
  fieldRanges?: IFieldRanges;
  fieldIndexMap?: Map<string, number>;
  onViewMouseDown: (activeCell?: ICell) => void;
}

export const useAttachEvent = (props: IUseAttachEventProps) => {
  const { datasheetId, fieldRanges, selectRanges, visibleRows, visibleColumns, activeCell, onViewMouseDown, fieldIndexMap } = props;
  const dispatch = useDispatch();

  function generateFieldRanges(e: MouseEvent, fieldId: string, columnIndex: number): IFieldRanges {
    const defaultFieldRanges = [fieldId];

    if (!fieldRanges) {
      return defaultFieldRanges;
    }

    const originFieldRanges = fieldRanges;

    const fieldIndexes = fieldRanges.map((id) => fieldIndexMap!.get(id)!);

    const startIdx = fieldIndexes[0];
    const endIdx = fieldIndexes[fieldRanges.length - 1];
    if (e.shiftKey && !fieldIndexes.includes(columnIndex)) {
      return visibleColumns!
        .map((column) => column.fieldId)
        .slice(_.min([startIdx, endIdx, columnIndex]), _.max([startIdx, endIdx, columnIndex])! + 1);
    }

    if (!e.shiftKey && columnIndex >= startIdx && columnIndex <= endIdx) {
      return originFieldRanges;
    }

    return defaultFieldRanges;
  }

  function handleForHeader(e: MouseEvent, fieldId: string, columnIndex: number, isChangeColumnWidth: boolean) {
    onViewMouseDown();

    if (isChangeColumnWidth) return;

    const firstRecord = visibleRows[0];
    const lastRecord = visibleRows[visibleRows.length - 1];
    const _fieldRanges = generateFieldRanges(e, fieldId, columnIndex);

    if (!firstRecord) {
      // Need to distinguish whether the shift key is currently pressed or not
      dispatch(StoreActions.setFieldRanges(datasheetId, _fieldRanges));
      return;
    }

    dispatch(StoreActions.setFieldRanges(datasheetId, _fieldRanges));
    dispatch(
      StoreActions.setSelection({
        start: {
          recordId: firstRecord.recordId,
          fieldId: _fieldRanges[0],
        },
        end: {
          recordId: lastRecord.recordId,
          fieldId: _fieldRanges[_fieldRanges.length - 1],
        },
      }),
    );
  }

  function handleForFillBar() {
    // Fill handler first press
    const selectionRange = selectRanges && selectRanges[0];
    if (!selectionRange) return;
    dispatch(
      StoreActions.setFillHandleStatus({
        isActive: true,
      }),
    );
  }

  // Merge selections by shift key
  function combineRangeByShift(hoverCell: ICell) {
    dispatch(
      StoreActions.setSelection({
        start: activeCell!,
        end: hoverCell,
      }),
    );
  }

  function handleForCell(e: MouseEvent, hoverCell: ICell) {
    const state = store.getState();
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const client = Selectors.getDatasheetClient(state);
    if (client && client.gridViewActiveFieldState.fieldId) return;
    const cellInSelection = Selectors.isCellInSelection(state, hoverCell);
    if (e.button === MouseDownType.Right && cellInSelection) {
      return;
    }
    const isSideRecordOpen = state.space.isSideRecordOpen;
    onViewMouseDown(hoverCell);
    // FIXME: Unified scroll to cell method
    // props.scrollToItem({ rowIndex, columnIndex }, areaIndex);

    if (e.shiftKey && activeCell) {
      return combineRangeByShift(hoverCell);
    }
    dispatch(StoreActions.setActiveCell(datasheetId, hoverCell));
    if (isSideRecordOpen) {
      expandRecordIdNavigate(hoverCell.recordId);
    }
  }

  // Expand the record, and if you click on the mask to collapse it, block its mouseDown event
  function isClickInExpandModal(e: MouseEvent) {
    const modalRoot = document.querySelector('.ant-modal-root');
    if (modalRoot && modalRoot.contains(e.target as HTMLElement)) return true;
    return false;
  }

  function handleForOtherArea(e: MouseEvent, isOperateHead: boolean) {
    if (isClickInExpandModal(e)) return;
    if (isOperateHead) return;
    if (getParentNodeByClass(e.target as HTMLElement, 'hideenFieldItem')) return;
    // Determining whether a click is a scrollbar in DOM mode
    const gridContainer = document.getElementById(DATASHEET_ID.DOM_CONTAINER);
    const verticalScrollBar = gridContainer?.nextSibling;
    const horizontalScrollBar = verticalScrollBar?.nextSibling;
    if (horizontalScrollBar?.contains(e.target as Element)) return;
    if (verticalScrollBar?.contains(e.target as Element)) return;

    if (!document.getElementById(DATASHEET_ID.DOM_CONTAINER)!.contains(e.currentTarget as Element)) {
      onViewMouseDown();
    }
    dispatch(StoreActions.clearSelection(datasheetId));
    dispatch(StoreActions.clearActiveRowInfo(datasheetId));
  }

  function handleForOperateColumn() {
    onViewMouseDown();
  }

  return {
    handleForHeader,
    handleForFillBar,
    handleForCell,
    handleForOtherArea,
    handleForOperateColumn,
  };
};
