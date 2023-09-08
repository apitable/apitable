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

import { useEffect, useCallback, useMemo } from 'react';
import { isWindowsOS } from 'pc/utils/os';
import { AreaType } from '../interface';

export interface IScrollCoordsProps {
  scrollLeft?: number;
  scrollTop?: number;
}

interface IUseScrollerProps {
  containerRef: React.RefObject<any>;
  verticalBarRef: React.RefObject<HTMLDivElement>;
  gridHorizontalBarRef: React.RefObject<HTMLDivElement>;
  ganttHorizontalBarRef?: React.RefObject<HTMLDivElement>;
  cellVerticalBarRef: React.RefObject<HTMLDivElement>;
  isCellScrolling: boolean;
  pointAreaType?: AreaType;
}

export const useScroller = (props: IUseScrollerProps) => {
  const {
    containerRef,
    gridHorizontalBarRef,
    ganttHorizontalBarRef = { current: null },
    verticalBarRef,
    isCellScrolling,
    cellVerticalBarRef,
    pointAreaType = AreaType.Grid,
  } = props;

  const scrollHandler = useCallback(
    (deltaX: number, deltaY: number) => {
      if (isCellScrolling && cellVerticalBarRef.current) {
        cellVerticalBarRef.current.scrollTop = Math.max(cellVerticalBarRef.current.scrollTop + deltaY);
        return;
      }
      if (pointAreaType === AreaType.Gantt && ganttHorizontalBarRef.current) {
        ganttHorizontalBarRef.current.scrollLeft = ganttHorizontalBarRef.current.scrollLeft + deltaX;
      }
      if (pointAreaType === AreaType.Grid && gridHorizontalBarRef.current) {
        gridHorizontalBarRef.current.scrollLeft = gridHorizontalBarRef.current.scrollLeft + deltaX;
      }
      if (verticalBarRef.current) {
        verticalBarRef.current.scrollTop = verticalBarRef.current.scrollTop + deltaY;
      }
    },
    [isCellScrolling, ganttHorizontalBarRef, gridHorizontalBarRef, cellVerticalBarRef, verticalBarRef, pointAreaType],
  );

  // Scroll to a position (for PC use)
  const scrollTo = useCallback(
    ({ scrollTop, scrollLeft }: IScrollCoordsProps, areaType: AreaType = AreaType.Grid) => {
      if (verticalBarRef.current && scrollTop != null) {
        verticalBarRef.current.scrollTop = scrollTop;
      }
      if (areaType === AreaType.Gantt && ganttHorizontalBarRef.current && scrollLeft != null) {
        ganttHorizontalBarRef.current.scrollLeft = scrollLeft;
      }
      if (areaType === AreaType.Grid && gridHorizontalBarRef.current && scrollLeft != null) {
        gridHorizontalBarRef.current.scrollLeft = scrollLeft;
      }
    },
    [ganttHorizontalBarRef, gridHorizontalBarRef, verticalBarRef],
  );

  // Handling PC scrolling related events
  const onWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      const { deltaX, deltaY, shiftKey } = event;
      // Windows compatible (shift + scroll wheel) horizontal scrolling
      const fixedDeltaY = shiftKey && isWindowsOS() ? 0 : deltaY;
      const fixedDeltaX = shiftKey && isWindowsOS() ? deltaY : deltaX;
      scrollHandler(fixedDeltaX, fixedDeltaY);
    },
    [scrollHandler],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', onWheel, { passive: false });
    };
  });

  (window as any).KonvaScroller = onWheel;

  return useMemo(() => {
    return { scrollTo };
  }, [scrollTo]);
};
