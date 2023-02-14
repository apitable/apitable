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

import { Scrollbars } from 'react-custom-scrollbars';
import { FC } from 'react';
import * as React from 'react';
import { useHover } from 'ahooks';
interface ICustomScrollbarsProps {
  onScroll?: (e: any) => void;
  style?: React.CSSProperties;
}
export const ScrollBar: FC<React.PropsWithChildren<ICustomScrollbarsProps>> = (props) => {
  const ref = React.useRef(null);
  const isHovering = useHover(ref);

  const renderThumb = ({ style, ...props }: any) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: 'rgba(191, 193, 203, 0.5)',
      zIndex: 1,
      opacity: isHovering ? '1' : '0',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };
  return (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      autoHideTimeout={500}
      autoHideDuration={200} 
      {...props}
    > 
      <div ref={ref} style={props.style}>
        {props.children}
      </div>      
    </Scrollbars>
  );
};