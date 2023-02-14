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

import { useState } from 'react';
import * as React from 'react';
import { useScrollBar } from './use_scroll_bar';
import styles from './style.module.less';
import { IScrollBarProps, ScrollBarDirection, IScrollBarHorizon } from './scroll_bar.interface';
import { isMobile } from 'react-device-detect';
import { Tooltip } from 'antd';
import { Strings, t } from '@apitable/core';
import { usePrevious } from 'ahooks';

export const ScrollBarHorizon: React.FC<React.PropsWithChildren<IScrollBarProps & IScrollBarHorizon>> = props => {
  const { gridVisibleLength, dataTotalLength, scrollAreaLength, scrollLeft } = props;
  const { scrollbarRef, slideRef, minScrollBarSize, handleMouseDown, calcSlideOffset } =
    useScrollBar({ ...props, scrollBarOffset: scrollLeft, direction: ScrollBarDirection.Horizon });
  const prevLeft = usePrevious(scrollLeft);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  // useEffect(() => {
  //   if (prevLeft !== scrollLeft) {
  //     setTooltipVisible(false);
  //   } else {
  //     setTooltipVisible(true);
  //   }
  // }, [prevLeft])

  if (isMobile) {
    return null;
  }

  const style = (() => {
    if (!slideRef.current) {
      return;
    }
    return calcSlideOffset();
  })();

  return (
    dataTotalLength > scrollAreaLength ?
      (
        <div
          className={styles.scrollBarHBox}
          style={{ width: (gridVisibleLength) }}
          ref={scrollbarRef}
          onMouseEnter={() => prevLeft === scrollLeft && setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <div className={styles.scrollBarH}>
            <Tooltip title={t(Strings.tip_shift_scroll)} visible={tooltipVisible} >
              <div
                className={styles.scrollBarHSlide}
                onMouseDown={e => handleMouseDown(e)}
                style={{
                  ...style,
                  ...({ minWidth: minScrollBarSize }),
                }}
                ref={slideRef}
              />
            </Tooltip>
          </div>
        </div>
      ) : <></>
  );
};
