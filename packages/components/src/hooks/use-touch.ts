import { useRef } from 'react';

// 滑动灵敏度
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

  // 重置
  const reset = () => {
    touchRef.current = {
      startX: 0,
      startY: 0,
      direction: undefined
    };
  };

  // 监听开始滑动
  const start = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    touchRef.current = {
      startX: clientX,
      startY: clientY,
      direction: undefined
    };
  };

  // 监听滑动
  const move = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    let direction: Direction | undefined;
    const { startX, startY } = touchRef.current;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    // 横向滚动
    if (absX > absY) {
      // 向左
      if (deltaX + MIN_DISTANCE < 0) {
        direction = Direction.Left;
      }
      // 向右
      if (deltaX > MIN_DISTANCE) {
        direction = Direction.Right;
      }
    }
    touchRef.current.direction = direction;
    return direction;
  };

  // 监听滑动结束计算有效方向
  const end = () => {
    // 清理缓存
    reset();
  };

  return {
    start,
    end,
    move,
    direction: touchRef.current.direction
  };
};
