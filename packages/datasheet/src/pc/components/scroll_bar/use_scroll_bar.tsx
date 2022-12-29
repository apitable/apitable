import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { IUseScrollBar, ScrollBarDirection } from './scroll_bar.interface';

const MIN_BAR_LENGTH = 32;
export const useScrollBar = (props: IUseScrollBar) => {
  const { gridVisibleLength, dataTotalLength, scrollAreaLength, direction, onGridScroll, scrollBarOffset } = props;
  const [isDown, setIsDown] = useState(false); // Whether the mouse is pressed
  const [downPosition, setDownPosition] = useState(0); // Distance from the mouse to the top of the slider
  const slideRef: React.RefObject<HTMLDivElement> = useRef(null);
  const scrollbarRef: React.RefObject<HTMLDivElement> = useRef(null);
  const globalRef = useRef({
    slideSelfLength: 0,
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

  const handleMouseMove = (e: MouseEvent) => {
    if (!(slideRef.current && scrollbarRef.current)) {
      return;
    }
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const scrollBarRect = scrollbarRef.current.getBoundingClientRect();

    // Distance from the scroll bar to the top of the viewport
    const WrapperTopToClient: number = direction === ScrollBarDirection.Horizon ?
      scrollBarRect.left : scrollBarRect.top;
    // Dragging distance of slider
    let dist = 0;
    if (direction === ScrollBarDirection.Horizon) {
      dist = e.clientX - WrapperTopToClient - downPosition;
      globalRef.current.slideSelfLength = slideRef.current.clientWidth;
    } else {
      dist = e.clientY - WrapperTopToClient - downPosition;
      globalRef.current.slideSelfLength = slideRef.current.clientHeight;
    }
    // The distance the slider has rolled
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

    const unVisibleDataLength = dataTotalLength - scrollAreaLength; // Total length of the data outside the visible view area
    const trackForBlank = gridVisibleLength - globalRef.current.slideSelfLength; // Length on the rolling track other than the slider
    const scrollDist = unVisibleDataLength * (scrollOverDistance / trackForBlank);
    onGridScroll(scrollDist);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const getScrollOverRatio = (dataTotalLength: number, scrollAreaLength: number) => {
    const unVisibleDataLength = dataTotalLength - scrollAreaLength; // Total length of the data outside the visible view area
    return scrollBarOffset! / unVisibleDataLength;
  };

  const calcSlideLength = () => {
    const ratioForSlide = scrollAreaLength / dataTotalLength; // Scrollable area / total data length === Slider length / total length of track
    const slideLength = gridVisibleLength * ratioForSlide;
    const result = slideLength < MIN_BAR_LENGTH ? MIN_BAR_LENGTH : slideLength;
    return result;
  };

  const calcSlideOffset = () => {
    const slideLength = calcSlideLength();
    const scrollOverRatio = getScrollOverRatio(dataTotalLength, scrollAreaLength);
    const trackForBlank = gridVisibleLength - slideLength; // The length of the rolling track after subtracting the length occupied by the slider
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
