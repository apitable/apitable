import { isEqual } from 'lodash';
import { shallowEqual, useSelector } from 'react-redux';
import { useCreation, useUpdate } from 'ahooks';
import { useSetState } from 'pc/hooks';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CellType, ConfigConstant, Field, ICell, IGridViewProperty, KONVA_DATASHEET_ID, RowHeightLevel, Selectors } from '@vikadata/core';
import { useAllowDownloadAttachment } from 'pc/components/upload_modal/preview_item';
import { useDispatch } from 'pc/hooks';
import { useCacheScroll } from 'pc/context';
import { IContainerEdit } from '../editors/interface';
import { getDetailByTargetName, getLinearRowHeight } from 'pc/components/gantt_view';
import {
  AreaType,
  CellBound,
  IScrollHandler,
  IScrollOptions,
  IScrollState,
  ICellScrollState,
  PointPosition,
  TimeoutID,
} from 'pc/components/gantt_view/interface';
import { cancelTimeout, requestTimeout } from 'pc/components/gantt_view/utils';
import styles from './style.module.less';
import {
  GridCoordinate,
  KonvaGridStage,
  KonvaGridContext,
  KonvaGridViewContext,
  DomGrid,
  useAttachmentEvent,
  useScrollbarTip,
  useGridMessage,
  ITooltipInfo,
  useWxTitleMap,
  IndicesMap,
  GRID_CELL_VALUE_PADDING,
  GRID_ICON_COMMON_SIZE,
  GRID_SCROLL_REMAIN_SPACING,
  useGridScroller,
  GRID_BOTTOM_STAT_HEIGHT,
  GRID_FIELD_HEAD_HEIGHT,
  GRID_SCROLL_BAR_OFFSET_X,
  GRID_ROW_HEAD_WIDTH,
  FIELD_HEAD_ICON_SIZE_MAP,
  GridExport,
  FieldHeadIconType,
  FIELD_HEAD_ICON_GAP_SIZE
} from 'pc/components/konva_grid';
import { useTheme } from '@vikadata/components';
import { autoSizerCanvas } from '../konva_components';
import { getFieldLock } from '../field_permission';

interface IGridViewProps {
  height: number;
  width: number;
}

const DEFAULT_COORD = {
  x: 0,
  y: 0,
};

export const DEFAULT_TOOLTIP_PROPS: ITooltipInfo = {
  title: '',
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  rowIndex: -1,
  columnIndex: -1,
  visible: false,
  placement: 'top',
  coordXEnable: true,
  coordYEnable: true,
};

export const DEFAULT_POINT_POSITION = {
  areaType: AreaType.None,
  realAreaType: AreaType.None,
  targetName: KONVA_DATASHEET_ID.GRID_BLANK,
  realTargetName: KONVA_DATASHEET_ID.GRID_BLANK,
  rowIndex: -1,
  columnIndex: -1,
  x: 0,
  y: 0,
  offsetTop: 0,
  offsetLeft: 0,
};

export const KonvaGridView: FC<IGridViewProps> = memo(props => {
  const { width: _containerWidth, height: containerHeight } = props;
  const {
    datasheetId,
    mirrorId,
    visibleColumns,
    fieldMap,
    linearRows,
    permissions,
    rowHeightLevel,
    rowHeight,
    activeCell,
    selection,
    recordMap,
    visibleRows,
    recordRanges,
    rowsIndexMap,
    fieldIndexMap,
    visibleRowsIndexMap,
    selectRanges,
    fillHandleStatus,
    gridViewDragState,
    groupInfo,
    sortInfo,
    view,
    isSearching,
    groupCollapseIds,
    snapshot,
    currentSearchCell,
    fieldPermissionMap,
    selectRecordIds,
    recordMoveType,
    isEditing,
    allowShowCommentPane,
    fieldRanges,
    filterInfo,
    visibleRecordIds,
    collaboratorCursorMap,
    groupBreakpoint,
    viewId,
    isManualSaveView,
    exportViewId,
  } = useSelector(state => {
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const view = Selectors.getCurrentView(state)! as IGridViewProperty;
    const rowHeightLevel = view.rowHeightLevel || RowHeightLevel.Short;
    return {
      datasheetId,
      mirrorId: state.pageParams.mirrorId,
      viewId: state.pageParams.viewId,
      visibleColumns: Selectors.getVisibleColumns(state),
      fieldMap: Selectors.getFieldMap(state)!,
      fieldIndexMap: Selectors.getVisibleColumnsMap(state)!,
      linearRows: Selectors.getLinearRows(state),
      permissions: Selectors.getPermissions(state),
      rowHeightLevel,
      rowHeight: Selectors.getRowHeightFromLevel(rowHeightLevel),
      activeCell: Selectors.getActiveCell(state),
      selection: Selectors.getSelection(state),
      visibleRows: Selectors.getVisibleRows(state),
      recordRanges: Selectors.getSelectionRecordRanges(state),
      rowsIndexMap: Selectors.getLinearRowsIndexMap(state),
      visibleRowsIndexMap: Selectors.getPureVisibleRowsIndexMap(state),
      selectRanges: Selectors.getSelectRanges(state),
      fillHandleStatus: Selectors.getFillHandleStatus(state),
      gridViewDragState: Selectors.getGridViewDragState(state),
      groupInfo: Selectors.getActiveViewGroupInfo(state),
      recordMap: Selectors.getSnapshot(state)!.recordMap,
      sortInfo: Selectors.getActiveViewSortInfo(state),
      view: Selectors.getCurrentView(state)!,
      isSearching: Boolean(Selectors.getSearchKeyword(state)),
      groupCollapseIds: Selectors.getGroupingCollapseIds(state),
      snapshot: Selectors.getSnapshot(state)!,
      currentSearchCell: Selectors.getCurrentSearchItem(state),
      fieldPermissionMap: Selectors.getFieldPermissionMap(state),
      selectRecordIds: Selectors.getSelectRecordIds(state),
      recordMoveType: Selectors.getRecordMoveType(state),
      isEditing: Boolean(Selectors.getEditingCell(state)),
      allowShowCommentPane: Selectors.allowShowCommentPane(state),
      fieldRanges: Selectors.getFieldRanges(state),
      filterInfo: Selectors.getFilterInfo(state),
      visibleRecordIds: Selectors.getVisibleRowIds(state),
      collaboratorCursorMap: Selectors.collaboratorCursorSelector(state),
      groupBreakpoint: Selectors.getGroupBreakpoint(state),
      isManualSaveView: state.labs.includes('view_manual_save') || Boolean(state.share.featureViewManualSave),
      exportViewId: Selectors.getDatasheetClient(state)?.exportViewId,
    };
  }, shallowEqual);
  const offsetX = 32;
  const containerWidth = _containerWidth + offsetX;
  const rowCount = linearRows.length; // 总行数
  // 调试bug所需，下一期上线前删掉
  (window as any).__linearRows__ = linearRows;
  const dispatch = useDispatch();
  const { autoHeadHeight = false } = view as IGridViewProperty;

  // Refs
  const containerRef = useRef<any>();
  const domGridRef = useRef<IContainerEdit | null>(null); // Grid Dom
  const horizontalBarRef = useRef<any>(); // 横向滚动条
  const verticalBarRef = useRef<any>(); // 纵向滚动条
  const cellVerticalBarRef = useRef<any>(); // 单元格纵向滚动条
  const resetScrollingTimeoutID = useRef<TimeoutID | null>(null); // 滚动定时器，当滚动时，禁止 stage 的事件监听

  // 计算列权限
  const fieldId = activeCell ? activeCell.fieldId : '';
  const disabledDownload = !useAllowDownloadAttachment(fieldId);
  // Hooks
  const forceRender = useUpdate();
  // 用来同步原生滚动的滚动状态
  const { scrollLeft: cacheScrollLeft, scrollTop: cacheScrollTop, changeCacheScroll } = useCacheScroll();
  const [scrollState, setScrollState] = useState<IScrollState>({
    scrollTop: cacheScrollTop,
    scrollLeft: cacheScrollLeft,
    isScrolling: false,
  });
  const [cellScrollState, setCellScrollState] = useSetState<ICellScrollState>({
    scrollTop: 0,
    totalHeight: 0,
    isOverflow: false,
  });
  const { scrollTop, scrollLeft, isScrolling } = scrollState;
  const { isOverflow } = cellScrollState;

  // 设置新增一行的行为状态
  const [canAppendRow, setCanAppendRow] = useState(true);
  const textSizer = useRef(autoSizerCanvas);

  // 落点
  const [pointPosition, setPointPosition] = useState<PointPosition>(DEFAULT_POINT_POSITION);
  const [tooltipInfo, setTooltipInfo] = useSetState<ITooltipInfo>(DEFAULT_TOOLTIP_PROPS);
  const [isCellDown, setCellDown] = useState<boolean>(false);
  const [activeCellBound, setActiveCellBound] = useSetState<CellBound>({
    width: 0,
    height: 0,
  });

  const { realTargetName } = pointPosition;

  const rowIndicesMap = useMemo(() => {
    const rowIndicesMap: IndicesMap = {};
    linearRows.forEach((row, index) => {
      if (row.type !== CellType.Record) {
        rowIndicesMap[index] = getLinearRowHeight(row.type, rowHeight);
      }
    });
    return rowIndicesMap;
  }, [linearRows, rowHeight]);

  const columnIndicesMap = useMemo(() => {
    const columnIndicesMap: IndicesMap = {};
    visibleColumns.forEach((column, index) => {
      columnIndicesMap[index] = Selectors.getColumnWidth(column);
    });
    return columnIndicesMap;
  }, [visibleColumns]);

  // 列头高度
  const fieldHeadHeight = useMemo(() => {
    if (!autoHeadHeight) return GRID_FIELD_HEAD_HEIGHT;
    textSizer.current.setFont({ fontWeight: 'bold', fontSize: 13 });
    const fieldHeight = visibleColumns.reduce((prev, cur, index) => {
      const { fieldId } = cur;
      const field = fieldMap[fieldId];
      const { name, desc } = field;
      const columnWidth = columnIndicesMap[index];
      const textWidth = columnWidth - 2 * (GRID_CELL_VALUE_PADDING + GRID_ICON_COMMON_SIZE + FIELD_HEAD_ICON_GAP_SIZE);
      const { lastLineWidth, height } = textSizer.current.measureText(name, textWidth);
      let realLastLineWidth = lastLineWidth;

      if (desc) {
        realLastLineWidth += (FIELD_HEAD_ICON_SIZE_MAP[FieldHeadIconType.Description] + FIELD_HEAD_ICON_GAP_SIZE);
      }

      if (Field.bindModel(field).isComputed && Field.bindModel(field).hasError) {
        realLastLineWidth += (FIELD_HEAD_ICON_SIZE_MAP[FieldHeadIconType.Error] + FIELD_HEAD_ICON_GAP_SIZE);
      }

      const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
      if (
        fieldPermissionMap && fieldRole && 
        getFieldLock(fieldPermissionMap[fieldId].manageable ? ConfigConstant.Role.Manager : fieldRole)
      ) {
        realLastLineWidth += (FIELD_HEAD_ICON_SIZE_MAP[FieldHeadIconType.Permission] + FIELD_HEAD_ICON_GAP_SIZE);
      }

      const finalHeight = realLastLineWidth > textWidth ? height + 32 : height + 8;
      return finalHeight > prev ? finalHeight : prev;
    }, GRID_FIELD_HEAD_HEIGHT);
    return fieldHeight;
  }, [autoHeadHeight, columnIndicesMap, fieldMap, fieldPermissionMap, visibleColumns]);

  const firstColumnWidth = columnIndicesMap[0];
  const originFrozenColumnCount = (view as IGridViewProperty).frozenColumnCount;
  // 根据当前容器宽度自适应后的冻结列数
  const frozenColumnCount = useMemo(() => {
    let count = view.columns.slice(0, originFrozenColumnCount).filter(column => !column.hidden).length;
    let curWidth = GRID_ROW_HEAD_WIDTH + offsetX;

    for (let i = 0; i < count; i++) {
      const curColumn = visibleColumns[i];
      curWidth += Selectors.getColumnWidth(curColumn);

      if (curWidth >= containerWidth) {
        count = i;
        break;
      }
    }
    return Math.max(count, 1);
  }, [originFrozenColumnCount, containerWidth, view.columns, visibleColumns]);

  /**
   * 当前 grid 的数据实例
   * 提供与时间轴和坐标相关的方法
   */
  const instance = useCreation<GridCoordinate>(
    () =>
      new GridCoordinate({
        rowHeight,
        columnWidth: 0,
        rowHeightLevel,
        autoHeadHeight,
        rowCount,
        columnCount: visibleColumns.length,
        containerWidth,
        containerHeight,
        rowInitSize: autoHeadHeight ? fieldHeadHeight : GRID_FIELD_HEAD_HEIGHT,
        columnInitSize: GRID_ROW_HEAD_WIDTH,
        rowIndicesMap,
        columnIndicesMap,
        frozenColumnCount,
      }),
    [],
  );

  // 数表总宽度
  const totalWidth = instance.totalWidth + GRID_SCROLL_REMAIN_SPACING;
  // 数表总高度
  const totalHeight = Math.max(instance.totalHeight + GRID_SCROLL_REMAIN_SPACING, containerHeight - fieldHeadHeight - GRID_BOTTOM_STAT_HEIGHT);

  const isCellScrolling = useMemo(() => {
    if (activeCell == null) {
      return false;
    }
    const { recordId, fieldId } = getDetailByTargetName(realTargetName);
    return isOverflow && isEqual(activeCell, { recordId, fieldId });
  }, [activeCell, isOverflow, realTargetName]);

  const { scrollTo } = useGridScroller({
    containerRef,
    gridHorizontalBarRef: horizontalBarRef,
    verticalBarRef,
    gridWidth: containerWidth,
    containerHeight,
    gridTotalWidth: totalWidth,
    totalHeight,
    isCellScrolling,
    cellVerticalBarRef,
    pointAreaType: AreaType.Grid,
  });

  useGridMessage({
    containerWidth: _containerWidth,
    firstColumnWidth,
  });

  const { onMouseEnter, clearTooltip: clearScrollbarTooltip, tooltip: scrollbarTooltip } = useScrollbarTip({
    horizontalBarRef,
    containerWidth,
    totalWidth,
  });

  const clearTooltipInfo = useCallback(() => setTooltipInfo(DEFAULT_TOOLTIP_PROPS), [setTooltipInfo]);

  const gridBound = useMemo(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    return rect ? { x: rect.left, y: rect.top } : DEFAULT_COORD;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current, containerWidth, containerHeight]);

  const { onDrop, onDragOver, draggingOutlineInfo, setDraggingOutlineInfo } = useAttachmentEvent({
    instance,
    gridBound,
    scrollTop,
    scrollLeft,
    offsetX,
  });

  const handleHorizontalScroll = e => {
    const { scrollLeft } = e.target;
    setScrollState(prev => ({
      ...prev,
      isScrolling: true,
      scrollLeft,
    }));
    changeCacheScroll({ scrollLeft });
    clearScrollbarTooltip();
    resetScrollingDebounced();
  };

  const handleVerticalScroll = e => {
    const { scrollTop } = e.target;
    setScrollState(prev => ({
      ...prev,
      isScrolling: true,
      scrollTop,
    }));
    changeCacheScroll({ scrollTop });
    resetScrollingDebounced();
  };

  const resetScrolling = useCallback(() => {
    setScrollState(prev => {
      return {
        ...prev,
        isScrolling: false,
      };
    });
    resetScrollingTimeoutID.current = null;
  }, []);

  const resetScrollingDebounced = useCallback(() => {
    if (resetScrollingTimeoutID.current !== null) {
      cancelTimeout(resetScrollingTimeoutID.current);
    }
    resetScrollingTimeoutID.current = requestTimeout(resetScrolling, 100);
  }, [resetScrolling]);

  // 设置鼠标样式
  const setMouseStyle = useCallback((mouseStyle: string) => (containerRef.current.style.cursor = mouseStyle), []);

  useEffect(() => {
    const next = { scrollLeft, scrollTop, isScrolling: false };
    let needUpdate = false;
    if (cacheScrollTop) {
      needUpdate = true;
      next.scrollTop = cacheScrollTop;
    }
    if (cacheScrollLeft) {
      needUpdate = true;
      next.scrollLeft = cacheScrollLeft;
    }
    if (needUpdate) {
      scrollTo(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewId]);

  // 滚动到某个单元格
  const scrollToItem = useCallback(
    ({ rowIndex, columnIndex }: { rowIndex?: number; columnIndex?: number }) => {
      let _scrollTop;
      let _scrollLeft;
      if (rowIndex != null) {
        const offset = instance.getRowOffset(rowIndex);
        if (offset - fieldHeadHeight < scrollTop) {
          _scrollTop = offset - fieldHeadHeight;
        }
        if (offset + rowHeight > scrollTop + containerHeight - GRID_BOTTOM_STAT_HEIGHT) {
          _scrollTop = offset - containerHeight + rowHeight + GRID_BOTTOM_STAT_HEIGHT;
        }
      }
      if (columnIndex != null && columnIndex !== 0) {
        if (columnIndex < frozenColumnCount) return;
        const offset = instance.getColumnOffset(columnIndex);
        const frozenAreaWidth = instance.frozenColumnWidth + GRID_ROW_HEAD_WIDTH;
        if (offset < scrollLeft + frozenAreaWidth) {
          _scrollLeft = offset - frozenAreaWidth;
        }
        const columnWidth = columnIndicesMap[columnIndex];
        if (offset + columnWidth + offsetX > scrollLeft + containerWidth) {
          _scrollLeft = offset - containerWidth + columnWidth + offsetX;
        }
      }
      scrollTo({
        scrollTop: _scrollTop,
        scrollLeft: _scrollLeft,
      });
    },
    [scrollTo, instance, scrollTop, rowHeight, containerHeight, scrollLeft, columnIndicesMap, containerWidth, frozenColumnCount, fieldHeadHeight],
  );

  const scrollHandler: IScrollHandler = useCreation(() => {
    let isStop = false;
    let _scrollOptions: IScrollOptions = {};
    // 记录 X/Y 轴滚动的总距离
    let totalScrollX = 0;
    let totalScrollY = 0;

    const scrollByValue = () => {
      if (isStop) {
        return;
      }
      const { rowSpeed, columnSpeed, scrollCb } = _scrollOptions;
      const options: { scrollLeft?: number; scrollTop?: number } = {};
      if (rowSpeed != null) {
        const currentScrollTop = Math.max(verticalBarRef.current.scrollTop + rowSpeed, 0);
        options.scrollTop = currentScrollTop;
        totalScrollY += Math.abs(rowSpeed);
      }
      if (columnSpeed != null) {
        const currentScrollLeft = Math.max(horizontalBarRef.current.scrollLeft + columnSpeed, 0);
        options.scrollLeft = currentScrollLeft;
        totalScrollX += Math.abs(columnSpeed);
      }
      const maxScrollSize = horizontalBarRef.current.scrollWidth;
      scrollTo(options);
      scrollCb?.({ ...options, totalScrollX, totalScrollY, maxScrollSize });
      window.requestAnimationFrame(scrollByValue);
    };

    const stopScroll = (isClearAll = true) => {
      if (isClearAll) {
        totalScrollX = 0;
        totalScrollY = 0;
      }
      isStop = true;
    };

    return {
      scrollByValue: (scrollOptions: IScrollOptions) => {
        isStop = false;
        _scrollOptions = scrollOptions;
        scrollByValue();
      },
      stopScroll,
    };
  }, []);

  const onEditorPosition = useCallback((activeCell?: ICell) => domGridRef.current?.onViewMouseDown(activeCell), []);

  const resetCellScroll = useCallback(() => {
    if (cellVerticalBarRef.current) {
      cellVerticalBarRef.current.scrollTop = 0;
    }
  }, []);

  // 布局切换
  useMemo(() => {
    instance.autoHeadHeight = autoHeadHeight;
    instance.rowInitSize = autoHeadHeight ? fieldHeadHeight : GRID_FIELD_HEAD_HEIGHT;
    instance.rowHeight = rowHeight;
    instance.rowHeightLevel = rowHeightLevel;
    instance.rowMetaDataMap = {};
    instance.lastRowIndex = -1;
    instance.rowCount = linearRows.length;
    instance.rowIndicesMap = rowIndicesMap;
    forceRender();
  }, [forceRender, instance, linearRows.length, rowHeight, rowHeightLevel, fieldHeadHeight, rowIndicesMap, autoHeadHeight]);

  // 显示/隐藏列
  useMemo(() => {
    instance.lastColumnIndex = -1;
    instance.columnCount = visibleColumns.length;
    instance.frozenColumnCount = frozenColumnCount;
    instance.columnIndicesMap = columnIndicesMap;
    forceRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, visibleColumns.length, JSON.stringify(columnIndicesMap), forceRender, frozenColumnCount]);

  // resize
  useEffect(() => {
    instance.containerWidth = containerWidth;
    instance.containerHeight = containerHeight;
    if (containerWidth >= totalWidth + GRID_SCROLL_BAR_OFFSET_X) {
      return setScrollState(prev => ({ ...prev, scrollLeft: 0 }));
    }
    forceRender();
  }, [instance, containerWidth, containerHeight, forceRender, totalWidth]);

  useEffect(() => {
    if (isScrolling) {
      clearTooltipInfo();
    }
  }, [clearTooltipInfo, isScrolling]);

  const { unitTitleMap } = useWxTitleMap();
  const theme = useTheme();
  const cacheTheme = useSelector(Selectors.getTheme);

  const konvaGridContext = {
    theme,
    tooltipInfo,
    setTooltipInfo,
    clearTooltipInfo,
    activeCellBound,
    setActiveCellBound,
    scrollTo,
    scrollToItem,
    onEditorPosition,
    setMouseStyle,
    isCellDown,
    setCellDown,
    draggingOutlineInfo,
    setDraggingOutlineInfo,
    cellScrollState,
    setCellScrollState,
    resetCellScroll,
    scrollHandler,
    canAppendRow,
    onSetCanAppendRow: setCanAppendRow,
  };

  const gridViewContext = {
    datasheetId,
    mirrorId,
    visibleColumns,
    fieldMap,
    linearRows,
    activeCell,
    recordMap,
    visibleRows,
    recordRanges,
    rowsIndexMap,
    visibleRowsIndexMap,
    selectRanges,
    fillHandleStatus,
    gridViewDragState,
    groupInfo,
    sortInfo,
    view,
    permissions,
    unitTitleMap,
    cacheTheme,
    isSearching,
    groupCollapseIds,
    snapshot,
    fieldIndexMap,
    currentSearchCell,
    selection,
    fieldPermissionMap,
    selectRecordIds,
    recordMoveType,
    isEditing,
    allowShowCommentPane,
    fieldRanges,
    filterInfo,
    visibleRecordIds,
    collaboratorCursorMap,
    groupBreakpoint,
    dispatch,
    disabledDownload,
    isManualSaveView,
  };

  return (
    <KonvaGridContext.Provider value={konvaGridContext}>
      <div
        className={styles.gridViewContainer}
        onMouseLeave={() => {
          setPointPosition(DEFAULT_POINT_POSITION);
          clearTooltipInfo();
        }}
      >
        <div
          className={'vikaGridView'}
          ref={containerRef}
          style={{
            width: containerWidth,
            height: containerHeight,
            marginLeft: -offsetX,
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <KonvaGridViewContext.Provider value={gridViewContext}>
            <KonvaGridStage
              instance={instance}
              scrollState={scrollState}
              pointPosition={pointPosition}
              setPointPosition={setPointPosition}
              offsetX={offsetX}
            />
            {exportViewId != null && exportViewId === view.id && (
              <GridExport fieldHeadHeight={autoHeadHeight ? fieldHeadHeight : GRID_FIELD_HEAD_HEIGHT} />
            )}
          </KonvaGridViewContext.Provider>
        </div>

        {/* 横向滚动条 */}
        <div
          ref={horizontalBarRef}
          className={styles.horizontalScrollBarWrapper}
          style={{
            width: containerWidth - GRID_SCROLL_BAR_OFFSET_X,
            left: 0,
          }}
          onScroll={handleHorizontalScroll}
          onMouseEnter={onMouseEnter}
          onMouseLeave={() => clearScrollbarTooltip()}
        >
          <div
            className={styles.horizontalScrollBarInner}
            style={{
              width: totalWidth,
              height: 1,
            }}
          />
          {scrollbarTooltip}
        </div>

        {/* 纵向滚动条 */}
        <div
          ref={verticalBarRef}
          className={styles.verticalScrollBarWrapper}
          style={{
            height: containerHeight - fieldHeadHeight,
            top: fieldHeadHeight,
          }}
          onScroll={handleVerticalScroll}
        >
          <div
            className={styles.verticalScrollBarInner}
            style={{
              width: 1,
              height: totalHeight,
            }}
          />
        </div>

        {/* 数表 DOM 坐标系 */}
        <DomGrid
          ref={domGridRef}
          instance={instance}
          datasheetId={datasheetId}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          scrollState={scrollState}
          pointPosition={pointPosition}
          wrapperRef={containerRef}
          cellVerticalBarRef={cellVerticalBarRef}
          offsetX={offsetX}
        />
      </div>
    </KonvaGridContext.Provider>
  );
});
