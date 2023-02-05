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

import {
  CellType, Events, IGridViewColumn, IGridViewProperty, ILinearRow, Player, RowHeight, Selectors, StoreActions, ViewType
} from '@apitable/core';
import { GridOnScrollProps, VariableSizeGrid as Grid } from 'react-window';
import { useMount, useUpdateEffect } from 'ahooks';
import { browser } from 'modules/shared/browser';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import * as React from 'react';
import { isMobile } from 'react-device-detect';
import ReactDom from 'react-dom';
import { useSelector } from 'react-redux';
import { CellLeft, CellRight, OPERATE_COLUMN_WIDTH } from '../cell';
import { StatOptionForGridLeft, StatOptionForGridRight } from '../cell/stat_option/stat_option_for_grid/stat_option_for_grid';
import { GRID_VIEW_BLANK_HEIGHT } from '../constant';
import { HeaderLeft, HeaderRight } from '../header';
import { IScrollToItemParams } from '../interface';
import styles from './styles.module.less';
import { useDispatch } from 'pc/hooks';
import cls from 'classnames';

const { getColumnWidth } = Selectors;

export const HEADER_ROW_FIXED_COUNT = 1;
export const STET_BAR_HEIGHT = 40;
export const HEADER_ROW_HEIGHT = 40;
export const GROUP_OFFSET = 16;
export const GROUP_TAB = 48;

export const GRID_VIEWS_ID = 'gridViews';

interface IGridViewOwnProps {
  frozenColumns: IGridViewColumn[];
  exceptFrozenColumns: IGridViewColumn[];
  rowHeight: number;
  rows: ILinearRow[];
  fixedRowHeight: number;
  fixedColumnWidth: number;
  unFixedColumnWidth: number;
  unFixedRowHeight: number;
  scrollLeft: number;
  scrollTop: number;
  setScrollState: (props: { scrollLeft?: number, scrollTop?: number }) => void;
}

export interface IScrollData {
  scrollTop: number;
  scrollLeft: number;
}

export enum GridReg {
  // UpperLeftReg = 'upperLeftReg',
  UpperRightReg = 'upperRightReg',
  BottomLeftReg = 'bottomLeftReg',
  BottomRightReg = 'bottomRightReg',
  // GroupLeftReg = 'groupLeftReg',
  GroupStatRightReg = 'groupStatRightReg',
}

export enum GridRef {
  UpperLeftRef = 'upperLeftRef',
  UpperRightRef = 'upperRightRef',
  BottomLeftRef = 'bottomLeftRef',
  BottomRightRef = 'bottomRightRef',
  GroupStatLeftRef = 'groupStatLeftRef',
  GroupStatRightRef = 'groupStatRightRef',
}

export interface IGridViewsHandle {
  changeScroll(regName: GridReg, scrollData: IScrollData): void;
  scrollToItem(refName: GridRef, props: IScrollToItemParams): void;
  getReg(regName: GridReg): Element;
}

const attachOperateColumnPadding = (fn: (i: number) => number, groupCount: number) => {
  return (index: number) => {
    const width = fn(index);
    return index === 0 ?
      width + OPERATE_COLUMN_WIDTH + (groupCount ? GROUP_OFFSET * (groupCount - 1) : 0) :
      width + (groupCount ? GROUP_OFFSET : 0);
  };
};

export const GridViewsBase: React.ForwardRefRenderFunction<{}, IGridViewOwnProps> = (props, ref) => {
  const {
    frozenColumns,
    fixedRowHeight,
    fixedColumnWidth,
    exceptFrozenColumns,
    unFixedColumnWidth,
    rowHeight,
    rows,
    scrollLeft,
    scrollTop,
    setScrollState,
  } = props;
  const upperLeftRef = useRef<Grid>(null);
  const upperRightRef = useRef<Grid>(null);
  const bottomLeftRef = useRef<Grid>(null);
  const bottomRightRef = useRef<Grid>(null);
  const groupStatLeftRef = useRef<Grid>(null);
  const groupStatRightRef = useRef<Grid>(null);
  const dispatch = useDispatch();
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;
  const visibleRows = useSelector(state => Selectors.getVisibleRows(state));
  const visibleColumns = useSelector(state => Selectors.getVisibleColumns(state));
  const highlightFieldId = useSelector(state => Selectors.getHighlightFieldId(state))?.toString();
  const columnIndex = useSelector(state => highlightFieldId && visibleColumns.find(column => column.fieldId === highlightFieldId) ?
    Selectors.findColumnIndexById(state, highlightFieldId) : 0);
  // const recordId = useSelector(Selectors.getActiveRecordId);
  const currentView = useSelector(Selectors.getCurrentView)!;

  const totalRegObj = useRef<{ [key: string]: Element }>({});
  const timerRef = useRef<any>();

  const moveType = useSelector(Selectors.getRecordMoveType);

  useEffect(() => {
    if (!timerRef.current && highlightFieldId && visibleColumns.find(column => column.fieldId === highlightFieldId)) {
      timerRef.current = setTimeout(() => {
        if (upperRightRef.current && bottomRightRef.current && columnIndex) {
          upperRightRef.current.scrollToItem({ columnIndex });
          bottomRightRef.current.scrollToItem({ columnIndex });
          dispatch(StoreActions.setHighlightFieldId(null, datasheetId));
          dispatch(StoreActions.setFieldRanges(datasheetId, [highlightFieldId]));
          dispatch(StoreActions.setSelection({
            start: {
              recordId: visibleRows[0].recordId,
              fieldId: highlightFieldId,
            },
            end: {
              recordId: visibleRows[visibleRows.length - 1].recordId,
              fieldId: highlightFieldId,
            },
          }));
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }, 0);
    }
    // eslint-disable-next-line
  }, [highlightFieldId]);

  // Automatic jumping in regular mode
  const activeCell = useSelector(state => Selectors.getActiveCell(state));
  useUpdateEffect(() => {
    if(!activeCell) {
      return;
    }

    const activeSelectFieldId = activeCell.fieldId;
    const fieldIndex = visibleColumns.findIndex(field => field.fieldId === activeSelectFieldId);
    bottomRightRef.current?.scrollToItem({
      columnIndex: fieldIndex - 1
    });
    upperRightRef.current?.scrollToItem({
      columnIndex: fieldIndex - 1
    });

  }, [activeCell]);

  useMount(() => {
    currentView.type === ViewType.Grid && Player.doTrigger(Events.datasheet_grid_view_shown);
  });
  const groupLevel = useSelector(state => {
    const groupInfo = (Selectors.getCurrentView(state)! as IGridViewProperty).groupInfo;
    if (!groupInfo) {
      return 0;
    }
    return groupInfo.length;
  })!;
  const rowHeightLevel = useSelector(Selectors.getViewRowHeight);
  const columns = useSelector(state => Selectors.getVisibleColumns(state));
  const isGroupEmptyContent = Boolean(
    groupLevel &&
    rows[0]?.type === CellType.Blank &&
    rows[1]?.type === CellType.Add,
  );

  const itemData = {
    isGroupEmptyContent,
    datasheetId,
    rowHeightLevel,
    columns,
    rows,
    recordMoveType: moveType,
  };
  const bottomRowCount = rows.length + 1;

  useEffect(() => {
    if (!browser.isBrowser('Safari')) {
      return;
    }

    const body = document.getElementsByTagName('body')[0];
    const datasheet = document.getElementById('gridViews');
    if (!datasheet) {
      return;
    }
    const handleMouseWheel = (event: any) => {
      // We don't want to scroll below zero or above the width and height
      const maxX = body.scrollWidth - body.offsetWidth;
      const maxY = body.scrollHeight - body.offsetHeight;
      if (body.scrollLeft + event.deltaX < 0 ||
        body.scrollLeft + event.deltaX > maxX ||
        body.scrollTop + event.deltaY < 0 ||
        body.scrollTop + event.deltaY > maxY) {
        if (datasheet && datasheet.contains(event.target)) {
          event.preventDefault();
        }

        // Manually set the scroll to the boundary
        body.scrollLeft = Math.max(0, Math.min(maxX, body.scrollLeft + event.deltaX));
        body.scrollTop = Math.max(0, Math.min(maxY, body.scrollTop + event.deltaY));
      }
    };
    datasheet.addEventListener('mousewheel', handleMouseWheel);

    return () => {
      datasheet.removeEventListener('mousewheel', handleMouseWheel);
    };
  });

  useEffect(() => {
    totalRegObj.current = {
      upperRightReg: ReactDom.findDOMNode(upperRightRef.current) as Element,
      bottomLeftReg: ReactDom.findDOMNode(bottomLeftRef.current) as Element,
      bottomRightReg: ReactDom.findDOMNode(bottomRightRef.current) as Element,
      groupStatRightReg: ReactDom.findDOMNode(groupStatRightRef.current) as Element,
    };
  }, []);

  useImperativeHandle(ref, () => ({
    changeScroll(regName: GridReg, scrollData: IScrollData) {
      if (totalRegObj.current[regName]) {
        totalRegObj.current[regName].scrollTo(scrollData.scrollLeft, scrollData.scrollTop);
      }
    },
    scrollToItem(refName: GridRef, props: IScrollToItemParams) {
      if (refName === GridRef.UpperRightRef) {
        upperRightRef.current!.scrollToItem(props);
      }
      if (refName === GridRef.BottomLeftRef) {
        bottomLeftRef.current!.scrollToItem(props);
      }
      if (refName === GridRef.BottomRightRef) {
        bottomRightRef.current!.scrollToItem(props);
      }
      if (refName === GridRef.GroupStatRightRef) {
        groupStatRightRef.current?.scrollToItem(props);
      }
    },
    getReg(regName: GridReg) {
      return totalRegObj.current[regName];
    },
  }));

  // Refresh the cache when the rowHeight changes
  useEffect(() => {
    setTimeout(() => {
      const left = totalRegObj.current.bottomLeftReg;
      const right = totalRegObj.current.bottomRightReg;
      if (left.scrollTop !== right.scrollTop) {
        left.scrollTop = right.scrollTop;
      }
    }, 0);
    bottomLeftRef.current && bottomLeftRef.current.resetAfterRowIndex(0, true);
    bottomRightRef.current && bottomRightRef.current.resetAfterRowIndex(0, true);
    // eslint-disable-next-line
  }, [rowHeight, bottomLeftRef, bottomRightRef, rows, groupLevel]);

  // The cache is refreshed when columns change (adjusting column widths, etc.), 
  // and the same effect can be achieved here without the columns listener frozenColumns change
  useEffect(() => {
    upperRightRef.current && upperRightRef.current!.resetAfterColumnIndex(0, true);
    bottomLeftRef.current && bottomLeftRef.current!.resetAfterColumnIndex(0, true);
    bottomRightRef.current && bottomRightRef.current!.resetAfterColumnIndex(0, true);
    upperLeftRef.current && upperLeftRef.current!.resetAfterColumnIndex(0, true);
    groupStatLeftRef.current && groupStatLeftRef.current!.resetAfterColumnIndex(0, true);
    groupStatRightRef.current && groupStatRightRef.current!.resetAfterColumnIndex(0, true);
    // eslint-disable-next-line
  }, [frozenColumns, bottomLeftRef, bottomRightRef, upperRightRef, groupStatLeftRef, groupStatRightRef, groupLevel]);

  const mainGridHeight = (unFixHeight: number) => {
    return unFixHeight - STET_BAR_HEIGHT;
  };

  const calcFieldWidth = (fn: (i: number) => number) => {
    return (index: number) => {
      if (index === exceptFrozenColumns.length - 1 && groupLevel) {
        return fn(index) + (groupLevel === 3 ? GROUP_OFFSET : 0);
      }
      if ((index + 1) === (frozenColumns.length + exceptFrozenColumns.length)) {
        return 200;
      }
      return fn(index);
    };
  };

  const calcRowHeight = (index: number) => {
    const row = rows[index];
    // The height of the bottom of the table, propping up the margins
    if (!row) {
      return GRID_VIEW_BLANK_HEIGHT;
    }
    switch (row.type) {
      case CellType.Record:
        return rowHeight;
      case CellType.Blank:
        return GROUP_OFFSET;
      case CellType.GroupTab:
        return GROUP_TAB;
      case CellType.Add:
        return RowHeight.Short;
    }
  };

  const itemKey = (isRight: boolean) => {
    const columns = isRight ? exceptFrozenColumns : frozenColumns;
    return ({ rowIndex, columnIndex }: {
      rowIndex: number;
      columnIndex: number;
    }) => {
      const row = rows[rowIndex];
      const col = columns[columnIndex];
      const recordId = row ? row.recordId : rowIndex;
      const fieldId = col ? col.fieldId : columnIndex;
      const isBlank = row && row.type === CellType.Blank;
      return `${row ? row.type : 'Placeholder'}${isBlank ? rowIndex : ''}-${recordId}-${fieldId}-${row && 'depth' in row ? row.depth : ''}`;
    };
  };

  // Synchronize the position state of several grids
  const syncScroll = useCallback((ref: React.RefObject<Grid>) => {
    return ({ scrollLeft, scrollTop, scrollUpdateWasRequested }: GridOnScrollProps) => {
      if (!isMobile) {
        return;
      }
      if (scrollUpdateWasRequested) {
        return;
      }
      if (ref === bottomRightRef) {
        setScrollState({ scrollLeft, scrollTop });
        return;
      }
      if (ref === bottomLeftRef) {
        setScrollState({ scrollTop });
        return;
      }
      if (ref === upperRightRef || ref === groupStatRightRef) {
        setScrollState({ scrollLeft });
        return;
      }
    };
  }, [setScrollState]);

  useEffect(() => {
    bottomLeftRef.current?.scrollTo({ scrollLeft: 0, scrollTop });
    upperRightRef.current?.scrollTo({ scrollLeft, scrollTop: 0 });
    groupStatRightRef.current?.scrollTo({ scrollLeft, scrollTop: 0 });

    bottomRightRef.current?.scrollTo({
      scrollLeft,
      scrollTop,
    });
  }, [scrollTop, scrollLeft]);

  const gridStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: isMobile ? 'auto' : 'hidden',
  };

  return (
    <div id={GRID_VIEWS_ID}>
      <Grid
        className={styles.grid}
        columnCount={frozenColumns.length}
        columnWidth={
          attachOperateColumnPadding(index => getColumnWidth(frozenColumns[index]), groupLevel || 0)
        }
        height={fixedRowHeight}
        overscanColumnCount={0}
        overscanRowCount={0}
        rowCount={HEADER_ROW_FIXED_COUNT}
        rowHeight={() => HEADER_ROW_HEIGHT}
        style={gridStyle}
        width={fixedColumnWidth + (groupLevel ? GROUP_OFFSET * (groupLevel - 1) : 0)}
        ref={upperLeftRef}
        
      >
        {HeaderLeft}
      </Grid>
      <Grid
        className={styles.grid}
        columnCount={exceptFrozenColumns.length + 1}
        columnWidth={calcFieldWidth(index => getColumnWidth(exceptFrozenColumns[index]))}
        height={fixedRowHeight}
        overscanColumnCount={0}
        overscanRowCount={0}
        rowCount={HEADER_ROW_FIXED_COUNT}
        rowHeight={() => HEADER_ROW_HEIGHT}
        style={{ ...gridStyle, left: fixedColumnWidth + GROUP_OFFSET * (groupLevel ? groupLevel - 1 : 0) }}
        width={unFixedColumnWidth + (groupLevel === 3 ? GROUP_OFFSET : 0)}
        ref={upperRightRef}
        
        onScroll={syncScroll(upperRightRef)}
      >
        {HeaderRight}
      </Grid>
      <Grid
        className={styles.grid}
        columnCount={frozenColumns.length}
        columnWidth={attachOperateColumnPadding(index => getColumnWidth(frozenColumns[index]), 0)}
        height={mainGridHeight(props.unFixedRowHeight)}
        overscanColumnCount={0}
        overscanRowCount={0}
        rowCount={bottomRowCount}
        rowHeight={calcRowHeight}
        itemData={itemData}
        itemKey={itemKey(false)}
        style={{ ...gridStyle, top: HEADER_ROW_HEIGHT }}
        width={fixedColumnWidth + (groupLevel ? GROUP_OFFSET * (groupLevel - 1) : 0)}
        ref={bottomLeftRef}
        onScroll={syncScroll(bottomLeftRef)}
        
      >
        {CellLeft}
      </Grid>
      <Grid
        className={styles.grid}
        columnCount={exceptFrozenColumns.length + 1}
        columnWidth={calcFieldWidth(index => getColumnWidth(exceptFrozenColumns[index]))}
        height={mainGridHeight(props.unFixedRowHeight)}
        overscanColumnCount={0}
        overscanRowCount={0}
        rowCount={bottomRowCount}
        rowHeight={calcRowHeight}
        itemData={itemData}
        itemKey={itemKey(true)}
        style={{
          ...gridStyle, left: fixedColumnWidth + GROUP_OFFSET * (groupLevel ? groupLevel - 1 : 0),
          top: HEADER_ROW_HEIGHT,
        }}
        width={unFixedColumnWidth + (groupLevel === 3 ? GROUP_OFFSET : 0)}
        ref={bottomRightRef}
        
        onScroll={syncScroll(bottomRightRef)}
      >
        {CellRight}
      </Grid>
      <div className={styles.bottomStat}>
        <Grid
          className={styles.grid}
          columnCount={frozenColumns.length}
          columnWidth={
            attachOperateColumnPadding(index => getColumnWidth(frozenColumns[index]),
              groupLevel ? groupLevel : 0)
          }
          height={STET_BAR_HEIGHT}
          overscanColumnCount={0}
          overscanRowCount={0}
          rowCount={HEADER_ROW_FIXED_COUNT}
          rowHeight={() => STET_BAR_HEIGHT}
          style={{ ...gridStyle, zIndex: 1 }}
          width={fixedColumnWidth + (groupLevel ? GROUP_OFFSET * (groupLevel - 1) : 0)}
          ref={groupStatLeftRef}
          
        >
          {StatOptionForGridLeft}
        </Grid>
        <Grid
          className={cls(styles.grid, styles.gridRight)}
          columnCount={exceptFrozenColumns.length + 1}
          columnWidth={calcFieldWidth(index => getColumnWidth(exceptFrozenColumns[index]))}
          height={STET_BAR_HEIGHT}
          overscanColumnCount={0}
          overscanRowCount={0}
          rowCount={HEADER_ROW_FIXED_COUNT}
          rowHeight={() => STET_BAR_HEIGHT}
          style={{ ...gridStyle, left: fixedColumnWidth + GROUP_OFFSET * (groupLevel ? groupLevel - 1 : 0), zIndex: 1 }}
          width={unFixedColumnWidth + (groupLevel === 3 ? GROUP_OFFSET : 0)}
          ref={groupStatRightRef}
          
          onScroll={syncScroll(groupStatRightRef)}
        >
          {StatOptionForGridRight}
        </Grid>
      </div>
    </div>
  );
};

export const GridViews = React.memo(forwardRef(GridViewsBase));
