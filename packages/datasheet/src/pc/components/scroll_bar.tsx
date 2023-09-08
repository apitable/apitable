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

import { useHover } from 'ahooks';
import { FC } from 'react';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Scrollbars } from 'react-custom-scrollbars';

interface ICustomScrollbarsProps {
  onScroll?: (e: any) => void;
  style?: React.CSSProperties;
  autoHide?: boolean;
}

export const ScrollBar: FC<React.PropsWithChildren<ICustomScrollbarsProps>> = (props) => {
  const { autoHide = true } = props;
  const ref = React.useRef(null);
  const isHovering = useHover(ref);

  const renderThumb = ({ style, ...props }: any) => {
    const thumbStyle = {
      borderRadius: 6,
      zIndex: 1,
      opacity: !autoHide || isHovering ? '1' : '0',
      background: 'var(--bgScrollbarDefault)',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };
  return (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      autoHideTimeout={500}
      autoHideDuration={200}
      autoHide={autoHide}
      {...props}
    >
      <div ref={ref} style={props.style}>
        {props.children}
      </div>
    </Scrollbars>
  );
};
