import { useResponsive } from 'pc/hooks/use_responsive';
import * as React from 'react';
import { ScreenSize } from './enum';

interface IComponentDisplay {
  maxWidthCompatible?: ScreenSize; // 显示组件需要的最大尺寸
  minWidthCompatible?: ScreenSize; // 显示组件需要的最小尺寸
}

// 控制传入的组件是否展示
// mobileShow 为 true ，则只在移动端展示
// mobileShow 为 false 或者不传，只在web端展示
// 如果 移动端 和 PC 端都要展示，不要调用该组件
export const ComponentDisplay: React.FC<IComponentDisplay> = props => {
  const { maxWidthCompatible, minWidthCompatible } = props;
  const { screenIsAtLeast, screenIsAtMost } = useResponsive();

  if (maxWidthCompatible && minWidthCompatible) {
    const minBreakPoints = screenIsAtLeast(minWidthCompatible);
    const maxBreakPoints = screenIsAtMost(maxWidthCompatible);
    if (!(minBreakPoints && maxBreakPoints)) {
      console.warn('! ' + '显示组件的最大值不能小于最小值。检查参数的顺序是否正确');
      return <></>;
    }
    return <>{props.children}</>;
  }
  if (maxWidthCompatible && screenIsAtMost(maxWidthCompatible)) {
    return <>{props.children}</>;
  }
  if (minWidthCompatible && screenIsAtLeast(minWidthCompatible)) {
    return <>{props.children}</>;
  }

  return <></>;
};

export default ComponentDisplay;
