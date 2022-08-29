import { FC, useRef } from 'react';
import { ScrollBarType } from '../../interfaces';

import styles from './styles.module.less';
import { useScrollEvents } from './use_scroll_events';

import classNames from 'classnames';

export interface IScrollBarProps {
  type: ScrollBarType;
}

export const ScrollBar: FC<IScrollBarProps> = ({
  type,
}) => {

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    scrollHandler,
    contentSize,
  } = useScrollEvents(type, containerRef);

  const isHorizontal = type === ScrollBarType.Horizontal;
  const scrollWrapperSize = 16;

  return (
    <div
      className={classNames({
        [styles.scrollBarWrap]: isHorizontal,
        [styles.scrollBarVWrap]: !isHorizontal,
      })}
      ref={containerRef}
      onScroll={scrollHandler}
      style={{
        width: isHorizontal ? '100%' : scrollWrapperSize,
        height: isHorizontal ? scrollWrapperSize : '100%',
      }}
    >
      <div
        style={{
          width: isHorizontal ? contentSize : scrollWrapperSize,
          height: isHorizontal ? scrollWrapperSize : contentSize,
        }}
      />
    </div>
  );
};
