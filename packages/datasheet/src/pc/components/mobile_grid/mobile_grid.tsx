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
import { useCallback, useRef, useEffect, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { shallowEqual } from 'react-redux';
import { VariableSizeList as List, VariableSizeGrid as Grid, GridOnScrollProps } from 'react-window';
import { DATASHEET_ID, Field, FieldOperateType, IReduxState, Selectors, StoreActions } from '@apitable/core';
import { browser } from 'modules/shared/browser';
import { useDispatch } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { FIELD_HEAD_CLASS, getElementDataset, getParentNodeByClass } from 'pc/utils';
import { expandRecordIdNavigate } from '../expand_record';
import { FieldSetting } from '../multi_grid/field_setting';
import { AddRecord } from './add_record';
import { Cell, CellTitle, CellHead } from './cell';
import { FieldMenu } from './field_menu';
import styles from './styles.module.less';

const COLUMN_WIDTH = 134;
const ROW_HEIGHT = 80 + 16 + 14;
const FIXED_TITLE_HEIGHT = 32;
const MARGIN_BOTTOM = 32;

const GRID_CLASS = 'GRID_CLASS';

export interface IMobileGridProps {
  width: number;
  height: number;
}

export const MobileGrid: React.FC<React.PropsWithChildren<IMobileGridProps>> = ({ width, height }) => {
  const {
    visibleColumns,
    datasheetId,
    fieldMap,
    rows,
    rowCreatable,
    manageable,
    activeFieldOperateType,
    viewId,
    recordId,
    searchKeyword,
    snapshot,
    mirrorId,
  } = useAppSelector((state: IReduxState) => {
    const visibleColumns = Selectors.getVisibleColumns(state)!;
    const { datasheetId, mirrorId } = state.pageParams;
    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    const rows = Selectors.getPureVisibleRows(state);
    const permissions = Selectors.getPermissions(state);
    const activeFieldOperateType = Selectors.gridViewActiveFieldState(state).operate;
    const { viewId, recordId } = state.pageParams;
    const searchKeyword = Selectors.getSearchKeyword(state, datasheetId);
    const snapshot = Selectors.getSnapshot(state)!;

    return {
      visibleColumns,
      datasheetId,
      fieldMap,
      rows,
      rowCreatable: permissions.rowCreatable,
      manageable: permissions.manageable,
      activeFieldOperateType,
      viewId,
      recordId,
      searchKeyword,
      snapshot,
      mirrorId,
    };
  }, shallowEqual);

  const [firstColumn, ...remainingColumns] = visibleColumns;

  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  const onHeaderClick = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const fieldTitle = getParentNodeByClass(element, styles.fieldTitleWrapper);
    const fieldElement = getParentNodeByClass(element, FIELD_HEAD_CLASS);
    const fieldId = getElementDataset(fieldElement, 'fieldId');
    const fieldIndex = visibleColumns.findIndex((field) => field.fieldId === fieldId);

    if (!fieldId || !manageable || !fieldElement) {
      return;
    }

    const field = fieldMap[fieldId];
    if (field && !Field.bindModel(field).propertyEditable()) {
      return;
    }

    if (fieldTitle) {
      store.dispatch(
        StoreActions.setActiveFieldState(datasheetId!, {
          fieldId,
          fieldIndex,
          operate: FieldOperateType.FieldSetting,
          fieldRectBottom: 0,
          fieldRectLeft: 0,
          clickLogOffsetX: 0,
        }),
      );
      return;
    }
    setActiveFieldId(fieldId);
  };

  const generateItemKey = () => {
    const columns = remainingColumns;
    return ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
      let recordId = rowIndex + '';
      let fieldId = columnIndex + '';
      if (columns[columnIndex] && columns[columnIndex].fieldId) {
        fieldId = columns[columnIndex].fieldId;
      }
      if (rows[rowIndex] && rows[rowIndex].recordId) {
        recordId = rows[rowIndex].recordId;
      }
      return `${recordId}-${fieldId}`;
    };
  };

  const headRef = useRef<List>(null);
  const titleRef = useRef<List>(null);
  const gridRef = useRef<Grid>(null);

  const gridOuterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const GRID_HEIGHT = height - (mirrorId ? 0 : MARGIN_BOTTOM);
  const GRID_INNER_DIV_HEIGHT = ROW_HEIGHT * rows.length;

  const gridStyle: React.CSSProperties = {
    position: 'absolute',
  };

  const syncScroll = useCallback((scrollLeft: number, scrollTop: number) => {
    gridRef.current?.scrollTo({
      scrollLeft,
      scrollTop,
    });
    headRef.current?.scrollTo(scrollLeft);
    titleRef.current?.scrollTo(scrollTop);
  }, []);

  const onHorizontalScroll = useCallback(
    ({ scrollLeft, scrollUpdateWasRequested }: GridOnScrollProps) => {
      if (scrollUpdateWasRequested || !contentRef.current || scrollLeft < 0) {
        return;
      }

      window.requestAnimationFrame(() => syncScroll(scrollLeft, contentRef.current!.scrollTop));
    },
    [syncScroll],
  );

  const onVerticalScroll = useCallback(
    (e: any) => {
      const target = e.currentTarget as HTMLDivElement;
      const scrollTop = target.scrollTop;
      if (
        scrollTop &&
        // Jitter processing when rowing vertically to the bottom
        scrollTop <= GRID_INNER_DIV_HEIGHT - GRID_HEIGHT
      ) {
        syncScroll(gridOuterRef.current?.scrollLeft || 0, scrollTop);
      }
    },
    [GRID_HEIGHT, GRID_INNER_DIV_HEIGHT, syncScroll],
  );

  const isIOS = browser?.is('iOS');

  const onAndroidScroll = useCallback(
    ({ scrollLeft, scrollTop, scrollUpdateWasRequested }: GridOnScrollProps) => {
      if (scrollUpdateWasRequested) {
        return;
      }
      syncScroll(scrollLeft, scrollTop);
    },
    [syncScroll],
  );

  const getColumnWidth = useCallback(
    (columnIndex?: number) => {
      if (remainingColumns.length * COLUMN_WIDTH < width) {
        return width / remainingColumns.length;
      }
      if (columnIndex === 0 || columnIndex === remainingColumns.length - 1) {
        return COLUMN_WIDTH + 16;
      }
      return COLUMN_WIDTH;
    },
    [width, remainingColumns.length],
  );

  const onGridClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const recordId = getElementDataset(getParentNodeByClass(target, [styles.cellWrapper, styles.firstColumnCell]), 'recordId')!;
    recordId && expandRecordIdNavigate(recordId);
  };

  const itemData = {
    firstColumn,
    remainingColumns,
    datasheetId,
    fieldMap,
    rows,
    containerWidth: width,
    manageable,
    searchKeyword,
    snapshot,
  };

  useEffect(() => {
    gridRef.current?.resetAfterColumnIndex(0, true);
    headRef.current?.resetAfterIndex(0, true);
  }, [width, remainingColumns.length, recordId]);

  useEffect(() => {
    if (window.scrollY) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
    syncScroll(0, 0);

    gridRef.current?.resetAfterRowIndex(0, true);
    headRef.current?.resetAfterIndex(0, true);
    gridRef.current?.resetAfterColumnIndex(0, true);
    titleRef.current?.resetAfterIndex(0, true);
  }, [syncScroll, viewId, searchKeyword]);

  // Hidden columns are clicked into the middle of the view and highlighted
  const activeCell = useAppSelector((state) => Selectors.getActiveCell(state));
  useEffect(() => {
    if (!activeCell) {
      return;
    }
    const activeSelectFieldId = activeCell?.fieldId;
    syncScroll(0, 0);
    contentRef.current?.scrollTo(0, 0);
    const fieldIndex = visibleColumns.findIndex((field) => field.fieldId === activeSelectFieldId);
    gridRef.current?.scrollToItem({
      align: 'center',
      columnIndex: fieldIndex - 1,
    });
    headRef.current?.scrollToItem(fieldIndex - 1, 'center');
  }, [activeCell, syncScroll, visibleColumns]);

  const dispatch = useDispatch();

  const click = (e: MouseEvent) => {
    if (!e.target) {
      return;
    }
    if (datasheetId) {
      dispatch(StoreActions.clearSelection(datasheetId));
    }
  };

  useEffect(() => {
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('click', click);
    };
  });

  const hasHiddenAll = remainingColumns.length === 0;

  const isOperateSetting = activeFieldOperateType === FieldOperateType.FieldSetting;

  return (
    <div className={styles.viewContainer} style={{ height }}>
      <div className={styles.fixedHead} onClick={onHeaderClick}>
        <List
          height={FIXED_TITLE_HEIGHT}
          width={width}
          itemData={itemData}
          itemCount={remainingColumns.length}
          itemSize={getColumnWidth}
          layout="horizontal"
          ref={headRef}
          style={{
            ...gridStyle,
            overflow: 'hidden',
          }}
        >
          {CellHead as any}
        </List>
      </div>
      {/* Vertical rolling containers */}
      <div
        className={styles.content}
        style={{ width, height: GRID_HEIGHT }}
        onClick={onGridClick}
        onScroll={isIOS ? onVerticalScroll : undefined}
        ref={contentRef}
      >
        <List
          className={styles.fixedTitle}
          height={GRID_HEIGHT}
          width={width}
          itemCount={rows.length}
          itemSize={() => ROW_HEIGHT}
          estimatedItemSize={ROW_HEIGHT}
          ref={titleRef}
          style={{
            ...gridStyle,
            left: 0,
            pointerEvents: hasHiddenAll ? 'initial' : 'none',
            height: isIOS ? GRID_INNER_DIV_HEIGHT : GRID_HEIGHT,
          }}
          overscanCount={0}
          itemData={itemData}
        >
          {CellTitle as any}
        </List>
        {!hasHiddenAll && (
          // Horizontal rolling containers
          <Grid
            className={classNames(styles.remainingColumnsGrid, GRID_CLASS)}
            columnCount={remainingColumns.length}
            columnWidth={getColumnWidth}
            overscanColumnCount={0}
            overscanRowCount={0}
            rowCount={rows.length}
            rowHeight={() => ROW_HEIGHT}
            itemKey={generateItemKey()}
            width={width}
            height={GRID_HEIGHT}
            ref={gridRef}
            outerRef={gridOuterRef}
            onScroll={isIOS ? onHorizontalScroll : onAndroidScroll}
            style={{
              ...gridStyle,
              height: isIOS ? GRID_INNER_DIV_HEIGHT : GRID_HEIGHT,
            }}
            itemData={itemData}
            estimatedRowHeight={ROW_HEIGHT}
          >
            {Cell as any}
          </Grid>
        )}
        {rowCreatable && ReactDOM.createPortal(<AddRecord size="large" />, document.getElementById(DATASHEET_ID.ADD_RECORD_BTN)!)}
      </div>

      {activeFieldId && <FieldMenu fieldId={activeFieldId!} onClose={() => setActiveFieldId(null)} />}

      {isOperateSetting && <FieldSetting datasheetId={datasheetId} viewId={viewId} />}
    </div>
  );
};
