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

import classNames from 'classnames';
import { FC, useRef } from 'react';
import { ScrollBarType } from '../../interfaces';

import { useScrollEvents } from './use_scroll_events';
import styles from './styles.module.less';

export interface IScrollBarProps {
  type: ScrollBarType;
}

export const ScrollBar: FC<React.PropsWithChildren<IScrollBarProps>> = ({ type }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollHandler, contentSize } = useScrollEvents(type, containerRef);

  const isHorizontal = type === ScrollBarType.Horizontal;
  const scrollWrapperSize = 16;

  return (
    <div
      className={classNames({
        [styles.scrollBarWrap]: isHorizontal,
        [styles.scrollBarVWrap]: !isHorizontal,
      })}
      ref={containerRef}
      onScroll={scrollHandler}
      style={{
        width: isHorizontal ? '100%' : scrollWrapperSize,
        height: isHorizontal ? scrollWrapperSize : '100%',
      }}
    >
      <div
        style={{
          width: isHorizontal ? contentSize : scrollWrapperSize,
          height: isHorizontal ? scrollWrapperSize : contentSize,
        }}
      />
    </div>
  );
};
