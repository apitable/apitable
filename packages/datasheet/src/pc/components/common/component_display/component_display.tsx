import { useResponsive } from 'pc/hooks/use_responsive';
import * as React from 'react';
import { ScreenSize } from './enum';

interface IComponentDisplay {
  maxWidthCompatible?: ScreenSize; 
  minWidthCompatible?: ScreenSize; 
}

export const ComponentDisplay: React.FC<IComponentDisplay> = props => {
  const { maxWidthCompatible, minWidthCompatible } = props;
  const { screenIsAtLeast, screenIsAtMost } = useResponsive();

  if (maxWidthCompatible && minWidthCompatible) {
    const minBreakPoints = screenIsAtLeast(minWidthCompatible);
    const maxBreakPoints = screenIsAtMost(maxWidthCompatible);
    if (!(minBreakPoints && maxBreakPoints)) {
      console.warn('! ' + 'Check that the order of the parameters is correct');
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
