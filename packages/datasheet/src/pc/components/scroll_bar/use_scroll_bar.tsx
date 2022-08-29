import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { IUseScrollBar, ScrollBarDirection } from './scroll_bar.interface';

const MIN_BAR_LENGTH = 32;
export const useScrollBar = (props: IUseScrollBar) => {
  const { gridVisibleLength, dataTotalLength, scrollAreaLength, direction, onGridScroll, scrollBarOffset } = props;
  const [isDown, setIsDown] = useState(false); // 表示鼠标是否按下
  const [downPosition, setDownPosition] = useState(0); // 鼠标到滑块顶部的距离
  const slideRef: React.RefObject<HTMLDivElement> = useRef(null); // 滑块ref
  const scrollbarRef: React.RefObject<HTMLDivElement> = useRef(null); // 滚动条ref
  const globalRef = useRef({
    slideSelfLength: 0, // 滑块的clientWidth 或者clientHeight,取决于方向ß
  });

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDown]);

  // 鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    const { direction } = props;
    if (!slideRef.current) {
      return;
    }
    const downPosition = direction === ScrollBarDirection.Horizon ?
      e.clientX - slideRef.current.getBoundingClientRect().left :
      e.clientY - slideRef.current.getBoundingClientRect().top;
    setIsDown(true);
    setDownPosition(downPosition);

  };

  // 鼠标移动事件
  const handleMouseMove = (e: MouseEvent) => {
    if (!(slideRef.current && scrollbarRef.current)) {
      return;
    }
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const scrollBarRect = scrollbarRef.current.getBoundingClientRect();

    // 滚动条到视口顶部的距离
    const WrapperTopToClient: number = direction === ScrollBarDirection.Horizon ?
      scrollBarRect.left : scrollBarRect.top;
    // 滑块的拖动距离
    let dist = 0;
    if (direction === ScrollBarDirection.Horizon) {
      dist = e.clientX - WrapperTopToClient - downPosition;
      globalRef.current.slideSelfLength = slideRef.current.clientWidth;
    } else {
      dist = e.clientY - WrapperTopToClient - downPosition;
      globalRef.current.slideSelfLength = slideRef.current.clientHeight;
    }
    // 滑块已经滚动过的距离
    let scrollOverDistance = dist;
    if (scrollOverDistance < 0) {
      scrollOverDistance = 0;
    } else if (scrollOverDistance > gridVisibleLength - globalRef.current.slideSelfLength) {
      scrollOverDistance = gridVisibleLength - globalRef.current.slideSelfLength;
    }

    if (direction === ScrollBarDirection.Horizon) {
      slideRef.current.style.left = scrollOverDistance + 'px';
    } else {
      slideRef.current.style.top = scrollOverDistance + 'px';
    }

    const unVisibleDataLength = dataTotalLength - scrollAreaLength; // 在可见视图区域之外的数据的总长度
    const trackForBlank = gridVisibleLength - globalRef.current.slideSelfLength; // 滚动轨道上除了 **滑块** 之外的长度
    const scrollDist = unVisibleDataLength * (scrollOverDistance / trackForBlank);
    onGridScroll(scrollDist);
  };

  // 鼠标松开事件
  const handleMouseUp = () => {
    setIsDown(false);
  };

  const getScrollOverRatio = (dataTotalLength: number, scrollAreaLength: number) => {
    const unVisibleDataLength = dataTotalLength - scrollAreaLength; // 在可见视图区域之外的数据的总长度
    return scrollBarOffset! / unVisibleDataLength;
  };

  // 计算滑块的长度
  const calcSlideLength = () => {
    const ratioForSlide = scrollAreaLength / dataTotalLength; // 可滚动区域/总数据长度 === 滑块长度/轨道的总长度
    const slideLength = gridVisibleLength * ratioForSlide; // 滑块的长度
    const result = slideLength < MIN_BAR_LENGTH ? MIN_BAR_LENGTH : slideLength;
    return result;
  };

  const calcSlideOffset = () => {
    const slideLength = calcSlideLength();
    const scrollOverRatio = getScrollOverRatio(dataTotalLength, scrollAreaLength);
    const trackForBlank = gridVisibleLength - slideLength; // 滚动轨道上减去 **滑块所占长度** 之后的长度
    const { clientWidth, clientHeight } = slideRef.current!;
    if (direction === ScrollBarDirection.Horizon) {
      let leftOffset = scrollOverRatio * trackForBlank;

      if (leftOffset < 0) {
        leftOffset = 0;
      }
      if (leftOffset + clientWidth > gridVisibleLength) {
        leftOffset = gridVisibleLength - clientWidth;
      }
      return { left: leftOffset };
    }
    let topOffset = scrollOverRatio * trackForBlank;
    if (topOffset < 0) {
      topOffset = 0;
    }
    if (topOffset + clientHeight > gridVisibleLength) {
      topOffset = gridVisibleLength - clientHeight;
    }
    return { top: topOffset };
  };

  return {
    scrollbarRef,
    slideRef,
    minScrollBarSize: calcSlideLength(),
    handleMouseDown,
    calcSlideOffset,
  };

};
