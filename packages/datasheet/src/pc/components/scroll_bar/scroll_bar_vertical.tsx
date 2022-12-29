import * as React from 'react';
import { useScrollBar } from './use_scroll_bar';
import styles from './style.module.less';
import { IScrollBarProps, ScrollBarDirection, IScrollBarVertical } from './scroll_bar.interface';
import { isMobile } from 'react-device-detect';

export const ScrollBarVertical: React.FC<IScrollBarProps & IScrollBarVertical> = props => {
  const { gridVisibleLength, dataTotalLength, scrollAreaLength, scrollTop } = props;
  const { scrollbarRef, slideRef, minScrollBarSize, handleMouseDown, calcSlideOffset } =
    useScrollBar({ ...props, scrollBarOffset: scrollTop, direction: ScrollBarDirection.Vertical });

  if (isMobile) {
    return null;
  }

  const style = (() => {
    if (!slideRef.current) {
      return;
    }
    return calcSlideOffset();
  })();

  return (
    dataTotalLength > scrollAreaLength ?
      (
        <div
          className={styles.scrollBarVBox}
          style={{ height: (gridVisibleLength) }}
          ref={scrollbarRef}
        >
          <div className={styles.scrollBarV}>
            <div
              className={styles.scrollBarVSlide}
              onMouseDown={e => handleMouseDown(e)}
              style={{
                ...style,
                ...({ minHeight: minScrollBarSize }),
              }}
              ref={slideRef}
            />
          </div>
        </div>
      ) : <></>
  );
};
