import * as React from 'react';
import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { stopPropagation } from 'pc/utils/dom';
import { KeyCode } from 'pc/utils/keycode';
import styles from './style.module.less';

export const PcWrapper: React.FC<{ children: ReactElement; hidePanel(e: any): void }> = ({ children, hidePanel }) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === KeyCode.Esc) {
      hidePanel(e);
    }
  };

  const onClickPortalContainer = (e: React.MouseEvent<HTMLDivElement>) => {
    stopPropagation(e);
    if (e.target === e.currentTarget) {
      hidePanel(e);
    }
  };

  return ReactDOM.createPortal(
    <div
      onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
      onWheel={stopPropagation}
      onClick={onClickPortalContainer}
      className={styles.portalContainer}
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>,
    document.body,
  );
};
