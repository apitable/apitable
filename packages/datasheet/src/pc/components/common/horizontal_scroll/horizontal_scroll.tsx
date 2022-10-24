import { FC, useRef, useEffect, useState } from 'react';
import * as React from 'react';
import LeftScrollIcon from 'static/icon/workbench/workbench_tab_arrow_left.svg';
import RightScrollIcon from 'static/icon/workbench/workbench_tab_arrow_right.svg';
import { useThemeColors } from '@vikadata/components';
import styles from './style.module.less';
import { ConfigConstant } from '@apitable/core';

export const HorizontalScroll: FC = props => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollMax, setScrollMax] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const breadCrumbRef = useRef<HTMLDivElement>(null);
  const breadcrumbWidth = breadCrumbRef.current && breadCrumbRef.current.getBoundingClientRect().width;
  const colors = useThemeColors();
  useEffect(() => {
    if (!breadcrumbWidth || !wrapperRef.current) {
      return;
    }
    const wrapperWidth = wrapperRef.current.getBoundingClientRect().width;
    const dist = breadcrumbWidth - wrapperWidth;
    if (dist > 0) {
      setScrollMax(dist);
      setScrollLeft(-dist);
    } else {
      setScrollMax(0);
      setScrollLeft(0);
    }
  }, [breadcrumbWidth]);

  const leftClick = (val: number) => {
    let newScrollLeft = scrollLeft + val;
    if (newScrollLeft > 0) {
      newScrollLeft = 0;
    }
    setScrollLeft(newScrollLeft);
  };

  const rightClick = (val: number) => {
    let newScrollLeft = scrollLeft + val;
    if (newScrollLeft < -scrollMax) {
      newScrollLeft = -scrollMax;
    }
    setScrollLeft(newScrollLeft);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaX > 0) {
      rightClick(-e.deltaX);
      return;
    }
    if (e.deltaX < 0) {
      leftClick(-e.deltaX);
    }
  };

  return (
    <div className={styles.breadCrumbWrapper}>
      <div className={styles.scrollWrapper} ref={wrapperRef}>
        <div
          className={styles.beadCrumb}
          ref={breadCrumbRef}
          style={{ left: scrollLeft }}
          onWheel={handleWheel}
        >
          {props.children}
        </div>
      </div>
      <div
        className={styles.leftScrollIcon}
        style={{ display: scrollLeft && scrollMax ? 'flex' : 'none' }}
        onClick={() => leftClick(ConfigConstant.BREAD_CRUMB_SCROLL_DIST)}
      >
        <LeftScrollIcon width={12} height={12} fill={colors.primaryColor} />
      </div>
      <div
        className={styles.rightScrollIcon}
        style={{ display: scrollLeft !== -scrollMax && scrollMax ? 'flex' : 'none' }}
        onClick={() => rightClick(-ConfigConstant.BREAD_CRUMB_SCROLL_DIST)}
      >
        <RightScrollIcon width={12} height={12} fill={colors.primaryColor} />
      </div>
    </div>
  );
};
