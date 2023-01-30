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
    const { clientX, clientY } = e.touches[0]!;
    touchRef.current = {
      startX: clientX,
      startY: clientY,
      direction: undefined
    };
  };

  // Listening scroll
  const move = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0]!;
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
