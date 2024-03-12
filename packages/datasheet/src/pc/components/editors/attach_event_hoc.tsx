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

import { useUpdateEffect } from 'ahooks';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { DATASHEET_ID, ICell, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message';
import { useMemorizePreviousValue } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { CELL_CLASS, FIELD_HEAD_CLASS, isTouchDevice, OPACITY_LINE_CLASS, OPERATE_HEAD_CLASS } from 'pc/utils';
import { getClickCellId, getElementDataset, getParentNodeByClass } from 'pc/utils/dom';
import { expandRecordIdNavigate } from '../expand_record';
import { useAttachEvent } from '../konva_grid';
import { IContainerEdit } from './interface';

interface IScrollToItem {
  align?: 'auto' | 'smart' | 'center' | 'end' | 'start';
  rowIndex?: number;
  columnIndex?: number;
}

export interface IEditorContainerOwnProps {
  scrollToItem: (props: IScrollToItem, areaIndex?: number) => void;
  parentRef?: React.RefObject<HTMLDivElement>;
  scrollTop?: number;
  scrollLeft?: number;
}

const GRID_VIEWS_ID = 'gridViews';

export const attachEventHoc = (WrapperComponent: any) => {
  const AttachEvent: React.FC<React.PropsWithChildren<IEditorContainerOwnProps>> = (props) => {
    const dispatch = useDispatch();
    const { scrollToItem } = props;
    const containerRef = useRef<IContainerEdit | null>(null);
    const {
      columns,
      visibleRows,
      selectRanges,
      selectField,
      rowIndexMap,
      recordId,
      selectRecord,
      activeCell,
      datasheetId,
      selection,
      currentSearchCell,
      isSearching,
      fieldRanges,
      fieldIndexMap,
    } = useAppSelector((state) => {
      return {
        selection: Selectors.getSelection(state),
        activeCell: Selectors.getActiveCell(state),
        columns: Selectors.getVisibleColumns(state),
        visibleRows: Selectors.getVisibleRows(state),
        selectRanges: Selectors.getSelectRanges(state),
        selectField: Selectors.getSelectedField(state),
        selectRecord: Selectors.getSelectedRecord(state),
        datasheetId: Selectors.getActiveDatasheetId(state)!,
        recordId: state.pageParams.recordId,
        currentSearchCell: Selectors.getCurrentSearchItem(state),
        rowIndexMap: Selectors.getRowsIndexMap(state),
        fieldIndexMap: Selectors.getVisibleColumnsMap(state),
        isSearching: Selectors.getIsSearching(state),
        fieldRanges: Selectors.getFieldRanges(state),
      };
    }, shallowEqual);

    const isSideRecordOpen = useAppSelector((state) => state.space.isSideRecordOpen);

    const { handleForCell, handleForFillBar, handleForHeader, handleForOperateColumn, handleForOtherArea } = useAttachEvent({
      datasheetId,
      fieldRanges,
      selectRanges,
      visibleRows,
      activeCell,
      onViewMouseDown: (activeCell?: ICell) => containerRef.current?.onViewMouseDown(activeCell),
      fieldIndexMap,
      visibleColumns: columns,
    });

    useUpdateEffect(() => {
      const state = store.getState();
      const activeCell = Selectors.getActiveCell(state);
      if (activeCell) {
        return;
      }
      if (currentSearchCell) {
        const [searchRecordId, searchFieldId] = currentSearchCell;
        const currentSearchUICell = Selectors.getCellUIIndex(state, { recordId: searchRecordId!, fieldId: searchFieldId! })!;
        currentSearchUICell && scrollToItem(currentSearchUICell);
      }
    }, [currentSearchCell?.toString()]);

    useEffect(() => {
      if (!recordId) {
        return;
      }
      const state = store.getState();
      const activeCell = Selectors.getActiveCell(state);
      if (activeCell && activeCell.recordId && activeCell.recordId === recordId) {
        return;
      }
      if (!rowIndexMap.has(recordId)) {
        return;
      }
      const view = Selectors.getCurrentView(store.getState());
      const fieldId = view!.columns[0]!.fieldId;
      dispatch(
        StoreActions.setActiveCell(datasheetId, {
          recordId,
          fieldId,
        }),
      );
      if (isSideRecordOpen) {
        expandRecordIdNavigate(recordId);
      }
      const expandRecordUICell = Selectors.getCellUIIndex(state, { recordId, fieldId })!;
      expandRecordUICell && scrollToItem(expandRecordUICell);
      // eslint-disable-next-line
    }, [recordId, datasheetId]);

    useEffect(() => {
      const isEditCell = Selectors.getEditingCell(store.getState());
      if (!isEditCell || !Object.keys(isEditCell).length) {
        return;
      }

      const isEditColumnExit = columns.some((item) => {
        return item.fieldId === isEditCell.fieldId;
      });

      const isEditRecordExit = rowIndexMap.has(isEditCell.recordId);

      if (!isEditColumnExit || !isEditRecordExit) {
        Message.warning({ content: t(Strings.cell_not_exist_content) });
        dispatch(batchActions([StoreActions.clearSelection(datasheetId), StoreActions.setEditStatus(datasheetId, null)]));
      }
    }, [columns, rowIndexMap, dispatch, datasheetId]);

    useUpdateEffect(() => {
      if (isSearching) {
        return;
      }

      if (selection && selection.fieldRanges) {
        return;
      }
      const state = store.getState();
      const activeCell = Selectors.getActiveCell(state);
      if (!activeCell) {
        return;
      }
      const activeUICell = Selectors.getCellUIIndex(state, activeCell)!;
      activeUICell &&
        setTimeout(() => {
          scrollToItem(activeUICell);
        }, 0);
    }, [isSearching]);

    const mouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const { fieldId, recordId } = getClickCellId(target);
      const hoverCell = { recordId: recordId!, fieldId: fieldId! };
      if (fieldId && !recordId) {
        const columnIndex = Number(getElementDataset(getParentNodeByClass(e.target as HTMLElement, [CELL_CLASS, FIELD_HEAD_CLASS]), 'columnIndex'));
        const isChangeColumnWidth = Boolean(getParentNodeByClass(target, OPACITY_LINE_CLASS));
        handleForHeader(e, fieldId, columnIndex, isChangeColumnWidth);
        return;
      }

      if ((e.target as HTMLElement).id === DATASHEET_ID.FILL_HANDLE_AREA) {
        handleForFillBar();
        return;
      }

      if (recordId && fieldId) {
        handleForCell(e, hoverCell);
        return;
      }

      if (recordId == null && fieldId == null) {
        const isOperateHead = Boolean(getParentNodeByClass(e.target as HTMLElement, OPERATE_HEAD_CLASS));
        handleForOtherArea(e, isOperateHead);
      }

      if (recordId !== null && fieldId == null) {
        handleForOperateColumn();
      }
      return;
    };

    const click = (e: MouseEvent) => {
      if (!e.target) {
        return;
      }

      if (document.getElementById(GRID_VIEWS_ID)?.contains(e.target as HTMLElement) && activeCell && containerRef.current) {
        if (isTouchDevice()) {
          return;
        }

        containerRef.current.focus();
      }
    };

    useEffect(() => {
      document.addEventListener('click', click);
      return () => {
        document.removeEventListener('click', click);
      };
    });

    useEffect(() => {
      document.addEventListener('mousedown', mouseDown);
      return () => {
        document.removeEventListener('mousedown', mouseDown);
      };
    });

    const lastRanges = useMemorizePreviousValue(selectRanges![0]);
    if (!selection) {
      return null;
    }

    return (
      <WrapperComponent
        ref={containerRef}
        field={selectField}
        record={selectRecord}
        selectionRange={lastRanges}
        selection={selection}
        rows={visibleRows}
        activeCell={activeCell}
        {...props}
      />
    );
  };

  return AttachEvent;
};
