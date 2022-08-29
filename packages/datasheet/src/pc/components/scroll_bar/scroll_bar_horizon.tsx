import { useState } from 'react';
import * as React from 'react';
import { useScrollBar } from './use_scroll_bar';
import styles from './style.module.less';
import { IScrollBarProps, ScrollBarDirection, IScrollBarHorizon } from './scroll_bar.interface';
import { isMobile } from 'react-device-detect';
import { Tooltip } from 'antd';
import { Strings, t } from '@vikadata/core';
import { usePrevious } from 'ahooks';

export const ScrollBarHorizon: React.FC<IScrollBarProps & IScrollBarHorizon> = props => {
  const { gridVisibleLength, dataTotalLength, scrollAreaLength, scrollLeft } = props;
  const { scrollbarRef, slideRef, minScrollBarSize, handleMouseDown, calcSlideOffset } =
    useScrollBar({ ...props, scrollBarOffset: scrollLeft, direction: ScrollBarDirection.Horizon });
  const prevLeft = usePrevious(scrollLeft);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  // useEffect(() => {
  //   if (prevLeft !== scrollLeft) {
  //     setTooltipVisible(false);
  //   } else {
  //     setTooltipVisible(true);
  //   }
  // }, [prevLeft])

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
          className={styles.scrollBarHBox}
          style={{ width: (gridVisibleLength) }}
          ref={scrollbarRef}
          onMouseEnter={() => prevLeft === scrollLeft && setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <div className={styles.scrollBarH}>
            <Tooltip title={t(Strings.tip_shift_scroll)} visible={tooltipVisible} >
              <div
                className={styles.scrollBarHSlide}
                onMouseDown={e => handleMouseDown(e)}
                style={{
                  ...style,
                  ...({ minWidth: minScrollBarSize }),
                }}
                ref={slideRef}
              />
            </Tooltip>
          </div>
        </div>
      ) : <></>
  );
};
