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
import { useMemo } from 'react';
import { createPortal } from 'react-dom';

export interface IPortalProps {
  children: React.ReactElement;
  zIndex?: number;
  visible?: boolean;
  getContainer?: () => HTMLElement;
}

export const Portal: React.FC<React.PropsWithChildren<IPortalProps>> = ({
  children,
  zIndex,
  visible = true,
  getContainer = () => document.body,
}: IPortalProps) => {
  const container = getContainer();
  const wrapStyle = useMemo(() => {
    return { zIndex, position: 'relative' } as React.CSSProperties;
  }, [zIndex]);

  if (!visible) {
    return null;
  }
  if (container !== document.body) {
    const childProps = { ...(children.props || {}) };
    childProps.style = { ...(childProps.style || {}), zIndex };
    return createPortal(React.cloneElement(children, { ...childProps }), container);
  }
  const content = <div style={wrapStyle}>{children}</div>;
  return createPortal(content, container);
};
