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
  // 是否计算过程中传入新的值？
  // configChildNode?: React.MutableRefObject<HTMLElement | null>;
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
    containerAdjust = false, // 如有 trigger， 以trigger 为准
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

    // 自定义滚动
    if (onScroll) {
      onScroll({ scrollTop, height: calcHeight, scrollHeight });
      return;
    }

    if (scrollTop + calcHeight > scrollHeight - 10) {
      // 屏蔽可滚动样式
      styleNode.classList.remove(scrollCls);
      styleNode.style.position = positionValue;
      return;
    }
    // 展示可滚动样式
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
      actualTop = triggerTop + offset[1];
      actualBottom = triggerBottom + offset[1];
      triggerHeight = triggerSizeHeight;
    }
    const restTopSpaceHeight = window.innerHeight - actualTop - triggerHeight;
    const restBottomSpaceHeight = window.innerHeight - actualBottom - triggerHeight;
    let restSpaceHeight = useTopSpace ? Math.max(restTopSpaceHeight, restBottomSpaceHeight) : restTopSpaceHeight;

    // 保留计算过程中传入新值的写法作为备用
    // const needCalcChild = props?.configChildNode?.current || childNode?.current;
    // if (needCalcChild) {
    //   const childEle = needCalcChild;
    if (childNode?.current) {
      const childEle = childNode.current;

      /**
       * 使用 clone 方式计算容器滚动节点的高度
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listenNode, childNode, run, cancel]);

  useLayoutEffect(() => {
    if (isMobile) return;
    onListenResize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
