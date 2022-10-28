import { useMemo } from 'react';
import { isTouchDevice } from 'pc/utils';
import { useMobileScroller, useScroller, AreaType } from 'pc/components/gantt_view';

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
