import { useMount, useRafInterval, useUnmount } from 'ahooks';
import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface IPortalProps {
  getContainer: () => HTMLElement;
  children: () => React.ReactNode;
}

const MAX_AGE = 10000;

/**
 * 特殊 Portal：一开始容器元素不存在，会一直查找，找到后挂载上去就结束
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
