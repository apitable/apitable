import * as React from 'react';
import ReactDOM from 'react-dom';
export interface IPortalProps {
  getContainer: HTMLElement;
  children?: React.ReactNode;
}

const Portal: React.FC<IPortalProps> = props => {
  const { getContainer, children } = props;

  return getContainer
    ? ReactDOM.createPortal(children, getContainer)
    : null;
};

export default Portal;