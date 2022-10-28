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
export const Portal: FC<IPortalProps> = ({ getContainer, children }) => {
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
    portal = createPortal(
      children(),
      container,
    );
  }

  return portal;
};
