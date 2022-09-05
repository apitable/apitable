import { ScreenWidth } from '@vikadata/core';
import { useSize } from 'ahooks';
import { ScreenSize } from 'pc/components/common/component_display/enum';
import { isRenderServer } from 'pc/utils';
import { useEffect, useState } from 'react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodySize, setScreen]);

  return screen;
};
