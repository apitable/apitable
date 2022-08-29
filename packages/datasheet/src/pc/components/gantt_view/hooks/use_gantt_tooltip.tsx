import { useSetState } from 'pc/hooks';
import { useCallback, useMemo } from 'react';
import { ToolTip } from 'pc/components/konva_components';

interface IUseTooltip {
  isScrolling: boolean;
}

export const useTooltip = (props: IUseTooltip) => {
  const { isScrolling } = props;

  const [tooltipInfo, setTooltipInfo] = useSetState({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  });

  const clearTooltip = useCallback(() => {
    setTooltipInfo({ visible: false });
  }, [setTooltipInfo]);

  const tooltip = useMemo(() => {
    if (!tooltipInfo.visible) return null;
    if (isScrolling) {
      clearTooltip();
      return null;
    }
    const { x, y, text } = tooltipInfo;
    return (
      <ToolTip 
        x={x}
        y={y}
        text={text}
      />
    );
  }, [tooltipInfo, clearTooltip, isScrolling]);

  return useMemo(() => ({
    tooltip,
    tooltipInfo,
    setTooltipInfo,
    clearTooltip,
  }), [tooltip, tooltipInfo, setTooltipInfo, clearTooltip]);
};