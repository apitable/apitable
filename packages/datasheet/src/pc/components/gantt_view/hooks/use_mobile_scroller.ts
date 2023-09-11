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

import { useEffect, useRef, useCallback, useMemo } from 'react';
// @ts-ignore
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
  const { containerRef, horizontalBarRef, verticalBarRef, containerWidth, containerHeight, totalWidth, totalHeight, isTouchDevice, isRunning } =
    props;
  const scrollerRef = useRef<typeof Scroller | null>(null);

  const mobileScrollHandler = useCallback(
    (scrollLeft: number, scrollTop: number) => {
      if (verticalBarRef.current) {
        verticalBarRef.current.scrollTop = scrollTop;
      }
      if (horizontalBarRef.current) {
        horizontalBarRef.current.scrollLeft = scrollLeft;
      }
    },
    [verticalBarRef, horizontalBarRef],
  );

  // Scroll to a location (for mobile use)
  const scrollTo = useCallback(
    ({ scrollTop, scrollLeft }: IScrollCoordsProps) => {
      if (horizontalBarRef.current && verticalBarRef.current) {
        scrollerRef.current?.scrollTo(scrollLeft || horizontalBarRef.current.scrollLeft, scrollTop || verticalBarRef.current.scrollTop);
      }
    },
    [horizontalBarRef, verticalBarRef],
  );

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

  const onTouchEnd = useCallback(
    (e: any) => {
      if (scrollerRef.current) {
        if (horizontalBarRef.current && verticalBarRef.current) {
          scrollTo({
            scrollLeft: horizontalBarRef.current.scrollLeft,
            scrollTop: verticalBarRef.current.scrollTop,
          });
        }
        scrollerRef.current.doTouchEnd(e.timeStamp);
      }
    },
    [horizontalBarRef, verticalBarRef, scrollTo],
  );

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
