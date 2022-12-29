import { FancyTooltip } from 'pc/components/kanban_view';
import { useCallback, useMemo, useState } from 'react';

interface IUseScrollbarTipProps {
  horizontalBarRef: React.RefObject<HTMLDivElement>;
  totalWidth: number;
  containerWidth: number;
}

export const useScrollbarTip = (props: IUseScrollbarTipProps) => {
  const {
    horizontalBarRef,
    totalWidth,
    containerWidth
  } = props;

  const [tooltipOffsetX, setTooltipOffsetX] = useState(0);

  const isHorizontalScroll = useMemo(() => {
    if (!horizontalBarRef.current) return false;
    return totalWidth > horizontalBarRef.current?.clientWidth;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalWidth, containerWidth, horizontalBarRef.current]);

  const onMouseEnter = useCallback(e => {
    if (!isHorizontalScroll) return;
    const target = e.currentTarget as HTMLDivElement;
    const rate = target.clientWidth / target.scrollWidth;
    const scrollBarLen = rate * target.clientWidth;
    const scrollLeft = target.scrollLeft;
    const left = target.getBoundingClientRect().left;
    setTooltipOffsetX(left + scrollLeft * rate + scrollBarLen / 2);
  }, [isHorizontalScroll]);

  const clearTooltip = useCallback(() => {
    if (tooltipOffsetX !== 0) {
      setTooltipOffsetX(0);
    }
  }, [tooltipOffsetX]);

  const tooltip: React.ReactNode = useMemo(() => {
    if (isHorizontalScroll && tooltipOffsetX !== 0) {
      return <FancyTooltip left={tooltipOffsetX} />;
    }
    return null;
  }, [tooltipOffsetX, isHorizontalScroll]);

  return useMemo(() => ({
    tooltip,
    clearTooltip,
    onMouseEnter,
  }), [clearTooltip, onMouseEnter, tooltip]);
};