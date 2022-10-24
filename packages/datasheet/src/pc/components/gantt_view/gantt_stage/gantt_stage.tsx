import { KONVA_DATASHEET_ID } from '@apitable/core';
import { useMount } from 'ahooks';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import dynamic from 'next/dynamic';
import {
  AreaType, GanttCoordinate, IScrollState, KonvaGanttViewContext, PointPosition, ScrollViewType, useGanttMouseEvent,
} from 'pc/components/gantt_view';
import { GridCoordinate, isWithinFrozenColumnBoundary, KonvaGridContext, KonvaGridViewContext, useGridMouseEvent } from 'pc/components/konva_grid';
import * as React from 'react';
import { FC, memo, useContext, useRef } from 'react';

import Gantt from '../gantt/gantt';
import { useViewExport } from '../hooks';

const Stage = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/stage'), { ssr: false });
Konva.pixelRatio = 2;

interface IGanttStageProps {
  ganttInstance: GanttCoordinate;
  gridInstance: GridCoordinate;
  gridScrollState: IScrollState;
  ganttScrollState: IScrollState;
  pointPosition: PointPosition;
  setPointPosition: React.Dispatch<React.SetStateAction<PointPosition>>;
  scrollIntoView: (type: ScrollViewType) => void;
  isExporting?: boolean;
  listening?: boolean;
}

const GanttStage: FC<IGanttStageProps> = memo((props) => {
  const {
    gridInstance,
    ganttInstance,
    pointPosition,
    setPointPosition,
    gridScrollState,
    ganttScrollState,
    scrollIntoView,
    isExporting = false,
    listening = true,
  } = props;

  const {
    isMobile,
    isTouchDevice,
    setMouseStyle,
  } = useContext(KonvaGridContext);
  const { view, linearRows, datasheetId } = useContext(KonvaGridViewContext);
  const { isLocking } = useContext(KonvaGanttViewContext);

  const stageRef = useRef<any>(); // Konva Stage
  const wheelingRef = useRef<number | null>(null); // 存储定时器，保证操作流畅性
  const { scrollLeft: gridScrollLeft } = gridScrollState;
  const { scrollTop, scrollLeft: ganttScrollLeft } = ganttScrollState;
  const { containerWidth: gridWidth, columnCount: gridColumnCount, rowCount, frozenColumnWidth } = gridInstance;
  const { containerWidth: ganttWidth, containerHeight, rowHeight } = ganttInstance;
  const gridVisible = gridWidth > 0;
  const containerWidth = gridWidth + ganttWidth;
  const viewName = view.name;

  // 获取要渲染的纵向可见区域
  const getVerticalRangeInfo = () => {
    const startIndex = ganttInstance.getRowStartIndex(scrollTop);
    const stopIndex = ganttInstance.getRowStopIndex(startIndex, scrollTop);

    // rowStartIndex 是可视区域的第一个，但会在视觉上留下空白，因此需要往前多渲染一个
    return {
      rowStartIndex: Math.max(0, startIndex - 1),
      rowStopIndex: Math.max(0, Math.min(rowCount - 1, stopIndex + 1)),
    };
  };

  // 获取「图形区」要渲染的横向可见区域
  const getHorizontalRangeInfo = () => {
    const startIndex = ganttInstance.getColumnStartIndex(ganttScrollLeft);
    const stopIndex = ganttInstance.getColumnStopIndex(ganttScrollLeft);

    return {
      columnStartIndex: startIndex - 1,
      columnStopIndex: stopIndex + 1,
    };
  };

  // 获取「任务区」要渲染的横向可见区域
  const getGridHorizontalRangeInfo = () => {
    const startIndex = gridInstance.getColumnStartIndex(gridScrollLeft);
    const stopIndex = gridInstance.getColumnStopIndex(startIndex, gridScrollLeft);

    return {
      columnStartIndex: Math.max(0, startIndex),
      columnStopIndex: Math.max(0, Math.min(gridColumnCount - 1, stopIndex)),
    };
  };

  const { rowStartIndex, rowStopIndex } = getVerticalRangeInfo();
  const { columnStartIndex, columnStopIndex } = getHorizontalRangeInfo();
  const { columnStartIndex: gridColumnStartIndex, columnStopIndex: gridColumnStopIndex } = getGridHorizontalRangeInfo();

  // 获取前缀 targetName
  const getTargetName = (targetName) => {
    if (targetName == null || targetName === '') {
      return KONVA_DATASHEET_ID.GANTT_BLANK;
    }
    if (
      targetName.includes('middle-left') ||
      targetName.includes('middle-right') ||
      targetName.includes(KONVA_DATASHEET_ID.GANTT_TASK)
    ) {
      return KONVA_DATASHEET_ID.GANTT_TASK;
    }
    return targetName.split('-')[0];
  };

  const getAreaType = (x: number, rowIndex: number) => {
    if (isMobile) {
      return AreaType.Gantt;
    }
    if (rowIndex !== -1) {
      if (x > gridWidth + 3) {
        return AreaType.Gantt;
      }
      if (gridWidth - 3 <= x && x <= gridWidth + 3) {
        return AreaType.Splitter;
      }
      if (x < gridWidth - 3) {
        return AreaType.Grid;
      }
    }
    return AreaType.None;
  };

  const getRealAreaType = (x: number, rowIndex: number, offsetTop: number) => {
    if (isMobile) {
      return AreaType.Gantt;
    }
    const lastRowOffsetTop = ganttInstance.getRowOffset(rowCount - 1) + rowHeight;
    const isOutBounds = offsetTop > lastRowOffsetTop;
    if (rowIndex !== -1 && !isOutBounds) {
      if (x > gridWidth + 2) {
        return AreaType.Gantt;
      }
      if (gridWidth <= x - 2 && x <= gridWidth + 2) {
        return AreaType.Splitter;
      }
      if (x < gridWidth - 2) {
        return AreaType.Grid;
      }
    }
    return AreaType.None;
  };

  const getMousePosition = (x: number, y: number, _targetName?: string) => {
    const offsetTop = y + scrollTop;
    const offsetLeft = gridVisible ? ganttScrollLeft + x - gridWidth : ganttScrollLeft + x;
    const rowIndex = ganttInstance.getRowStartIndex(offsetTop);
    let columnIndex = 0;
    if (gridVisible && x <= gridWidth) {
      const realX = x;
      const depth = linearRows[rowIndex]?.depth;
      const offsetLeft = isWithinFrozenColumnBoundary(realX, depth, frozenColumnWidth) ? realX : gridScrollLeft + realX;
      columnIndex = gridInstance.getColumnStartIndex(offsetLeft);
    } else {
      columnIndex = ganttInstance.getColumnStartIndex(offsetLeft);
    }
    const areaType = getAreaType(x, rowIndex);
    const realAreaType = getRealAreaType(x, rowIndex, offsetTop);
    const targetName = getTargetName(_targetName);

    return {
      areaType,
      realAreaType,
      targetName, // 作为简单操作的标识别，只带前缀名
      realTargetName: _targetName || KONVA_DATASHEET_ID.GANTT_BLANK, // 真实的 name
      rowIndex,
      columnIndex,
      offsetTop,
      offsetLeft,
      x,
      y,
    };
  };

  const {
    onClick: onGanttClick,
    onMouseUp: onGanttMouseUp,
    onMouseDown: onGanttMouseDown,
    onMouseMove: onGanttMouseMove,
    onDragStart: onGanttDragStart,
    onDragEnd: onGanttDragEnd,
    handleMouseStyle: handleGanttMouseStyle,
  } = useGanttMouseEvent({
    gridInstance,
    ganttInstance,
    pointPosition,
    scrollIntoView,
    getMousePosition,
  });

  const {
    onMouseDown: onGridMouseDown,
    onMouseMove: onGridMouseMove,
    onMouseUp: onGridMouseUp,
    onClick: onGridClick,
    handleMouseStyle: handleGridMouseStyle,
  } = useGridMouseEvent({
    instance: gridInstance,
    pointPosition,
    rowStartIndex,
    rowStopIndex,
    getMousePosition,
  });

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    onGanttMouseDown(e);
    onGridMouseDown(e);
  };

  /**
   * 处理画布鼠标移动事件
   */
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (wheelingRef.current || isLocking) {
      return;
    }

    wheelingRef.current = window.requestAnimationFrame(() => {
      const eventTargetName = e.target.name();

      const pos = stageRef.current?.getPointerPosition();
      if (pos == null) {
        return;
      }
      const { x, y } = pos;
      const curMousePosition = getMousePosition(x, y, eventTargetName);
      const { realAreaType, areaType, targetName } = curMousePosition;
     
      // 处理鼠标样式
      if (realAreaType === AreaType.Grid) {
        handleGridMouseStyle(targetName);
      }
      if (realAreaType === AreaType.Gantt) {
        handleGanttMouseStyle(targetName);
      }
      if (areaType === AreaType.Splitter) {
        setMouseStyle('col-resize');
      }
      onGanttMouseMove(e);
      onGridMouseMove(e);
      setPointPosition(curMousePosition);
      wheelingRef.current = null;
    });
  };

  const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    onGridMouseUp(e);
    onGanttMouseUp(e);
  };

  const onClick = (e: any) => {
    onGridClick(e);
    onGanttClick(e);
  };

  const setImmediatePointPosition = (e) => {
    const targetName = e.target.name();
    const pos = stageRef.current?.getPointerPosition();
    if (pos == null) {
      return;
    }
    const { x, y } = pos;
    const curMousePosition = getMousePosition(x, y, targetName);
    setPointPosition(curMousePosition);
  };

  useMount(() => {
    if (stageRef.current?.content) {
      stageRef.current.content.className = 'gantt-stage';
    }
  });

  /**
   * 处理画布拖拽移动事件
   */
  const onDragMove = () => {
    if (wheelingRef.current) {
      return;
    }
    wheelingRef.current = window.requestAnimationFrame(() => {
      wheelingRef.current = null;

      const { x, y } = stageRef.current.getPointerPosition();
      const curPointPosition = getMousePosition(x, y);
      setPointPosition(curPointPosition);
    });
  };

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
      {gridViewValue => (
        <KonvaGanttViewContext.Consumer>
          {ganttViewValue => (
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
                  onDragStart={onGanttDragStart}
                  onDragMove={onDragMove}
                  onDragEnd={onGanttDragEnd}
                  onClick={onClick}
                  onTap={onClick}
                  onTouchStart={(e) => {
                    if (isTouchDevice && !isMobile) {
                      setImmediatePointPosition(e);
                    }
                  }}
                  style={{
                    borderRadius: isMobile ? 'none' : '8px 0 0 0',
                    overflow: 'hidden',
                    zIndex: isExporting ? -1 : 1,
                  }}
                  listening={listening}
                >
                  <KonvaGridViewContext.Provider value={gridViewValue}>
                    <KonvaGanttViewContext.Provider value={ganttViewValue}>
                      <KonvaGridContext.Provider value={innerValue}>
                        <Gantt
                          ganttInstance={ganttInstance}
                          gridInstance={gridInstance}
                          gridScrollState={gridScrollState}
                          ganttScrollState={ganttScrollState}
                          rowStartIndex={rowStartIndex}
                          rowStopIndex={rowStopIndex}
                          columnStartIndex={columnStartIndex}
                          columnStopIndex={columnStopIndex}
                          gridColumnStartIndex={gridColumnStartIndex}
                          gridColumnStopIndex={gridColumnStopIndex}
                          pointPosition={pointPosition}
                          isExporting={isExporting}
                        />
                      </KonvaGridContext.Provider>
                    </KonvaGanttViewContext.Provider>
                  </KonvaGridViewContext.Provider>
                </Stage>
              )}
            </KonvaGridContext.Consumer>
          )}
        </KonvaGanttViewContext.Consumer>
      )}
    </KonvaGridViewContext.Consumer>
  );
});
export default GanttStage;
