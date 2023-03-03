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
import { useScrollBar } from './use_scroll_bar';
import styles from './style.module.less';
import { IScrollBarProps, ScrollBarDirection, IScrollBarVertical } from './scroll_bar.interface';
import { isMobile } from 'react-device-detect';

export const ScrollBarVertical: React.FC<React.PropsWithChildren<IScrollBarProps & IScrollBarVertical>> = props => {
  const { gridVisibleLength, dataTotalLength, scrollAreaLength, scrollTop } = props;
  const { scrollbarRef, slideRef, minScrollBarSize, handleMouseDown, calcSlideOffset } =
    useScrollBar({ ...props, scrollBarOffset: scrollTop, direction: ScrollBarDirection.Vertical });

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
          className={styles.scrollBarVBox}
          style={{ height: (gridVisibleLength) }}
          ref={scrollbarRef}
        >
          <div className={styles.scrollBarV}>
            <div
              className={styles.scrollBarVSlide}
              onMouseDown={e => handleMouseDown(e)}
              style={{
                ...style,
                ...({ minHeight: minScrollBarSize }),
              }}
              ref={slideRef}
            />
          </div>
        </div>
      ) : <></>
  );
};
