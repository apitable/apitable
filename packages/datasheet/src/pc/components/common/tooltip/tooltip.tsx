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

import { Tooltip as AntdTooltip } from 'antd';
import { TooltipProps as AntdTooltipProps } from 'antd/es/tooltip';
import { FC, useEffect, useRef, useState } from 'react';
import { isTouchDevice } from 'pc/utils/mobile';
import styles from './style.module.less';

export interface ITooltipProps {
  showTipAnyway?: boolean;
  textEllipsis?: boolean;
  overflowWidth?: number;
  offset?: number[];
  rowsNumber?: number;
}

/**
 * Default: displayed on pc, not on touch devices
 * @param textEllipsis： Similar to the default, mainly for text, shown when part of the text is hidden, otherwise not shown
 * @param showTipAnyway： Displayed on whatever device
 */
export const Tooltip: FC<React.PropsWithChildren<ITooltipProps & AntdTooltipProps>> = ({
  showTipAnyway = false,
  textEllipsis = false,
  offset = [0, -3],
  overflowWidth,
  rowsNumber,
  ...props
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const myrefs = useRef<HTMLElement>();

  useEffect(() => {
    if (!myrefs.current || !textEllipsis) {
      return;
    }
    if (overflowWidth) {
      setShowPopover(myrefs.current.clientWidth > overflowWidth);
      return;
    }
    setShowPopover(myrefs.current.scrollWidth > myrefs.current.clientWidth);
    // eslint-disable-next-line
  }, [myrefs.current, overflowWidth]);

  if (showTipAnyway || (textEllipsis && showPopover && !isTouchDevice()) || (!showTipAnyway && !textEllipsis && !isTouchDevice())) {
    return (
      <AntdTooltip
        align={{ offset }}
        trigger="hover"
        overlayClassName={rowsNumber ? styles.controlRowsNum : styles.baseStyle}
        ref={myrefs}
        {...props}
      >
        {props.children}
      </AntdTooltip>
    );
  }
  return <>{props.children}</> || null;
};
