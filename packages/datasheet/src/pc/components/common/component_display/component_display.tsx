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

import * as React from 'react';
import { useResponsive } from 'pc/hooks/use_responsive';
import { ScreenSize } from './enum';

interface IComponentDisplay {
  maxWidthCompatible?: ScreenSize;
  minWidthCompatible?: ScreenSize;
}

export const ComponentDisplay: React.FC<React.PropsWithChildren<IComponentDisplay>> = (props) => {
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
