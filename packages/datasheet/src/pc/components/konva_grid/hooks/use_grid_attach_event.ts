import { IFieldRanges, StoreActions, ICell, Selectors, DATASHEET_ID, IRange, IViewRow, IViewColumn } from '@apitable/core';
import { store } from 'pc/store';
import { MouseDownType } from 'pc/components/selection_wrapper';
import _ from 'lodash';
import { useDispatch } from 'pc/hooks';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { getParentNodeByClass } from 'pc/utils';

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
  const {
    datasheetId,
    fieldRanges,
    selectRanges,
    visibleRows,
    visibleColumns,
    activeCell,
    onViewMouseDown,
    fieldIndexMap,
  } = props;
  const dispatch = useDispatch();

  function generateFieldRanges(e: MouseEvent, fieldId: string, columnIndex: number): IFieldRanges {
    const defaultFieldRanges = [fieldId];

    if (!fieldRanges) {
      return defaultFieldRanges;
    }

    const originFieldRanges = fieldRanges;

    const fieldIndexes = fieldRanges.map(id => fieldIndexMap!.get(id)!);

    const startIdx = fieldIndexes[0];
    const endIdx = fieldIndexes[fieldRanges.length - 1];
    if (e.shiftKey && !fieldIndexes.includes(columnIndex)) {
      return visibleColumns!
        .map(column => column.fieldId)
        .slice(
          _.min([startIdx, endIdx, columnIndex]),
          _.max([startIdx, endIdx, columnIndex])! + 1
        );
    }

    if (
      !e.shiftKey &&
      columnIndex >= startIdx &&
      columnIndex <= endIdx
    ) {
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
      // 需要区分当前有没有按下shift键
      dispatch(StoreActions.setFieldRanges(datasheetId, _fieldRanges));
      return;
    }

    dispatch(StoreActions.setFieldRanges(datasheetId, _fieldRanges));
    dispatch(StoreActions.setSelection({
      start: {
        recordId: firstRecord.recordId,
        fieldId: _fieldRanges[0],
      },
      end: {
        recordId: lastRecord.recordId,
        fieldId: _fieldRanges[_fieldRanges.length - 1],
      },
    }));
  }

  function handleForFillBar() {
    // 填充把手首次按下
    const selectionRange = selectRanges && selectRanges[0];
    if (!selectionRange) return;
    dispatch(StoreActions.setFillHandleStatus({
      isActive: true,
    }));
  }

  // 通过shift键合并选区
  function combineRangeByShift(hoverCell: ICell) {
    dispatch(StoreActions.setSelection({
      start: activeCell!,
      end: hoverCell,
    }));
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
    // FIXME: 统一滚动到单元格方法
    // props.scrollToItem({ rowIndex, columnIndex }, areaIndex);

    if (e.shiftKey && activeCell) {
      return combineRangeByShift(hoverCell);
    }
    dispatch(StoreActions.setActiveCell(datasheetId, hoverCell));
    if (isSideRecordOpen) {
      expandRecordIdNavigate(hoverCell.recordId);
    }
  }

  // 展开单元格，如果点击mask收起 ，阻止它的mouseDown事件
  function isClickInExpandModal(e: MouseEvent) {
    const modalRoot = document.querySelector('.ant-modal-root');
    if (modalRoot && modalRoot.contains(e.target as HTMLElement)) return true;
    return false;
  }

  function handleForOtherArea(e: MouseEvent, isOperateHead: boolean) {
    if (isClickInExpandModal(e)) return;
    if (isOperateHead) return;
    if (getParentNodeByClass(e.target as HTMLElement, 'hideenFieldItem')) return;
    // DOM 模式下判断是否点击为滚动条
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
    handleForOperateColumn
  };
};