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
import { FC, memo, useContext, useMemo, useRef } from 'react';
import { KONVA_DATASHEET_ID, Selectors } from '@apitable/core';
import { AreaType, IScrollState, PointPosition, useViewExport } from 'pc/components/gantt_view';
import {
  DEFAULT_POINT_POSITION,
  GRID_GROUP_OFFSET,
  GRID_ROW_HEAD_WIDTH,
  GridCoordinate,
  KonvaGrid,
  KonvaGridContext,
  KonvaGridViewContext,
  useGridMouseEvent,
} from 'pc/components/konva_grid';

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

export const getCellOffsetLeft = (depth: number) => {
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

export const KonvaGridStage: FC<React.PropsWithChildren<IKonvaGridStageProps>> = memo((props) => {
  const { instance, pointPosition, setPointPosition, scrollState, offsetX = 0, isExporting = false, listening = true } = props;
  const { view, datasheetId, linearRows, visibleColumns } = useContext(KonvaGridViewContext);
  const { scrollTop, scrollLeft, isScrolling } = scrollState;
  const stageRef = useRef<any>(); // Konva Stage
  const wheelingRef = useRef<number | null>(null); // Storage timer to ensure smooth operation
  const { rowCount, columnCount, frozenColumnCount, frozenColumnWidth, rowHeight, rowInitSize, containerWidth, containerHeight } = instance;
  const viewName = view.name;

  const scrollMaxWidth = useMemo(() => {
    return visibleColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), GRID_ROW_HEAD_WIDTH);
  }, [visibleColumns]);

  const scrollMaxHeight = useMemo(() => {
    return instance.getRowOffset(rowCount - 1) + 32;
    // eslint-disable-next-line
  }, [instance, rowCount, rowInitSize, rowHeight]);

  // Get the vertical visible area to render
  const getVerticalRangeInfo = () => {
    const startIndex = instance.getRowStartIndex(scrollTop);
    const stopIndex = instance.getRowStopIndex(startIndex, scrollTop);

    return {
      rowStartIndex: Math.max(0, startIndex),
      rowStopIndex: Math.max(0, Math.min(rowCount - 1, stopIndex)),
    };
  };

  // Get the horizontal visible area to render
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

  // Get the prefix targetName
  const getTargetName = (targetName?: string | null) => {
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
    const areaType = offsetLeft <= scrollMaxWidth && offsetTop <= scrollMaxHeight ? AreaType.Grid : AreaType.None;
    const realAreaType = areaType;
    const targetName = getTargetName(_targetName);
    return {
      areaType,
      realAreaType,
      targetName, // As a simple operational identifier, with prefix name only
      realTargetName: _targetName || KONVA_DATASHEET_ID.GRID_BLANK, // Real name
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
   * Handling canvas mouse movement events
   */
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (wheelingRef.current) return;
    wheelingRef.current = window.requestAnimationFrame(() => {
      const targetName = e.target.name();
      const pos = stageRef.current?.getPointerPosition();
      if (pos == null) return;
      const { x, y } = pos;
      const curMousePosition = getMousePosition(x, y, targetName);
      // Handling mouse styles
      handleMouseStyle(curMousePosition.realTargetName, curMousePosition.realAreaType);
      onGridMouseMove(e);
      setPointPosition(curMousePosition);
      wheelingRef.current = null;
    });
  };

  const setImmediatePointPosition = (e: KonvaEventObject<MouseEvent>) => {
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
    datasheetId,
  });

  return (
    <KonvaGridViewContext.Consumer>
      {(wrapperValue) => (
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
