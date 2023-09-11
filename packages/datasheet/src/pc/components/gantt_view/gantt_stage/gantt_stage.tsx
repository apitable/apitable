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

import { useMount } from 'ahooks';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC, memo, useContext, useRef } from 'react';
import { KONVA_DATASHEET_ID } from '@apitable/core';
import {
  AreaType,
  GanttCoordinate,
  IScrollState,
  KonvaGanttViewContext,
  PointPosition,
  ScrollViewType,
  useGanttMouseEvent,
} from 'pc/components/gantt_view';
import { GridCoordinate, isWithinFrozenColumnBoundary, KonvaGridContext, KonvaGridViewContext, useGridMouseEvent } from 'pc/components/konva_grid';

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

const GanttStage: FC<React.PropsWithChildren<IGanttStageProps>> = memo((props) => {
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

  const { isMobile, isTouchDevice, setMouseStyle } = useContext(KonvaGridContext);
  const { view, linearRows, datasheetId } = useContext(KonvaGridViewContext);
  const { isLocking } = useContext(KonvaGanttViewContext);

  const stageRef = useRef<any>(); // Konva Stage
  const wheelingRef = useRef<number | null>(null); // Storage timer for smooth operation
  const { scrollLeft: gridScrollLeft } = gridScrollState;
  const { scrollTop, scrollLeft: ganttScrollLeft } = ganttScrollState;
  const { containerWidth: gridWidth, columnCount: gridColumnCount, rowCount, frozenColumnWidth } = gridInstance;
  const { containerWidth: ganttWidth, containerHeight, rowHeight } = ganttInstance;
  const gridVisible = gridWidth > 0;
  const containerWidth = gridWidth + ganttWidth;
  const viewName = view.name;

  // Get the vertical visible area to be rendered
  const getVerticalRangeInfo = () => {
    const startIndex = ganttInstance.getRowStartIndex(scrollTop);
    const stopIndex = ganttInstance.getRowStopIndex(startIndex, scrollTop);

    // rowStartIndex is the first in the visible area, but leaves a visual gap, so it needs to be rendered one more time forward
    return {
      rowStartIndex: Math.max(0, startIndex - 1),
      rowStopIndex: Math.max(0, Math.min(rowCount - 1, stopIndex + 1)),
    };
  };

  // Get the horizontal visible area of the Graphics Area to be rendered
  const getHorizontalRangeInfo = () => {
    const startIndex = ganttInstance.getColumnStartIndex(ganttScrollLeft);
    const stopIndex = ganttInstance.getColumnStopIndex(ganttScrollLeft);

    return {
      columnStartIndex: startIndex - 1,
      columnStopIndex: stopIndex + 1,
    };
  };

  // Get the horizontally visible area of the Task Area to be rendered
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

  // Get prefix targetName
  const getTargetName = (targetName?: string | null) => {
    if (targetName == null || targetName === '') {
      return KONVA_DATASHEET_ID.GANTT_BLANK;
    }
    if (targetName.includes('middle-left') || targetName.includes('middle-right') || targetName.includes(KONVA_DATASHEET_ID.GANTT_TASK)) {
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
      targetName,
      realTargetName: _targetName || KONVA_DATASHEET_ID.GANTT_BLANK,
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
   * Handling canvas mouseover events
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

      // Handling mouse styles
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
    onGanttMouseUp();
  };

  const onClick = (e: any) => {
    onGridClick(e);
    onGanttClick(e);
  };

  const setImmediatePointPosition = (e: any) => {
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
   * Handling canvas drag and move events
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
    datasheetId,
  });

  return (
    <KonvaGridViewContext.Consumer>
      {(gridViewValue) => (
        <KonvaGanttViewContext.Consumer>
          {(ganttViewValue) => (
            <KonvaGridContext.Consumer>
              {(innerValue) => (
                <Stage
                  _ref={stageRef}
                  width={containerWidth}
                  height={containerHeight}
                  onMouseDown={(e: KonvaEventObject<MouseEvent>) => {
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
                  onTouchStart={(e: any) => {
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
