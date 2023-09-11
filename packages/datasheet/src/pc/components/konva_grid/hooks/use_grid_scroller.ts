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

import { useMemo } from 'react';
import { useMobileScroller, useScroller, AreaType } from 'pc/components/gantt_view';
import { isTouchDevice } from 'pc/utils';

interface IUseGridScrollerProps {
  containerRef: React.RefObject<any>;
  verticalBarRef: React.RefObject<HTMLDivElement>;
  gridHorizontalBarRef: React.RefObject<HTMLDivElement>;
  cellVerticalBarRef: React.RefObject<HTMLDivElement>;
  gridWidth: number;
  containerHeight: number;
  gridTotalWidth: number;
  totalHeight: number;
  isCellScrolling: boolean;
  pointAreaType?: AreaType;
}

export const useGridScroller = (props: IUseGridScrollerProps) => {
  const {
    containerRef,
    gridHorizontalBarRef,
    verticalBarRef,
    gridWidth,
    containerHeight,
    gridTotalWidth,
    totalHeight,
    isCellScrolling,
    cellVerticalBarRef,
    pointAreaType = AreaType.Grid,
  } = props;
  // Touch devices in the true sense of the word, dealing with touch notebooks like surface
  const isRealTouchDevice = isTouchDevice();
  const isGridArea = pointAreaType === AreaType.Grid;

  // Touch device grid scrolling
  const { scrollTo: gridMobileScrollTo } = useMobileScroller({
    containerRef,
    horizontalBarRef: gridHorizontalBarRef,
    verticalBarRef,
    containerWidth: gridWidth,
    containerHeight,
    totalWidth: gridTotalWidth,
    totalHeight,
    isTouchDevice: isRealTouchDevice,
    isRunning: isGridArea,
  });

  const { scrollTo } = useScroller({
    containerRef,
    gridHorizontalBarRef,
    verticalBarRef,
    isCellScrolling,
    cellVerticalBarRef,
    pointAreaType,
  });

  return useMemo(() => {
    if (!isRealTouchDevice) return { scrollTo };
    return { scrollTo: gridMobileScrollTo };
  }, [isRealTouchDevice, scrollTo, gridMobileScrollTo]);
};
