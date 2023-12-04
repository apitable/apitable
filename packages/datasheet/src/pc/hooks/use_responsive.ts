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

import { useSize } from 'ahooks';
import { useEffect, useState } from 'react';
import { ScreenWidth } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { isRenderServer } from 'pc/utils/dom';

export type Orientation = 'landscape' | 'portrait';

export interface IScreen<T> {
  size: keyof T;
  orientation: Orientation;
  screenIsAtLeast(breakpoint: keyof T, andOrientation?: Orientation): boolean;
  screenIsAtMost(breakpoint: keyof T, andOrientation?: Orientation): boolean;
  clientWidth: number;
  isMobile: boolean;
}

const breakpoints = ScreenWidth;
const sizes = Object.entries(breakpoints).sort(([, aSize], [, bSize]) => bSize - aSize);

export const getScreen = (width: number, height: number): IScreen<{ [name: string]: number }> => {
  const size = sizes.find(([, size]) => size < width)?.[0] || sizes[sizes.length - 1][0];
  const orientation = width > height ? 'landscape' : 'portrait';
  const screenIsAtLeast = (breakpoint: string, andOrientation?: Orientation) => {
    return width >= breakpoints[breakpoint] && (!andOrientation || andOrientation === orientation);
  };
  const screenIsAtMost = (breakpoint: string, andOrientation?: Orientation) => {
    return width < breakpoints[breakpoint] && (!andOrientation || andOrientation === orientation);
  };
  return {
    size,
    orientation,
    screenIsAtLeast,
    screenIsAtMost,
    clientWidth: width,
    isMobile: screenIsAtMost(ScreenSize.md),
  };
};

export const useResponsive = <T extends { [name: string]: number }>(): IScreen<T> => {
  const [bodySize, setBodySize] = useState(() => {
    const el = isRenderServer() ? null : document.body;
    return {
      width: el?.clientWidth,
      height: el?.clientHeight,
    };
  });

  const size = useSize(isRenderServer() ? undefined : document.body);

  useEffect(() => {
    if (size) {
      setBodySize(size);
    }
  }, [size, setBodySize]);

  if (sizes[sizes.length - 1][1] !== 0) {
    console.warn('fixing', sizes[sizes.length - 1][0], 'size which should be 0');
    sizes[sizes.length - 1][1] = 0;
  }

  const [screen, setScreen] = useState(getScreen(bodySize?.width!, bodySize?.height!));

  useEffect(() => {
    setScreen(getScreen(bodySize?.width!, bodySize?.height!));
    // eslint-disable-next-line
  }, [bodySize, setScreen]);

  return screen;
};
