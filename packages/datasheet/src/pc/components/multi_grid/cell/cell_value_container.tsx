import { Field, IField, IGridViewColumn, IGroupInfo, ILinearRowRecord, Range, RecordMoveType, RowHeightLevel, Selectors } from '@vikadata/core';
import classNames from 'classnames';
import { useThemeColors } from '@vikadata/components';
import { CELL_CLASS } from 'pc/utils';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { GROUP_OFFSET } from '../grid_views';
import { CollaboratorMark, getCollaboratorColor, renderFillHandle } from './cell_other';
import { CellValue } from './cell_value';
import styles from './styles.module.less';
import { GRAY_COLOR_BORDER, PRIMARY_COLOR_BORDER } from './virtual_cell/cell_group_tab/cell_group_tab';
import { CellRowHead } from './virtual_cell/cell_row_head/cell_row_head';

interface ICellValueContainer {
  style: React.CSSProperties;
  datasheetId: string;
  rowHeightLevel: number;
  columns: IGridViewColumn[];
  groupInfo: IGroupInfo;
  gridCellWrapper: string;
  actualColumnIndex: number;
  row: ILinearRowRecord;
  recordMoveType: RecordMoveType;
}

export const OPERATE_COLUMN_WIDTH = 72;
const EMPTY_ARRAY = [];

export const CellValueContainerFC: React.FC<ICellValueContainer> = props => {
  const {
    gridCellWrapper, row, rowHeightLevel, datasheetId,
    actualColumnIndex, groupInfo, style, columns, recordMoveType,
  } = props;
  const colors = useThemeColors();
  const recordId = row.recordId;
  const fieldId = columns[actualColumnIndex] && columns[actualColumnIndex].fieldId;
  const currentCell = { recordId, fieldId };
  const groupHeadRecordId = row.groupHeadRecordId;
  // 行头显示的行号
  const displayRowIndex = row.displayIndex;

  // 组件大规模渲染的时候，合并 useSelector 可以获得显著的性能提升
  const {
    field,
    cellValue,
    isActive,
    isActiveRow,
    isRowDragging,
    recordChecked,
    recordEditable,
    isCellInSelection,
    isLastSelectionCell,
    isCellInFillSelection,
    collaboratorCell,
    hasFoundMark,
    isCurrentSearchCell,
    isHoverLine,
    showKeepSortBorder,
  } = useSelector(state => {
    const selectionRange = Selectors.getSelectRanges(state)![0];
    const snapshot = Selectors.getSnapshot(state)!;
    const field = Selectors.getField(state, fieldId);
    const activeCell = Selectors.getActiveCell(state);
    const currentCellIndex = Selectors.getCellIndex(state, currentCell);
    const fillHandleStatus = Selectors.getFillHandleStatus(state);
    const dragState = Selectors.getGridViewDragState(state);
    const isHoverLine = dragState.hoverRecordId === recordId;
    const dragTarget = dragState.dragTarget;
    const recordRanges = Selectors.getSelectionRecordRanges(state);
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, field && field.id);
    const collaboratorCursorMap = Selectors.collaboratorCursorSelector(state);
    const collaboratorCell = collaboratorCursorMap[`${field.id}_${recordId}`] || EMPTY_ARRAY;
    const keepSort = Selectors.getActiveViewSortInfo(state)?.keepSort;
    const showKeepSortBorder = keepSort && dragState.dragTarget && dragState.hoverGroupHeadRecordId === groupHeadRecordId;
    const hasFoundMark = (() => {
      const searchKeyword = Selectors.getSearchKeyword(state);
      if (!searchKeyword) {
        return false;
      }
      const stringifyCellValue = Selectors.getStringifyCellValue(state, snapshot, recordId, field.id, true);
      if (!stringifyCellValue) {
        return false;
      }
      return stringifyCellValue?.toLowerCase().includes(searchKeyword.toLowerCase());
    })();

    const currentSearchCell = Selectors.getCurrentSearchItem(state);
    let isCurrentSearchCell = false;
    if (currentSearchCell) {
      const [searchRecordId, searchFieldId] = currentSearchCell;
      isCurrentSearchCell = searchRecordId === recordId && searchFieldId === fieldId;
    }
    const isLastSelectionCell = (() => {
      if (!selectionRange) {
        return false;
      }
      const fillHandleCellIndex = Range.bindModel(selectionRange).getIndexRange(state);
      if (!fillHandleCellIndex) {
        return false;
      }
      return fillHandleCellIndex.field.max === currentCellIndex?.fieldIndex
        && fillHandleCellIndex.record.max === currentCellIndex?.recordIndex;
    })();
    const isCellInSelection = (() => {
      if (!selectionRange) {
        return false;
      }
      return Range.bindModel(selectionRange).contains(state, currentCell);
    })();
    return {

      field,
      cellValue,
      isRowDragging: dragTarget.recordId === recordId,
      isActiveRow: Boolean(activeCell && activeCell.recordId === recordId),
      recordChecked: Boolean(recordRanges && recordRanges.findIndex(item => item === recordId) !== -1),
      isCellInSelection,
      isLastSelectionCell,
      showKeepSortBorder,
      isActive: Boolean(activeCell && activeCell.recordId === currentCell.recordId && activeCell.fieldId === currentCell.fieldId),
      isCellInFillSelection: fillHandleStatus?.fillRange && Range.bindModel(fillHandleStatus.fillRange).contains(state, currentCell),
      recordEditable: Field.bindModel(field).recordEditable(),
      collaboratorCell,
      hasFoundMark,
      isCurrentSearchCell,
      isHoverLine,
    };
  }, shallowEqual);

  if (!field) {
    return null;
  }

  let cellClass = classNames(CELL_CLASS, styles.gridCell, {
    [styles.currentSearchCell]: isCurrentSearchCell,
    [styles.foundMarkCell]: hasFoundMark,
  });

  const cellWrapperClass = (() => {
    if (actualColumnIndex === 0) {
      let wrapperClass = classNames(gridCellWrapper, styles.firstHead);
      if (groupInfo) {
        wrapperClass = classNames(wrapperClass, styles['groupOffset' + groupInfo.length]);
      }
      return wrapperClass;
    }
    return gridCellWrapper;
  })();

  /**
   * 1. 查询当前表格&当前视图下，所有的协同光标。
   * 2. 判断当前单元格是否有其他协同人员
   * 3. 协同光标根据 hash(userId+socketId) 映射到彩虹色轮上
   * TODO: 目前是每次进入房间按规则随机颜色，后续可能加入配置项
   */
  let addCollaboratorStyle = {};
  if (collaboratorCell.length) {
    // 协作单元格线框颜色，以最后激活单元格的协作者为准。
    const collaborator = collaboratorCell.reduce((a, b) => a > b ? a : b);
    const color = getCollaboratorColor(collaborator);
    addCollaboratorStyle = {
      outline: `1px solid ${color}`,
    };
  }
  let operateHeadClass = '';
  if (isRowDragging) {
    // 拖动行，原始行的背景效果
    cellClass = classNames(cellClass, styles.originRow);
    operateHeadClass = styles.originRow;
  } else if (recordChecked) {
    // 点击复选框效果
    cellClass = classNames(cellClass, styles.select);
    operateHeadClass = styles.select;
  } else if (isActiveRow || isHoverLine) {
    // 当前有激活选区的那一行增加背景,或者
    // 当前被 hover 的那一行增加背景
    cellClass = classNames(cellClass, styles.editActiveLine);
    operateHeadClass = styles.editActiveLine;
  } else {
    cellClass = classNames(cellClass);
  }

  // 当前激活的cell
  if (isActive) {
    cellClass = classNames(cellClass, styles.activeCell, 'activeCell');
  }

  // 行高类
  cellClass = classNames(cellClass, styles['rowHeight' + rowHeightLevel || RowHeightLevel.Short]);

  // 选区背景
  isCellInSelection && (cellClass = classNames(cellClass, styles.selected));

  // 填充区域背景
  isCellInFillSelection && (cellClass = classNames(cellClass, styles.willFilledCell));

  let width = parseInt(style.width as string, 10);

  if (columns.length > 1 && actualColumnIndex === columns.length - 1 && groupInfo) {
    width = width - (groupInfo.length === 3 ? GROUP_OFFSET : 0);
  }

  function getBorderLeft() {
    if (actualColumnIndex === 0) {
      return showKeepSortBorder ? PRIMARY_COLOR_BORDER : GRAY_COLOR_BORDER;
    }
    return '';
  }

  function getBorderRight() {
    if (groupInfo && actualColumnIndex === columns.length - 1 && showKeepSortBorder) {
      return PRIMARY_COLOR_BORDER;
    }
    return '';
  }

  const isThisCellWillMove = recordMoveType && recordMoveType !== RecordMoveType.NotMove && isActiveRow;
  const preOrderingStyle = isThisCellWillMove ? { background: '#FFF6E5' } : {};

  const customStyle: React.CSSProperties = {
    ...style,
    width,
    borderLeft: getBorderLeft(),
    borderBottom: groupInfo.length ? 'none' : '',
    height: style.height,
    zIndex: isCurrentSearchCell ? 2 : 'auto',
    borderRight: getBorderRight(),
  };

  return (
    <div
      style={customStyle}
      className={classNames({
        [cellWrapperClass]: true,
        [styles.hasCollaborator]: Boolean(collaboratorCell.length),
      })}
    >
      {
        actualColumnIndex === 0 && <>
          <CellRowHead
            row={row}
            recordId={recordId}
            recordChecked={recordChecked}
            displayRowIndex={displayRowIndex}
            groupInfo={groupInfo}
            className={operateHeadClass}
            style={preOrderingStyle}
          />
        </>
      }
      <div
        className={cellClass}
        data-column-index={actualColumnIndex}
        data-group-head-record-id={groupHeadRecordId}
        data-record-id={recordId}
        data-field-id={field && field.id}
        data-cell-type={row.type}
        data-test-id={`cell-${displayRowIndex - 1}-${actualColumnIndex}`}
        style={{
          opacity: '1',
          ...addCollaboratorStyle,
          width:
            (style.width && actualColumnIndex === 0) ?
              (parseInt(style.width as string, 10) - OPERATE_COLUMN_WIDTH) : '',
          height: isActive ? 'max-content' : (style.height as number) - 1, // 减去1个像素，保证边框可以显示出来
          minHeight: (style.height as number) - 1,
          borderBottom: !collaboratorCell.length && groupInfo.length ?
            ' 1px solid ' + (isActive ? 'transparent' : colors.shadowColor) : '',
          boxSizing: groupInfo.length ? 'content-box' : 'inherit',
          fontWeight: actualColumnIndex === 0 ? 'bold' : 'normal',
          ...preOrderingStyle,
        }}
      >
        <div className={styles.overtopLayer}>
          <CellValue
            recordId={recordId}
            readonly={!recordEditable}
            field={field as IField}
            cellValue={cellValue}
            rowHeightLevel={rowHeightLevel}
            isActive={isActive}
            datasheetId={datasheetId}
            showAlarm
          />
        </div>
        {collaboratorCell.length ?
          <CollaboratorMark displayRowIndex={displayRowIndex} collaboratorCell={collaboratorCell} /> : null}
        {recordEditable && !isThisCellWillMove && renderFillHandle(isLastSelectionCell, actualColumnIndex)}
      </div>
    </div>
  );
};

export const CellValueContainer = React.memo(CellValueContainerFC);
