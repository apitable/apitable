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

import { useCallback, useMemo } from 'react';
import { ToolTip } from 'pc/components/konva_components';
import { useSetState } from 'pc/hooks';

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
    pointerDirection: '',
    pointerWidth: 0,
    pointerHeight: 0,
    background: undefined,
    fill: undefined,
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
    const { x, y, text, pointerDirection, pointerWidth, pointerHeight, background, fill } = tooltipInfo;
    return (
      <ToolTip
        x={x}
        y={y}
        text={text}
        pointerDirection={pointerDirection}
        pointerWidth={pointerWidth}
        pointerHeight={pointerHeight}
        background={background}
        fill={fill}
      />
    );
  }, [tooltipInfo, clearTooltip, isScrolling]);

  return useMemo(
    () => ({
      tooltip,
      tooltipInfo,
      setTooltipInfo,
      clearTooltip,
    }),
    [tooltip, tooltipInfo, setTooltipInfo, clearTooltip],
  );
};
