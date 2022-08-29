import { useMemo } from 'react';
import { isTouchDevice } from 'pc/utils';
import { AreaType } from '../interface';
import { useMobileScroller } from './use_mobile_scroller';
import { useScroller } from './use_scroller';

export interface IScrollCoordsProps {
  scrollLeft?: number;
  scrollTop?: number;
}

interface IUseGanttScrollerProps {
  containerRef: React.RefObject<any>;
  verticalBarRef: React.RefObject<HTMLDivElement>;
  gridHorizontalBarRef: React.RefObject<HTMLDivElement>;
  ganttHorizontalBarRef?: React.RefObject<HTMLDivElement>;
  cellVerticalBarRef: React.RefObject<HTMLDivElement>;
  gridWidth: number;
  ganttWidth: number;
  containerHeight: number;
  gridTotalWidth: number;
  ganttTotalWidth: number;
  totalHeight: number;
  isCellScrolling: boolean;
  pointAreaType?: AreaType;
}

export const useGanttScroller = (props: IUseGanttScrollerProps) => {
  const { 
    containerRef,
    gridHorizontalBarRef,
    ganttHorizontalBarRef = { current: null },
    verticalBarRef,
    gridWidth,
    ganttWidth,
    containerHeight,
    gridTotalWidth,
    ganttTotalWidth,
    totalHeight,
    isCellScrolling,
    cellVerticalBarRef,
    pointAreaType = AreaType.Grid,
  } = props;
  const isRealTouchDevice = isTouchDevice(); // 真正意义上的触控设备，处理 surface 之类的触控笔记本的情况
  const isGridArea = pointAreaType === AreaType.Grid;
  const isGanttArea = pointAreaType === AreaType.Gantt;

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

  // 触摸设备甘特图滚动
  const { scrollTo: ganttMobileScrollTo } = useMobileScroller({
    containerRef,
    horizontalBarRef: ganttHorizontalBarRef,
    verticalBarRef,
    containerWidth: ganttWidth,
    containerHeight,
    totalWidth: ganttTotalWidth,
    totalHeight,
    isTouchDevice: isRealTouchDevice,
    isRunning: isGanttArea,
  });

  const { scrollTo } = useScroller({
    containerRef,
    gridHorizontalBarRef,
    ganttHorizontalBarRef,
    verticalBarRef,
    isCellScrolling,
    cellVerticalBarRef,
    pointAreaType,
  });

  return useMemo(() => {
    if (!isRealTouchDevice) return { scrollTo };
    if (isGridArea) return { scrollTo: gridMobileScrollTo };
    if (isGanttArea) return { scrollTo: ganttMobileScrollTo };
    return { scrollTo };
  }, [isRealTouchDevice, scrollTo, isGridArea, gridMobileScrollTo, isGanttArea, ganttMobileScrollTo]);
};