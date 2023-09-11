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

import { useMount, useRafInterval, useUnmount } from 'ahooks';
import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface IPortalProps {
  getContainer: () => HTMLElement;
  children: () => React.ReactNode;
}

const MAX_AGE = 10000;

/**
 *  * Special Portal: at first the container element does not exist, it will keep looking for it, and when it is found it will be mounted and finished
 */
export const Portal: FC<React.PropsWithChildren<IPortalProps>> = ({ getContainer, children }) => {
  const [container, setContainer] = useState(() => getContainer());

  const clear = useRafInterval(() => {
    setContainer(getContainer());
  }, 200);

  useEffect(() => {
    container && clear();
  }, [container, clear]);

  useMount(() => {
    setTimeout(() => {
      clear();
    }, MAX_AGE);
  });
  useUnmount(() => {
    clear();
  });

  let portal: JSX.Element | null = null;
  if (container) {
    portal = createPortal(children(), container);
  }

  return portal;
};
