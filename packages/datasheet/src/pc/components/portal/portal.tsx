import * as React from 'react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';

export interface IPortalProps {
  children: React.ReactElement;
  zIndex?: number;
  visible?: boolean;
  getContainer?: () => HTMLElement;
}

export const Portal: React.FC<IPortalProps> = ({
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
  const content = (
    <div style={wrapStyle}>
      {children}
    </div>
  );
  return createPortal(content, container);
};
