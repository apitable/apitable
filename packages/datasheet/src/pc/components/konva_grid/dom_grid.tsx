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

import classNames from 'classnames';
import * as React from 'react';
import { forwardRef, ForwardRefRenderFunction, memo, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { Message } from '@apitable/components';
import {
  CollaCommandName,
  DATASHEET_ID,
  Field,
  FieldOperateType,
  ICell,
  KONVA_DATASHEET_ID,
  RecordMoveType,
  Selectors,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { getDetailByTargetName, IScrollState, PointPosition } from 'pc/components/gantt_view';
import {
  getCellHeight,
  getCellHorizontalPosition,
  getCellOffsetLeft,
  GRID_BOTTOM_STAT_HEIGHT,
  GRID_ROW_HEAD_WIDTH,
  GridCoordinate,
  KonvaGridContext,
} from 'pc/components/konva_grid';
import { useDispatch, useMemorizePreviousValue } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { ButtonOperateType, checkPointInContainer, getParentNodeByClass, GHOST_RECORD_ID, isTouchDevice } from 'pc/utils';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';

import { PureEditorContainer } from '../editors';
import { IContainerEdit } from '../editors/interface';
import { EXPAND_RECORD, expandRecordIdNavigate } from '../expand_record';
import { MouseDownType } from '../multi_grid';
import { ContextMenu } from '../multi_grid/context_menu';
import { Drag } from '../multi_grid/drag';
import { FieldDesc } from '../multi_grid/field_desc';
import { FieldSetting } from '../multi_grid/field_setting';
import { IElementRectProps, MoveType } from '../multi_grid/hover_line/interface';
import { QuickAppend } from '../multi_grid/quick_append';
import { RecordWillMoveTips } from '../multi_grid/record_will_move_tips/record_will_move_tips';
import { GroupMenu } from './components';
import { StatMenu } from './components/stat_menu';
import { StatRightClickMenu } from './components/stat_right_click_menu';
import { UrlActionContainer } from './components/url_action_container';
import styles from './style.module.less';

interface IDomGridBaseProps {
  datasheetId: string;
  scrollState: IScrollState;
  pointPosition: PointPosition;
  instance: GridCoordinate;
  containerWidth: number;
  containerHeight: number;
  wrapperRef: React.RefObject<HTMLDivElement>;
  cellVerticalBarRef: React.RefObject<HTMLDivElement>;
  offsetX?: number;
}

const DEFAULT_COORD = {
  x: 0,
  y: 0,
};

const DomGridBase: ForwardRefRenderFunction<IContainerEdit, IDomGridBaseProps> = (props, ref) => {
  useImperativeHandle(
    ref,
    (): IContainerEdit => ({
      onViewMouseDown(activeCell?: ICell) {
        containerRef.current?.onViewMouseDown(activeCell);
      },
      focus() {
        containerRef.current?.focus();
      },
    }),
  );

  const { pointPosition, instance, containerWidth, containerHeight, scrollState, wrapperRef, offsetX = 0, cellVerticalBarRef } = props;

  const { x: pointX, y: pointY, rowIndex: pointRowIndex, columnIndex: pointColumnIndex, targetName, realTargetName } = pointPosition;

  const { scrollLeft, scrollTop, isScrolling } = scrollState;
  const { tooltipInfo, scrollToItem, activeCellBound, setCellDown, cellScrollState, setCellScrollState, scrollHandler, activeUrlAction } =
    useContext(KonvaGridContext);
  const { totalHeight: cellTotalHeight, isOverflow } = cellScrollState;
  const containerRef = useRef<IContainerEdit | null>(null);
  const {
    view,
    activeCell,
    selection,
    selectField,
    selectRecord,
    linearRows,
    recordMoveType,
    permissions,
    selectRanges,
    fieldMap,
    visibleColumns,
    datasheetId,
    visibleColumnIndexMap,
    activeFieldId,
    activeFieldOperateType,
    gridViewDragState,
  } = useAppSelector((state) => {
    const { fieldId, operate } = Selectors.gridViewActiveFieldState(state);
    return {
      activeFieldId: fieldId,
      activeFieldOperateType: operate,
      selectField: Selectors.getSelectedField(state),
      selectRecord: Selectors.getSelectedRecord(state),
      linearRows: Selectors.getLinearRows(state)!,
      recordMoveType: Selectors.getRecordMoveType(state),
      permissions: Selectors.getPermissions(state),
      selectRanges: Selectors.getSelectRanges(state),
      fieldMap: Selectors.getFieldMap(state, state.pageParams.datasheetId!)!,
      visibleColumns: Selectors.getVisibleColumns(state),
      datasheetId: Selectors.getActiveDatasheetId(state)!,
      visibleColumnIndexMap: Selectors.getVisibleColumnsMap(state),
      selection: Selectors.getSelection(state),
      activeCell: Selectors.getActiveCell(state),
      gridViewDragState: Selectors.getGridViewDragState(state),
      view: Selectors.getCurrentView(state)!,
    };
  }, shallowEqual);
  const recordId = linearRows[pointRowIndex]?.recordId;
  const showTips = recordMoveType && [RecordMoveType.WillMove, RecordMoveType.OutOfView].includes(recordMoveType);
  const lastRanges = useMemorizePreviousValue(selectRanges![0]);
  const { rowHeight, frozenColumnWidth, frozenColumnCount, rowInitSize } = instance;
  const frozenField = visibleColumns[0];
  const totalColumnCount = visibleColumns.length;
  const state = store.getState();
  const dispatch = useDispatch();
  const fieldHeadHeight = rowInitSize;
  const prevTargetName = useRef<string | null>(null);

  const gridBound = useMemo(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    return rect ? { x: rect.left, y: rect.top } : DEFAULT_COORD;
    // eslint-disable-next-line
  }, [wrapperRef.current, containerWidth, containerHeight]);

  const { x: containerOffsetX, y: containerOffsetY } = gridBound;

  const quickAppend = useMemo(() => {
    if (
      isScrolling ||
      !permissions.rowCreatable ||
      ![
        KONVA_DATASHEET_ID.GRID_ROW_HEAD,
        KONVA_DATASHEET_ID.GRID_CELL,
        KONVA_DATASHEET_ID.GRID_CELL_LINK_ICON,
        KONVA_DATASHEET_ID.GRID_ROW_DRAG_HANDLER,
        KONVA_DATASHEET_ID.GRID_ROW_SELECT_CHECKBOX,
        KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD,
      ].includes(targetName)
    ) {
      return null;
    }
    const top = instance.getRowOffset(pointRowIndex);
    const row = linearRows[pointRowIndex];
    if (!row) return null;
    const { depth } = row;
    const left = getCellOffsetLeft(depth);

    return <QuickAppend hoverRecordId={recordId} top={top} left={left} length={containerWidth} />;
  }, [containerWidth, instance, permissions.rowCreatable, recordId, pointRowIndex, targetName, isScrolling, linearRows]);

  const rectCalculator = useCallback(
    ({ recordId, fieldId }: any) => {
      const state = store.getState();
      const activeCellUIIndex = Selectors.getCellUIIndex(state, {
        recordId,
        fieldId,
      });

      if (activeCellUIIndex != null) {
        const { rowIndex, columnIndex } = activeCellUIIndex;
        if (rowIndex == null || columnIndex == null) {
          return null;
        }
        const { x, y, width: columnWidth } = instance.getCellRect(rowIndex, columnIndex);
        if (!linearRows[rowIndex]) {
          return null;
        }
        const { depth } = linearRows[rowIndex];
        const { offset, width } = getCellHorizontalPosition({
          depth,
          columnWidth,
          columnIndex,
          columnCount: totalColumnCount,
        });
        const isFrozenColumn = columnIndex < frozenColumnCount;
        const height = getCellHeight({
          field: fieldMap[fieldId],
          rowHeight,
          isActive: true,
          activeHeight: activeCellBound.height,
        });
        const finalX =
          (isFrozenColumn ? scrollLeft + x + offset : Math.min(Math.max(x + offset, scrollLeft), scrollLeft + containerWidth - width - offsetX)) + 1;

        return {
          x: finalX,
          y: Math.max(y, scrollTop) + 0.5,
          width: width - 1,
          height: height - 2,
          columnIndex,
          rowIndex,
        };
      }
      return null;
    },
    [
      instance,
      linearRows,
      totalColumnCount,
      fieldMap,
      rowHeight,
      activeCellBound.height,
      scrollLeft,
      containerWidth,
      offsetX,
      scrollTop,
      frozenColumnCount,
    ],
  );

  const scrollPosition = useMemo(() => {
    if (activeCell == null || !isOverflow) return null;
    const activeCellPosition = rectCalculator(activeCell);
    if (activeCellPosition == null) return null;
    const { x, columnIndex, width } = activeCellPosition;
    if (columnIndex >= frozenColumnCount && x - scrollLeft + width <= frozenColumnWidth + GRID_ROW_HEAD_WIDTH) {
      return null;
    }
    return activeCellPosition;
  }, [activeCell, isOverflow, rectCalculator, scrollLeft, frozenColumnWidth, frozenColumnCount]);

  const checkInGrid = (e: MouseEvent) => {
    return Boolean(getParentNodeByClass(e.target as HTMLElement, 'vikaGridView'));
  };

  const getClickCellId = (e: MouseEvent) => {
    if (!checkInGrid(e)) return { recordId: null, fieldId: null };
    const { recordId, fieldId } = getDetailByTargetName(realTargetName);
    if ([KONVA_DATASHEET_ID.GRID_FIELD_HEAD, KONVA_DATASHEET_ID.GRID_ROW_DRAG_HANDLER].includes(prevTargetName.current || '')) {
      return {
        recordId,
        fieldId,
      };
    }
    return { recordId: null, fieldId: null };
  };

  const getFieldId = () => {
    const { fieldId } = getDetailByTargetName(realTargetName);
    return fieldId;
  };

  const getRecordId = () => {
    return linearRows[pointRowIndex]?.recordId;
  };

  const getPositionX = useCallback((x: number) => containerOffsetX + x + offsetX, [containerOffsetX, offsetX]);

  const getElementRect = (_e: any, type: MoveType): IElementRectProps => {
    if (type === MoveType.Column) {
      const columnWidth = Selectors.getColumnWidth(visibleColumns[pointColumnIndex]);
      const isFrozenArea = pointColumnIndex < frozenColumnCount;
      const x = instance.getColumnOffset(pointColumnIndex);
      const posX = getPositionX(x);
      const left = isFrozenArea ? posX : posX - scrollLeft;
      const right = left + columnWidth;
      const offsetX = isFrozenArea ? pointX - x : pointX - x + scrollLeft;
      return {
        left,
        right,
        top: containerOffsetY,
        bottom: containerOffsetY + fieldHeadHeight,
        width: columnWidth,
        height: fieldHeadHeight,
        offsetX,
      };
    }
    const y = instance.getRowOffset(pointRowIndex);
    const top = y - scrollTop + containerOffsetY;
    return {
      left: 0,
      right: 0,
      top,
      bottom: top + rowHeight,
      width: 0,
      height: rowHeight,
      offsetY: pointY - top + containerOffsetY,
    };
  };

  const checkIsOpacityLine = () => {
    return targetName === KONVA_DATASHEET_ID.GRID_FIELD_HEAD_OPACITY_LINE;
  };

  // Get statistics menu position information
  const getStatPositionInfo = (columnIndex: number, rowIndex?: number | null) => {
    const currentColumn = visibleColumns[columnIndex];
    const columnWidth = Selectors.getColumnWidth(currentColumn);
    const originX = instance.getColumnOffset(columnIndex);
    const handleX = columnIndex < frozenColumnCount ? originX : originX - scrollLeft;
    const x = getPositionX(handleX);
    // Group Stat
    if (rowIndex != null) {
      const y = instance.getRowOffset(rowIndex) - scrollTop;
      return {
        x: x + columnWidth - 150,
        y: y + 48 + containerOffsetY,
      };
    }
    // Bottom Stat
    return {
      x: x + columnWidth - 150,
      y: containerHeight + containerOffsetY - 48,
    };
  };

  const getStatMenuBoundary = () => {
    const { targetName, fieldId } = getDetailByTargetName(realTargetName);
    if ([KONVA_DATASHEET_ID.GRID_GROUP_STAT, KONVA_DATASHEET_ID.GRID_BOTTOM_STAT].includes(targetName!)) {
      const rowIndex = targetName === KONVA_DATASHEET_ID.GRID_BOTTOM_STAT ? null : pointRowIndex;
      const pos = getStatPositionInfo(pointColumnIndex, rowIndex);
      return {
        ...pos,
        fieldId: fieldId!,
      };
    }
    return null;
  };

  const getBottomStatMenuBoundary = () => {
    const { targetName, fieldId } = getDetailByTargetName(realTargetName);
    if ([KONVA_DATASHEET_ID.GRID_BOTTOM_STAT].includes(targetName!)) {
      const rowIndex = targetName === KONVA_DATASHEET_ID.GRID_BOTTOM_STAT ? null : pointRowIndex;
      const pos = getStatPositionInfo(pointColumnIndex, rowIndex);
      return {
        ...pos,
        fieldId: fieldId!,
      };
    }
    return null;
  };

  const getGroupMenuBoundary = () => {
    const { targetName } = getDetailByTargetName(realTargetName);
    if ([KONVA_DATASHEET_ID.GRID_GROUP_STAT, KONVA_DATASHEET_ID.GRID_GROUP_TAB].includes(targetName!)) {
      return {
        x: getPositionX(pointX),
        y: pointY + containerOffsetY,
        row: linearRows[pointRowIndex],
      };
    }
    return null;
  };

  const scrollWhenHitViewEdg = (e: MouseEvent) => {
    const gridRef = wrapperRef.current;

    if (!gridRef) return;
    const gridRect = gridRef.getBoundingClientRect();
    const scrollObj = checkPointInContainer(
      { x: e.clientX, y: e.clientY },
      {
        top: gridRect.top + fieldHeadHeight,
        bottom: gridRect.bottom - GRID_BOTTOM_STAT_HEIGHT,
        left: gridRect.left + frozenColumnWidth + GRID_ROW_HEAD_WIDTH,
        right: gridRect.right,
        width: 0,
        height: 0,
      } as any,
      70,
    );
    if (scrollObj.shouldScroll) {
      scrollHandler.scrollByValue({
        rowSpeed: scrollObj.columnSpeed,
        columnSpeed: scrollObj.rowSpeed,
      });
    } else {
      scrollHandler.stopScroll();
    }
  };

  const getIdMapByEvent = (e: MouseEvent) => {
    const isSideRecordOpen = state.space.isSideRecordOpen;
    const fieldId = visibleColumns[pointColumnIndex]?.fieldId;
    switch (targetName) {
      case KONVA_DATASHEET_ID.GANTT_TASK:
      case KONVA_DATASHEET_ID.GRID_CELL:
      case KONVA_DATASHEET_ID.GRID_ROW_SELECT_CHECKBOX:
      case KONVA_DATASHEET_ID.GRID_ROW_DRAG_HANDLER:
      case KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD:
      case KONVA_DATASHEET_ID.GRID_ROW_HEAD:
      case KONVA_DATASHEET_ID.GRID_CELL_LINK_ICON: {
        if (pointRowIndex === -1 || e.button !== MouseDownType.Right) return {};
        const recordId = linearRows[pointRowIndex].recordId;
        const hoverCell = {
          recordId,
          fieldId: fieldId || frozenField.fieldId,
        };
        const cellInSelection = Selectors.isCellInSelection(state, hoverCell);
        if (cellInSelection) return { recordId };
        dispatch(StoreActions.setActiveCell(datasheetId, hoverCell));
        if (isSideRecordOpen) {
          expandRecordIdNavigate(datasheetId);
        }
        return { recordId };
      }
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_MORE: {
        if (e.type === 'touchend') return { fieldId };
        if (!fieldId || targetName !== prevTargetName.current) return {};
        if (e.type !== 'click' && e.button !== MouseDownType.Right) return {};
        return { fieldId };
      }
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD: {
        if (!fieldId) return {};
        if (e.button !== MouseDownType.Right) return {};
        return { fieldId };
      }
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_SELECT_CHECKBOX: {
        if (e.button !== MouseDownType.Right) return {};
        return { recordId: GHOST_RECORD_ID };
      }
      default:
        return {};
    }
  };

  const clickFieldHead = useCallback(
    (operateType: FieldOperateType, fieldId: string) => {
      let left = 0;
      let x = 0;
      let columnIndex = 0;

      if (fieldId !== ButtonOperateType.AddField) {
        const field = fieldMap[fieldId];

        if (field && !Field.bindModel(field).propertyEditable()) return;
        if (!permissions.manageable) return;
        columnIndex = visibleColumnIndexMap.get(fieldId) || 0;
        x = instance.getColumnOffset(columnIndex);
      } else {
        columnIndex = totalColumnCount;
        x = instance.getColumnOffset(columnIndex);
      }
      left = getPositionX(x);
      dispatch(
        StoreActions.setActiveFieldState(datasheetId, {
          fieldId,
          fieldRectLeft: left,
          fieldRectBottom: containerOffsetY + fieldHeadHeight,
          clickLogOffsetX: 0,
          fieldIndex: columnIndex,
          operate: operateType,
        }),
      );
    },
    [
      datasheetId,
      dispatch,
      fieldMap,
      getPositionX,
      instance,
      permissions.manageable,
      visibleColumnIndexMap,
      totalColumnCount,
      containerOffsetY,
      fieldHeadHeight,
    ],
  );

  const onDblClick = (e: MouseEvent) => {
    e.preventDefault();
    if (targetName === KONVA_DATASHEET_ID.GRID_FIELD_HEAD) {
      const pointFieldId = visibleColumns[pointColumnIndex]?.fieldId;
      pointFieldId && editFieldSetting(pointFieldId);
    }
  };

  const onClick = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (prevTargetName.current != null && prevTargetName.current !== targetName) return;
    if (targetName === KONVA_DATASHEET_ID.GRID_FIELD_ADD_BUTTON) {
      editFieldSetting(ButtonOperateType.AddField);
    }
    if (targetName === KONVA_DATASHEET_ID.GRID_FIELD_HEAD_DESC) {
      const { fieldId: targetFieldId } = getDetailByTargetName(realTargetName);
      editFieldDesc(targetFieldId);
    }
  };

  const editFieldSetting = useCallback((fieldId: any) => clickFieldHead(FieldOperateType.FieldSetting, fieldId), [clickFieldHead]);

  const editFieldDesc = useCallback((fieldId: any) => clickFieldHead(FieldOperateType.FieldDesc, fieldId), [clickFieldHead]);

  const onMouseDown = () => {
    prevTargetName.current = targetName;
  };

  useEffect(() => {
    const element = wrapperRef?.current;
    if (!element) return;
    element.addEventListener('click', onClick);
    element.addEventListener('dblclick', onDblClick);
    element.addEventListener('mousedown', onMouseDown);
    return () => {
      element.removeEventListener('click', onClick);
      element.removeEventListener('dblclick', onDblClick);
      element.removeEventListener('mousedown', onMouseDown);
    };
  });

  // Compatible with touch device not triggering click event issue
  useEffect(() => {
    if (!isTouchDevice()) return;
    const element = wrapperRef!.current;
    if (!element) return;
    element.addEventListener('touchend', onClick);
    return () => {
      element.removeEventListener('touchend', onClick);
    };
  });

  function isClickInExpandModal(e: MouseEvent) {
    const modalRoot = document.querySelector('.ant-modal-root');
    // The expand card displayed on the side doesn't let the cell go out of focus even when you click on it
    const sideRecordContainer = document.getElementById(DATASHEET_ID.SIDE_RECORD_PANEL);
    if ((modalRoot && modalRoot.contains(e.target as HTMLElement)) || (sideRecordContainer && sideRecordContainer.contains(e.target as HTMLElement)))
      return true;
    return false;
  }

  const onGlobalMouseDown = (e: MouseEvent) => {
    if (isClickInExpandModal(e)) return;
    if (getParentNodeByClass(e.target as HTMLElement, ['vikaGridView', 'hideenFieldItem'])) return;

    // Determine whether a click is a scrollbar under "canvas" mode
    const wrapperElement = wrapperRef.current;
    if (wrapperElement) {
      const horizontalScrollBar = wrapperElement.nextSibling;
      const verticalScrollBar = horizontalScrollBar?.nextSibling;
      const cellVerticalBar = cellVerticalBarRef.current;
      if (horizontalScrollBar?.contains(e.target as Element)) return;
      if (verticalScrollBar?.contains(e.target as Element)) return;
      if (cellVerticalBar?.contains(e.target as Element)) return;
    }

    if (!document.getElementById(DATASHEET_ID.DOM_CONTAINER)!.contains(e.currentTarget as Element)) {
      containerRef.current?.onViewMouseDown();
    }

    dispatch(StoreActions.clearSelection(datasheetId));
    dispatch(StoreActions.clearActiveRowInfo(datasheetId));
  };

  const mouseUp = () => {
    setCellDown(false);
    scrollHandler.stopScroll();
  };

  useEffect(() => {
    document.addEventListener('mousedown', onGlobalMouseDown);
    document.addEventListener('mouseup', mouseUp);
    return () => {
      document.removeEventListener('mousedown', onGlobalMouseDown);
      document.removeEventListener('mouseup', mouseUp);
    };
  });

  const handleCellVerticalScroll = (e: any) => {
    const { scrollTop } = e.target;
    setCellScrollState({
      scrollTop,
    });
  };

  const renderTooltip = () => {
    const {
      visible,
      title,
      placement,
      width,
      height,
      x,
      y,
      rowIndex,
      columnIndex,
      coordXEnable = true,
      coordYEnable = true,
      rowsNumber,
    } = tooltipInfo;
    if (!visible) return null;
    const left = coordXEnable ? x || instance.getColumnOffset(columnIndex) : scrollLeft + x;
    const top = coordYEnable ? y || instance.getRowOffset(rowIndex) : scrollTop + y;
    return (
      <Tooltip title={title} visible={visible} placement={placement} showTipAnyway rowsNumber={rowsNumber}>
        <div
          style={{
            position: 'absolute',
            width,
            height: height || 1,
            left,
            top,
            pointerEvents: 'none',
          }}
        />
      </Tooltip>
    );
  };

  const onFrozenColumn = (fieldId: string, reset: boolean = false) => {
    let columnIndex = view.columns.findIndex((column) => column.fieldId === fieldId);
    if (reset) {
      columnIndex = 0;
    }
    if (columnIndex === -1) return;
    const visibleColumnIndex = visibleColumns.findIndex((column) => column.fieldId === fieldId);
    const columnWidth = Selectors.getColumnWidth(visibleColumns[visibleColumnIndex]);
    const x = instance.getColumnOffset(visibleColumnIndex);

    if (x + columnWidth + offsetX > containerWidth) {
      Message.warning({ content: t(Strings.freeze_warning_cant_freeze_field) });
      return;
    }

    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetViewFrozenColumnCount,
          viewId: view.id,
          count: columnIndex + 1,
        });
      },
      {
        frozenColumnCount: columnIndex + 1,
      },
    );
  };

  let moveTipOffsetY: null | number = null;
  if (showTips && activeCell) {
    const cellUIIndex = Selectors.getCellUIIndex(state, activeCell);
    if (cellUIIndex) {
      moveTipOffsetY = instance.getRowOffset(cellUIIndex.rowIndex);
    }
  }

  return (
    <>
      <div id={DATASHEET_ID.DOM_CONTAINER} className={styles.domGrid}>
        <div
          style={{
            transform: `translateY(-${scrollTop}px)`,
            pointerEvents: 'auto',
          }}
        >
          {!gridViewDragState.dragTarget?.recordId && quickAppend}
          {moveTipOffsetY != null && <RecordWillMoveTips rowHeight={rowHeight} y={moveTipOffsetY} />}
        </div>

        <div
          style={{
            transform: `translate3d(-${scrollLeft}px, -${scrollTop}px, 0)`,
            pointerEvents: 'auto',
          }}
        >
          {/* Editor */}
          {selection && (
            <PureEditorContainer
              ref={containerRef}
              record={selectRecord!}
              field={selectField as any}
              scrollToItem={scrollToItem}
              selection={selection}
              activeCell={activeCell}
              selectionRange={lastRanges}
              rectCalculator={rectCalculator}
              scrollLeft={scrollLeft}
              scrollTop={scrollTop}
            />
          )}

          {/* Tooltip */}
          {renderTooltip()}
        </div>

        <div
          style={{
            overflow: 'hidden',
            position: 'absolute',
            top: fieldHeadHeight,
            left: 0,
            width: containerWidth,
            height: containerHeight - fieldHeadHeight,
          }}
        >
          <div style={{ transform: `translate3d(-${scrollLeft}px, -${scrollTop}px, 0)` }}>
            {/* The scrolling of active cell */}
            {scrollPosition != null && (
              <div
                ref={cellVerticalBarRef}
                className={classNames(styles.verticalScrollBarWrapper)}
                style={{
                  pointerEvents: 'auto',
                  height: activeCellBound.height,
                  top: scrollPosition.y - fieldHeadHeight,
                  left: scrollPosition.x + scrollPosition.width - 10,
                  opacity: 0,
                }}
                onScroll={handleCellVerticalScroll}
              >
                <div
                  className={styles.verticalScrollBarInner}
                  style={{
                    width: 1,
                    height: cellTotalHeight,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Drag and drop rows/columns */}
        <Drag
          width={containerWidth}
          height={containerHeight}
          rowHeight={rowHeight}
          gridRef={wrapperRef}
          scrollWhenHitViewEdg={scrollWhenHitViewEdg}
          checkInGrid={checkInGrid}
          getClickCellId={getClickCellId}
          getFieldId={getFieldId}
          getRecordId={getRecordId}
          getElementRect={getElementRect}
          checkIsOpacityLine={checkIsOpacityLine}
        />
      </div>

      {/* Group header menu */}
      <GroupMenu parentRef={wrapperRef} getBoundary={getGroupMenuBoundary} />

      {/* Statistics column menu */}
      <StatMenu parentRef={wrapperRef} getBoundary={getStatMenuBoundary} />

      {/* The right-click menu of the statistics column */}
      <StatRightClickMenu parentRef={wrapperRef} getBoundary={getBottomStatMenuBoundary} />

      {/* Right-click menu */}
      <ContextMenu
        parentRef={wrapperRef}
        getIdMapByEvent={getIdMapByEvent}
        editFieldSetting={editFieldSetting}
        editFieldDesc={editFieldDesc}
        onFrozenColumn={onFrozenColumn}
      />

      {/* Field setting */}
      {activeFieldId && activeFieldOperateType === FieldOperateType.FieldSetting && !document.querySelector(`.${EXPAND_RECORD}`) && (
        <FieldSetting scrollToItem={scrollToItem} />
      )}

      {/* Field Description */}
      {activeFieldId && activeFieldOperateType === FieldOperateType.FieldDesc && !document.querySelector(`.${EXPAND_RECORD}`) && (
        <FieldDesc fieldId={activeFieldId} datasheetId={datasheetId} readOnly={!permissions.descriptionEditable} />
      )}
      {activeUrlAction && (
        <UrlActionContainer
          rectCalculator={rectCalculator}
          activeCell={activeCell}
          recordId={selectRecord?.id}
          fieldId={selectField?.id}
          datasheetId={datasheetId}
          scrollLeft={scrollLeft}
          scrollTop={scrollTop}
        />
      )}
    </>
  );
};

export const DomGrid = memo(forwardRef(DomGridBase));
