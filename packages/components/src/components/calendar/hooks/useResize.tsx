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
import { isTouchEvent, isMouseEvent, resizeFormat } from '../utils';
import { Direction } from '../constants';
import { IResizeHook, IResizeRef } from '../interface';

export const useResize = ({ height = [], width, update, setResizeDay, tasks } : IResizeHook) => {
  const resizeRef = useRef<IResizeRef>();
  const onMouseMove = (event: MouseEvent) => {
    const isRight = resizeRef.current?.direction === Direction.Right;
    const clientX = isTouchEvent(event) ? event.touches[0]?.clientX : event.clientX;
    const clientY = isTouchEvent(event) ? event.touches[0]?.clientY : event.clientY;
    const diffY = (clientY || 0) - (resizeRef.current?.clientY || 0);
    const diffX = (clientX || 0) - (resizeRef.current?.clientX || 0);
    const topF = (resizeRef.current?.top || 0) % height[0]!;
    let week = 0;
    let day = 0;
    if (isRight) {
      const bottomY = diffY + topF - height[0]!;
      if (diffY > 0 && bottomY > 0) {
        week = Math.ceil(bottomY / height[0]!);
      } else {
        week = 0;
      }
      day = Math.ceil(diffX / width!) + 7 * week;
    } else {
      const topY = - diffY - topF;
      if (diffY < 0 && topY > 0) {
        week = Math.ceil(topY / height[0]!);
      } else {
        week = 0;
      }
      day = Math.ceil(- diffX / width!) + 7 * week;
    }
    setResizeDay(day);
    resizeRef.current = {
      ...resizeRef.current!,
      day,
    };
  };
  const onResizeStart = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number | string, direction: Direction) => {
    const parentNode = (event.target as HTMLElement).parentNode as HTMLElement;
    let clientX = 0;
    let clientY = 0;
    if (event.nativeEvent && isMouseEvent(event.nativeEvent)) {
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else if (event.nativeEvent && isTouchEvent(event.nativeEvent)) {
      clientX = (event.nativeEvent as TouchEvent).touches[0]?.clientX || 0;
      clientY = (event.nativeEvent as TouchEvent).touches[0]?.clientY || 0;
    }
    resizeRef.current = { id, clientX, clientY, direction, top: parseInt(parentNode.style.top), day: 0 };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseup);
  };
  const onMouseup = () => {
    const direction = resizeRef.current?.direction!;
    const day = resizeRef.current?.day;
    if (day && update) {
      const task = tasks.filter(t => resizeRef.current?.id === t.id)[0]!;
      const { startDate, endDate } = task;
      const formatData = resizeFormat({ startDate, endDate, day, direction });
      update(task.id, formatData.startDate, formatData.endDate);
    }
    resizeRef.current = undefined;
    setResizeDay(0);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseup);
  };

  return {
    onResizeStart,
    resizeData: resizeRef.current
  };
};