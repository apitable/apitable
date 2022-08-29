import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Scroller } from 'scroller';
import { IScrollCoordsProps } from './use_scroller';

interface IUseScrollerProps {
  containerRef: React.RefObject<any>;
  verticalBarRef: React.RefObject<HTMLDivElement>;
  horizontalBarRef: React.RefObject<HTMLDivElement>;
  containerWidth: number;
  containerHeight: number;
  totalWidth: number;
  totalHeight: number;
  isTouchDevice: boolean;
  isRunning: boolean;
}

export const useMobileScroller = (props: IUseScrollerProps) => {
  const { 
    containerRef,
    horizontalBarRef,
    verticalBarRef,
    containerWidth,
    containerHeight,
    totalWidth,
    totalHeight,
    isTouchDevice,
    isRunning
  } = props;
  const scrollerRef = useRef<typeof Scroller | null>(null);

  const mobileScrollHandler = useCallback((scrollLeft: number, scrollTop: number) => {
    if (verticalBarRef.current) {
      verticalBarRef.current.scrollTop = scrollTop;
    }
    if (horizontalBarRef.current) {
      horizontalBarRef.current.scrollLeft = scrollLeft;
    }
  }, [verticalBarRef, horizontalBarRef]);

  // 滚动到某个位置（供移动端使用）
  const scrollTo = useCallback(({ scrollTop, scrollLeft }: IScrollCoordsProps) => {
    if (horizontalBarRef.current && verticalBarRef.current) {
      scrollerRef.current?.scrollTo(
        scrollLeft || horizontalBarRef.current.scrollLeft, 
        scrollTop || verticalBarRef.current.scrollTop
      );
    }
  }, [horizontalBarRef, verticalBarRef]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (scrollerRef.current) {
      scrollerRef.current.doTouchStart(e.changedTouches, e.timeStamp);
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (scrollerRef.current) {
      scrollerRef.current.doTouchMove(e.changedTouches, e.timeStamp);
    }
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (scrollerRef.current) {
      if (horizontalBarRef.current && verticalBarRef.current) {
        scrollTo({ 
          scrollLeft: horizontalBarRef.current.scrollLeft, 
          scrollTop: verticalBarRef.current.scrollTop 
        });
      }
      scrollerRef.current.doTouchEnd(e.timeStamp);
    }
  }, [horizontalBarRef, verticalBarRef, scrollTo]);

  useEffect(() => {
    if (isTouchDevice) {
      const options = {
        scrollingX: true,
        scrollingY: true,
        animationDuration: 200,
      };

      scrollerRef.current = new Scroller(mobileScrollHandler, options);
    }
  }, [isTouchDevice, mobileScrollHandler]);

  useEffect(() => {
    if (isTouchDevice && scrollerRef.current) {
      scrollTo({});
      scrollerRef.current.setDimensions(containerWidth, containerHeight, totalWidth, totalHeight);
    }
  }, [containerHeight, totalHeight, isTouchDevice, scrollTo, containerWidth, totalWidth]);

  useEffect(() => {
    if (!isRunning || !isTouchDevice || !containerRef.current) return;
    const element = containerRef.current;
    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchend', onTouchEnd);
    element.addEventListener('touchmove', onTouchMove);
    
    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchmove', onTouchMove);
    };
  });

  return useMemo(() => ({ scrollTo }), [scrollTo]);
};