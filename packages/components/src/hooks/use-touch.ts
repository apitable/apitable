import { useRef } from 'react';

// Scroll sensitivity
const MIN_DISTANCE = 30;

export enum Direction {
  Left = 'left',
  Right = 'right'
}

export const useTouch = () => {
  const touchRef = useRef({
    startX: 0,
    startY: 0,
    direction: undefined as (Direction | undefined)
  });

  // Reset touch cache
  const reset = () => {
    touchRef.current = {
      startX: 0,
      startY: 0,
      direction: undefined
    };
  };

  // Listening start to scroll
  const start = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    touchRef.current = {
      startX: clientX,
      startY: clientY,
      direction: undefined
    };
  };

  // Listening scroll
  const move = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    let direction: Direction | undefined;
    const { startX, startY } = touchRef.current;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    // Horizontal scrolling
    if (absX > absY) {
      // Left scrolling
      if (deltaX + MIN_DISTANCE < 0) {
        direction = Direction.Left;
      }
      // Right scrolling
      if (deltaX > MIN_DISTANCE) {
        direction = Direction.Right;
      }
    }
    touchRef.current.direction = direction;
    return direction;
  };

  //Listening the end of scroll and calculate the effective direction
  const end = () => {
    // Reset cache
    reset();
  };

  return {
    start,
    end,
    move,
    direction: touchRef.current.direction
  };
};
