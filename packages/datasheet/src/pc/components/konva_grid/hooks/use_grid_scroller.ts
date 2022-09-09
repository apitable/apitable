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
  const isRealTouchDevice = isTouchDevice(); // 真正意义上的触控设备，处理 surface 之类的触控笔记本的情况
  const isGridArea = pointAreaType === AreaType.Grid;

  // 触摸设备表格滚动
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
