import { DATASHEET_ID, Selectors, StoreActions, Strings, t, ICell } from '@apitable/core';
import { useUpdateEffect } from 'ahooks';
import { Message } from 'pc/components/common/message';
import { useMemorizePreviousValue } from 'pc/hooks';
import { store } from 'pc/store';
import { CELL_CLASS, FIELD_HEAD_CLASS, isTouchDevice, OPACITY_LINE_CLASS, OPERATE_HEAD_CLASS } from 'pc/utils';
import { getClickCellId, getElementDataset, getParentNodeByClass } from 'pc/utils/dom';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { expandRecordIdNavigate } from '../expand_record';
import { useAttachEvent } from '../konva_grid';
import { GRID_VIEWS_ID } from '../multi_grid/grid_views';
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

export const attachEventHoc = WrapperComponent => {
  const AttachEvent: React.FC<IEditorContainerOwnProps> = props => {
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
    } = useSelector(state => {
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

    const isSideRecordOpen = useSelector(state => state.space.isSideRecordOpen);

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
      // 激活单元格的优先级高于表内查找高亮的单元格。
      if (activeCell) {
        return;
      }
      if (currentSearchCell) {
        const [searchRecordId, searchFieldId] = currentSearchCell;
        const currentSearchUICell = Selectors.getCellUIIndex(state, { recordId: searchRecordId, fieldId: searchFieldId })!;
        currentSearchUICell && scrollToItem(currentSearchUICell);
      }
    }, [currentSearchCell?.toString()]);

    // 展开卡片滚动到对应记录
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
      const fieldId = view!.columns[0].fieldId;
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recordId, datasheetId]);

    useEffect(() => {
      const isEditCell = Selectors.getEditingCell(store.getState());
      if (!isEditCell || !Object.keys(isEditCell).length) {
        return;
      }

      const isEditColumnExit = columns.some(item => {
        return item.fieldId === isEditCell.fieldId;
      });

      const isEditRecordExit = rowIndexMap.has(isEditCell.recordId);

      // 当前用户正在编辑，但是编辑单元格所在的「列」或「行」被隐藏或者删除
      if (!isEditColumnExit || !isEditRecordExit) {
        Message.warning({ content: t(Strings.cell_not_exist_content) });
        dispatch(batchActions([StoreActions.clearSelection(datasheetId), StoreActions.setEditStatus(datasheetId, null)]));
      }
    }, [columns, rowIndexMap, dispatch, datasheetId]);

    useUpdateEffect(() => {
      // 退出搜索后滚动到最后高亮单元格
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
