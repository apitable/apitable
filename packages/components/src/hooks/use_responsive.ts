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
import { ScreenWidth } from '@apitable/core';

export type Orientation = 'landscape' | 'portrait';

const isRenderServer = () => {
  return process.env.SSR;
};

export enum ScreenSize {
  xs = 'xs', // 0
  sm = 'sm', // 576
  md = 'md', // 768
  lg = 'lg', // 992
  xl = 'xl', // 1200
  xxl = 'xxl', // 1440
  xxxl = 'xxxl', // 1600
}

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
  // @ts-ignore
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
  const bodySize = useSize(isRenderServer() ? undefined : document.body);

  // @ts-ignore
  if (sizes[sizes.length - 1][1] !== 0) {
    // @ts-ignore
    console.warn('fixing', sizes[sizes.length - 1][0], 'size which should be 0');
    // @ts-ignore
    sizes[sizes.length - 1][1] = 0;
  }

  return getScreen(bodySize?.width!, bodySize?.height!);
};
