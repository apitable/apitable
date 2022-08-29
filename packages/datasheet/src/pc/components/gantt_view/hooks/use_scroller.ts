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

  const scrollHandler = useCallback((deltaX: number, deltaY: number) => {
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
  }, [isCellScrolling, ganttHorizontalBarRef, gridHorizontalBarRef, cellVerticalBarRef, verticalBarRef, pointAreaType]);

  // 滚动到某个位置（供 PC 端使用）
  const scrollTo = useCallback(({ scrollTop, scrollLeft }: IScrollCoordsProps, areaType: AreaType = AreaType.Grid) => {
    if (verticalBarRef.current && scrollTop != null) {
      verticalBarRef.current.scrollTop = scrollTop;
    }
    if (areaType === AreaType.Gantt && ganttHorizontalBarRef.current && scrollLeft != null) {
      ganttHorizontalBarRef.current.scrollLeft = scrollLeft;
    }
    if (areaType === AreaType.Grid && gridHorizontalBarRef.current && scrollLeft != null) {
      gridHorizontalBarRef.current.scrollLeft = scrollLeft;
    }
  }, [ganttHorizontalBarRef, gridHorizontalBarRef, verticalBarRef]);

  // 处理 PC 滚动相关的事件
  const onWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const { deltaX, deltaY, shiftKey } = event;
    // 兼容 windows (shift + 滚轮) 横向滚动
    const fixedDeltaY = shiftKey && isWindowsOS() ? 0 : deltaY;
    const fixedDeltaX = shiftKey && isWindowsOS() ? deltaY : deltaX;
    scrollHandler(fixedDeltaX, fixedDeltaY);
  }, [scrollHandler]);

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