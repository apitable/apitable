import { Selectors } from '@vikadata/core';
import { useThemeColors } from '@vikadata/components';
import { FC, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import LeftScrollIcon from 'static/icon/workbench/workbench_tab_arrow_left.svg';
import RightScrollIcon from 'static/icon/workbench/workbench_tab_arrow_right.svg';
import styles from './style.module.less';

function calcEveryItemWidth(elements: HTMLCollection) {
  return Array.from(elements).map(item => {
    return item.clientWidth;
  });
}

function calcScrollLeft(activeIndex: number, elementsWidth: number[]) {
  return elementsWidth.reduce((left, width, index) => {
    if (index >= activeIndex) return left;
    return left += width;
  }, 0);
}

interface IGlobalRef {
  id: null | number;
  preventCalcScrollOffset: boolean;
}

const HorizontalScrollBase: FC<{
  activeViewId: string | undefined;
  children: any;
  dragViewId: string;
  editIndex: number | null | undefined;
  onTabItemClick(e: React.MouseEvent): void
}> = props => {
  const { dragViewId, activeViewId, children, editIndex, onTabItemClick } = props;
  const [scrollMax, setScrollMax] = useState(0);
  const snapshot = useSelector(state => Selectors.getSnapshot(state));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const globalRef = useRef<IGlobalRef>({ id: null, preventCalcScrollOffset: false });
  const colors = useThemeColors();
  function calcScrollOffset() {
    const elementsWidth = calcEveryItemWidth(scrollRef.current!.children[0]!.children);
    const scrollWidth = elementsWidth.reduce((pre, cur) => pre + cur, 0);
    const wrapperWidth = scrollRef.current!.clientWidth;
    const dist = scrollWidth - wrapperWidth;
    if (dist > 0) {
      setScrollMax(dist);
      const num = snapshot!.meta.views.findIndex(item => item.id === activeViewId);
      const newLeft = num === 0 ? 0 : calcScrollLeft(num, elementsWidth);
      if (newLeft < wrapperWidth - 30 || newLeft < 0) {
        return undefined;
      }
      if (newLeft > dist) {
        return dist;
      }
      return newLeft === 0 ? undefined : newLeft;
    }
    return 0;

  }

  useEffect(() => {
    if (window.hasOwnProperty('ResizeObserver')) {
      const observe = new ResizeObserver(() => {
        const offset = calcScrollOffset();
        if (offset === 0) {
          setScrollMax(0);
          setScrollLeft(0);
          scrollRef.current!.scrollLeft = 0;
        }
      });
      observe.observe(scrollRef.current!);
      return () => {
        observe.disconnect();
      };
    }
    const offset = calcScrollOffset();
    if (offset === 0) {
      setScrollMax(0);
      setScrollLeft(0);
      scrollRef.current!.scrollLeft = 0;
    }
    return () => { return; };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editIndex, snapshot && snapshot.meta.views]);

  useEffect(() => {
    if (globalRef.current.preventCalcScrollOffset) {
      globalRef.current.preventCalcScrollOffset = false;
      return;
    }
    const offset = calcScrollOffset();
    if (offset === undefined) {
      setScrollLeft(0);
      scrollRef.current!.scrollLeft = 0;
      return;
    }
    setScrollLeft(offset);
    scrollRef.current!.scrollLeft = offset;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeViewId]);

  const leftClick = () => {
    let id;
    function animation(distance: number) {
      cancelAnimationFrame(id);
      if (distance <= 0) {
        setScrollLeft(scrollRef.current!.scrollLeft);
        return;
      }
      if (scrollRef.current!.scrollLeft <= 0) {
        setScrollLeft(0);
        scrollRef.current!.scrollLeft = 0;
        return;
      }
      scrollRef.current!.scrollLeft -= 50;
      id = requestAnimationFrame(() => { animation(distance -= 50); });
    }
    animation(scrollRef.current!.clientWidth);
  };

  const rightClick = () => {
    let id;
    function animation(distance: number) {
      cancelAnimationFrame(id);
      if (distance <= 0) {
        setScrollLeft(scrollRef.current!.scrollLeft);
        return;
      }
      if (scrollRef.current!.scrollLeft >= scrollMax) {
        setScrollLeft(scrollMax);
        scrollRef.current!.scrollLeft = scrollMax;
        return;
      }
      scrollRef.current!.scrollLeft += 50;
      id = requestAnimationFrame(() => { animation(distance -= 50); });
    }
    animation(scrollRef.current!.clientWidth);
  };

  const handleScroll = () => {
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  function autoScroll(direction: 'left' | 'right') {
    if (direction === 'left') {
      if (scrollRef.current!.scrollLeft <= 0) {
        setScrollLeft(0);
        scrollRef.current!.scrollLeft = 0;
        return;
      }
      scrollRef.current!.scrollLeft -= 5;
    }
    if (direction === 'right') {
      if (scrollRef.current!.scrollLeft >= scrollMax) {
        setScrollLeft(scrollMax);
        scrollRef.current!.scrollLeft = scrollMax;
        return;
      }
      scrollRef.current!.scrollLeft += 5;
    }
    globalRef.current.id = window.requestAnimationFrame(() => {
      autoScroll(direction);
    });
  }

  function mouseMove(e: React.MouseEvent) {
    if (globalRef.current.id) {
      cancelAnimationFrame(globalRef.current.id);
    }
    if (!dragViewId) return;
    if (!scrollMax) { return; }
    if (!scrollRef.current) return;
    const reg = scrollRef.current.getBoundingClientRect();
    const startPoint = reg.left;
    const endPoint = reg.right;
    const mousePageX = e.pageX;
    if (mousePageX > startPoint && mousePageX < startPoint + 50 && scrollLeft > 0) {
      autoScroll('left');
      return;
    }
    if (mousePageX < endPoint && mousePageX > endPoint - 50 && scrollLeft < scrollMax) {
      autoScroll('right');
      return;
    }
  }

  function clickTabItem(e: React.MouseEvent) {
    globalRef.current.preventCalcScrollOffset = true;
    onTabItemClick(e);
  }

  return (
    <div className={styles.tabScrollWrapper} onClick={clickTabItem}>
      <div
        className={styles.scrollWrapper}
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseMove={mouseMove}
      >
        <div className={styles.scrollBase} data-test-id="tabList">
          {children}
        </div>
      </div>
      <div
        className={styles.leftScrollIcon}
        style={{ display: scrollLeft && scrollMax ? 'flex' : 'none' }}
        onClick={() => leftClick()}
      >
        <LeftScrollIcon width={12} height={12} fill={colors.primaryColor} />
      </div>
      <div
        className={styles.rightScrollIcon}
        style={{ display: scrollLeft !== scrollMax && scrollMax ? 'flex' : 'none' }}
        onClick={() => rightClick()}
      >
        <RightScrollIcon width={12} height={12} fill={colors.primaryColor} />
      </div>
    </div>
  );
};

export const HorizontalScroll = React.memo(HorizontalScrollBase, shallowEqual);
