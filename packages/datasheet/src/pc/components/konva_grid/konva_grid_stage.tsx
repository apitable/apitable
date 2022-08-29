import { KONVA_DATASHEET_ID, Selectors } from '@vikadata/core';
import { useMount } from 'ahooks';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import dynamic from 'next/dynamic';

import { AreaType, IScrollState, PointPosition, useViewExport } from 'pc/components/gantt_view';
import {
  DEFAULT_POINT_POSITION, GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH, GridCoordinate, KonvaGrid, KonvaGridContext, KonvaGridViewContext, useGridMouseEvent
} from 'pc/components/konva_grid';
import * as React from 'react';
import { FC, memo, useContext, useMemo, useRef } from 'react';

const Stage = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/stage'), { ssr: false });
Konva.pixelRatio = 2;

interface IKonvaGridStageProps {
  instance: GridCoordinate;
  scrollState: IScrollState;
  pointPosition: PointPosition;
  setPointPosition: React.Dispatch<React.SetStateAction<PointPosition>>;
  offsetX?: number;
  isExporting?: boolean;
  listening?: boolean;
}

export const getCellOffsetLeft = (depth) => {
  if (!depth) return 0;
  if (depth > 1) return (depth - 1) * GRID_GROUP_OFFSET;
  return 0;
};

export const isWithinFrozenColumnBoundary = (x: number, depth: number, frozenColumnWidth: number) => {
  const offset = getCellOffsetLeft(depth);
  const max = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
  const min = GRID_ROW_HEAD_WIDTH + offset;
  return x > min && x < max;
};

export const KonvaGridStage: FC<IKonvaGridStageProps> = memo((props) => {
  const {
    instance,
    pointPosition,
    setPointPosition,
    scrollState,
    offsetX = 0,
    isExporting = false,
    listening = true,
  } = props;
  const {
    view,
    datasheetId,
    linearRows,
    visibleColumns,
  } = useContext(KonvaGridViewContext);
  const { scrollTop, scrollLeft, isScrolling } = scrollState;
  const stageRef = useRef<any>(); // Konva Stage
  const wheelingRef = useRef<number | null>(null); // 存储定时器，保证操作流畅性
  const {
    rowCount, columnCount, frozenColumnCount,
    frozenColumnWidth, rowHeight, rowInitSize,
    containerWidth, containerHeight
  } = instance;
  const viewName = view.name;

  const scrollMaxWidth = useMemo(() => {
    return visibleColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), GRID_ROW_HEAD_WIDTH);
  }, [visibleColumns]);

  const scrollMaxHeight = useMemo(() => {
    return instance.getRowOffset(rowCount - 1) + 32;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, rowCount, rowInitSize, rowHeight]);

  // 获取要渲染的纵向可见区域
  const getVerticalRangeInfo = () => {
    const startIndex = instance.getRowStartIndex(scrollTop);
    const stopIndex = instance.getRowStopIndex(startIndex, scrollTop);

    return {
      rowStartIndex: Math.max(0, startIndex),
      rowStopIndex: Math.max(0, Math.min(rowCount - 1, stopIndex)),
    };
  };

  // 获取要渲染的横向可见区域
  const getHorizontalRangeInfo = () => {
    const startIndex = instance.getColumnStartIndex(scrollLeft);
    const stopIndex = instance.getColumnStopIndex(startIndex, scrollLeft);

    return {
      columnStartIndex: Math.max(frozenColumnCount - 1, startIndex),
      columnStopIndex: Math.max(frozenColumnCount - 1, Math.min(columnCount - 1, stopIndex)),
    };
  };

  const { rowStartIndex, rowStopIndex } = getVerticalRangeInfo();
  const { columnStartIndex, columnStopIndex } = getHorizontalRangeInfo();

  // 获取前缀 targetName
  const getTargetName = (targetName) => {
    if (targetName == null || targetName === '') return KONVA_DATASHEET_ID.GRID_BLANK;
    return targetName.split('-')[0];
  };

  const getMousePosition = (x: number, y: number, _targetName?: string) => {
    if (x < offsetX) {
      return DEFAULT_POINT_POSITION;
    }
    const offsetTop = scrollTop + y;
    const rowIndex = instance.getRowStartIndex(offsetTop);
    const depth = linearRows[rowIndex]?.depth;
    const realX = x - offsetX;
    const offsetLeft = isWithinFrozenColumnBoundary(realX, depth, frozenColumnWidth) ? realX : scrollLeft + realX;
    const columnIndex = instance.getColumnStartIndex(offsetLeft);
    const areaType = (offsetLeft <= scrollMaxWidth && offsetTop <= scrollMaxHeight) ? AreaType.Grid : AreaType.None;
    const realAreaType = areaType;
    const targetName = getTargetName(_targetName);
    return {
      areaType,
      realAreaType,
      targetName, // 作为简单操作的标识别，只带前缀名
      realTargetName: _targetName || KONVA_DATASHEET_ID.GRID_BLANK, // 真实的 name
      rowIndex,
      columnIndex,
      offsetTop,
      offsetLeft,
      x: realX,
      y,
    };
  };

  const {
    onTap,
    onClick,
    onMouseUp,
    onMouseDown,
    onMouseMove: onGridMouseMove,
    handleMouseStyle,
  } = useGridMouseEvent({
    instance,
    pointPosition,
    rowStartIndex,
    rowStopIndex,
    offsetX,
    getMousePosition,
    columnStartIndex,
    columnStopIndex,
    scrollTop,
  });

  /**
   * 处理画布鼠标移动事件
   */
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (wheelingRef.current) return;
    wheelingRef.current = window.requestAnimationFrame(() => {
      const targetName = e.target.name();
      const pos = stageRef.current?.getPointerPosition();
      if (pos == null) return;
      const { x, y } = pos;
      const curMousePosition = getMousePosition(x, y, targetName);
      // 处理鼠标样式
      handleMouseStyle(curMousePosition.realTargetName, curMousePosition.realAreaType);
      onGridMouseMove(e);
      setPointPosition(curMousePosition);
      wheelingRef.current = null;
    });
  };

  const setImmediatePointPosition = (e) => {
    const targetName = e.target.name();
    const pos = stageRef.current?.getPointerPosition();
    if (pos == null) return;
    const { x, y } = pos;
    const curMousePosition = getMousePosition(x, y, targetName);
    setPointPosition(curMousePosition);
  };

  useMount(() => {
    if (stageRef.current?.content) {
      stageRef.current.content.className = 'grid-stage';
    }
  });

  useViewExport({
    stageRef,
    isExporting,
    containerWidth,
    containerHeight,
    viewName,
    datasheetId
  });

  return (
    <KonvaGridViewContext.Consumer>
      {wrapperValue => (
        <KonvaGridContext.Consumer>
          {innerValue => (
            <Stage
              _ref={stageRef}
              width={containerWidth}
              height={containerHeight}
              onMouseDown={(e) => {
                setImmediatePointPosition(e);
                onMouseDown(e);
              }}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onClick={onClick}
              onTap={onTap}
              onTouchStart={setImmediatePointPosition}
              draggable={false}
              listening={listening || !isScrolling}
            >
              <KonvaGridViewContext.Provider value={wrapperValue}>
                <KonvaGridContext.Provider value={innerValue}>
                  <KonvaGrid
                    instance={instance}
                    scrollState={scrollState}
                    rowStartIndex={rowStartIndex}
                    rowStopIndex={rowStopIndex}
                    columnStartIndex={columnStartIndex}
                    columnStopIndex={columnStopIndex}
                    pointPosition={pointPosition}
                    offsetX={offsetX}
                    isExporting={isExporting}
                  />
                </KonvaGridContext.Provider>
              </KonvaGridViewContext.Provider>
            </Stage>
          )}
        </KonvaGridContext.Consumer>
      )}
    </KonvaGridViewContext.Consumer>
  );
});
