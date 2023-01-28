/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { clamp } from 'lodash';
import { useThrottleFn, configResponsive, useResponsive } from 'ahooks';

export interface IUseListenTriggerInfo {
  triggerSize: DOMRect;
  triggerOffset: number[];
  adjust: boolean;
}

interface IUseListenVisualHeightProps {
  listenNode: React.MutableRefObject<HTMLElement | null>;
  childNode?: React.MutableRefObject<HTMLElement | null>;
  minHeight: number;
  maxHeight: number;
  triggerInfo?: IUseListenTriggerInfo;
  containerAdjust?: boolean;
  showScrollColor?: boolean;
  showOnParent?: boolean;
  position?: 'absolute' | 'sticky' | 'fixed' | 'relative-absolute';
  useTopSpace?: boolean;
  onScroll?: (props: { scrollTop: number; height: number; scrollHeight: number }) => void;
  subOffsetY?: number;
}

export interface IConfig {
  configMaxHeight?: number;
  configTriggerInfo?: IUseListenTriggerInfo;
}

export function useListenVisualHeight(props: IUseListenVisualHeightProps) {
  configResponsive({
    middle: 768,
  });
  const responsive = useResponsive();
  const isMobile = !responsive.middle;
  const {
    listenNode,
    childNode,
    minHeight,
    maxHeight,
    triggerInfo,
    containerAdjust = false, // Trigger, if any, takes preferred
    showScrollColor = true,
    showOnParent = true,
    position = 'absolute',
    useTopSpace = false,
    onScroll,
    subOffsetY = 12,
  } = props;
  const [height, setHeight] = useState<number | string>();
  // const [cacheHeight, setCacheHeight] = useState<number>();

  const toggleScorllColor = (scrollEle: HTMLElement, height?: number | string) => {
    if (!scrollEle) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollEle;

    const styleNode = showOnParent ? (scrollEle.parentElement || scrollEle) : scrollEle;
    const positionValue = position.includes('relative') ? 'relative' : position;
    const scrollCls = `scroll-color-${position}`;
    // height === 'auto'
    if (typeof height === 'string') {
      if (onScroll) {
        onScroll({ scrollTop, height: clientHeight, scrollHeight });
        return;
      }
      styleNode.classList.remove(scrollCls);
      styleNode.style.position = positionValue;
      return;
    }

    const calcHeight = height || clientHeight;

    // Custom scroll
    if (onScroll) {
      onScroll({ scrollTop, height: calcHeight, scrollHeight });
      return;
    }

    if (scrollTop + calcHeight > scrollHeight - 10) {
      // Hidden scrollable styles
      styleNode.classList.remove(scrollCls);
      styleNode.style.position = positionValue;
      return;
    }
    // Show scrollable styles
    if (styleNode.classList.contains(scrollCls)) {
      return;
    }
    styleNode.classList.add(scrollCls);
  };

  const onListenResize = (props?: IConfig) => {
    const ele = listenNode.current;
    if (!ele) {
      return;
    }
    const { top } = ele.getBoundingClientRect();
    const containerScrollHeight = ele.scrollHeight;
    let actualTop = top, actualBottom = 0, offset = [0, 0], adjust = containerAdjust, triggerHeight = 0,
        actualMaxHeight = maxHeight;
    if (props?.configMaxHeight) {
      actualMaxHeight = props.configMaxHeight;
    }
    if (triggerInfo || (props && props.configTriggerInfo !== undefined)) {
      const { triggerSize, triggerOffset, adjust: triggerAdjust } = triggerInfo || (props!.configTriggerInfo as IUseListenTriggerInfo);
      const { top: triggerTop, height: triggerSizeHeight, bottom: triggerBottom } = triggerSize;
      offset = triggerOffset;
      adjust = triggerAdjust;
      actualTop = triggerTop + offset[1]!;
      actualBottom = triggerBottom + offset[1]!;
      triggerHeight = triggerSizeHeight;
    }
    const restTopSpaceHeight = window.innerHeight - actualTop - triggerHeight;
    const restBottomSpaceHeight = window.innerHeight - actualBottom - triggerHeight;
    let restSpaceHeight = useTopSpace ? Math.max(restTopSpaceHeight, restBottomSpaceHeight) : restTopSpaceHeight;

    if (childNode?.current) {
      const childEle = childNode.current;

      /**
       * Use clone method to calculate the height of container roll node
       */
      const cloneNode = ele.cloneNode(true) as HTMLElement;
      const childList = Array.from(ele.childNodes);
      const index = childList.findIndex((v) => v === childEle || v.contains(childEle));
      cloneNode.style.cssText = 'height: auto !important; overflow: unset !important;';
      document.body.appendChild(cloneNode);
      let restChildTotalHeight = 0;
      if (index > -1) {
        const replaceNode = cloneNode.childNodes.item(index) as HTMLElement;
        replaceNode.style.cssText = 'height: auto !important; overflow: unset !important;';
        restChildTotalHeight = cloneNode.scrollHeight - replaceNode.scrollHeight;
      }

      if (adjust && childEle.scrollHeight > restSpaceHeight - restChildTotalHeight) {
        restSpaceHeight = window.innerHeight;
      }

      let restPutHeight = restSpaceHeight - restChildTotalHeight;
      restPutHeight = clamp(restPutHeight, minHeight, actualMaxHeight);
      const resultChildHeight =
        childEle.scrollHeight < restPutHeight ?
          'auto' :
          restPutHeight - subOffsetY;

      toggleScorllColor(childEle, resultChildHeight);
      setHeight(resultChildHeight);
      document.body.removeChild(cloneNode);
      return;
    }

    if (adjust && containerScrollHeight > restSpaceHeight) {
      restSpaceHeight = window.innerHeight;
    }

    let resultContainerHeight: string | number = clamp(restSpaceHeight, minHeight, actualMaxHeight);

    if (containerScrollHeight < resultContainerHeight) {
      resultContainerHeight = 'auto';
    } else {
      resultContainerHeight -= subOffsetY;
    }
    toggleScorllColor(ele, resultContainerHeight);
    setHeight(resultContainerHeight);
  };

  const { run, cancel } = useThrottleFn(onListenResize, { wait: 150 });

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('resize', () => run());
    const scrollNode = childNode || listenNode;
    const scrollELe = scrollNode.current;
    if (scrollELe && showScrollColor) {
      scrollELe.addEventListener('scroll', () => toggleScorllColor(scrollELe));
    }
    return () => {
      window.removeEventListener('resize', cancel);
      if (scrollELe) {
        scrollELe.removeEventListener('scroll', () => toggleScorllColor(scrollELe));
      }
    };
  // eslint-disable-next-line
  }, [listenNode, childNode, run, cancel]);

  useLayoutEffect(() => {
    if (isMobile) return;
    onListenResize();
  // eslint-disable-next-line
  }, []);

  const style: React.CSSProperties = {};
  if (height) {
    style.height = height;
  }

  if (isMobile) {
    return {
      style: undefined,
      onListenResize: () => {},
    };
  }

  return { style, onListenResize };
}
