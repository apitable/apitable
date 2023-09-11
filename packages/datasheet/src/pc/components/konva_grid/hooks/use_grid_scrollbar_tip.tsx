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

import { useCallback, useMemo, useState } from 'react';
import { FancyTooltip } from 'pc/components/kanban_view';

interface IUseScrollbarTipProps {
  horizontalBarRef: React.RefObject<HTMLDivElement>;
  totalWidth: number;
  containerWidth: number;
}

export const useScrollbarTip = (props: IUseScrollbarTipProps) => {
  const { horizontalBarRef, totalWidth, containerWidth } = props;

  const [tooltipOffsetX, setTooltipOffsetX] = useState(0);

  const isHorizontalScroll = useMemo(() => {
    if (!horizontalBarRef.current) return false;
    return totalWidth > horizontalBarRef.current?.clientWidth;
    // eslint-disable-next-line
  }, [totalWidth, containerWidth, horizontalBarRef.current]);

  const onMouseEnter = useCallback(
    (e: any) => {
      if (!isHorizontalScroll) return;
      const target = e.currentTarget as HTMLDivElement;
      const rate = target.clientWidth / target.scrollWidth;
      const scrollBarLen = rate * target.clientWidth;
      const scrollLeft = target.scrollLeft;
      const left = target.getBoundingClientRect().left;
      setTooltipOffsetX(left + scrollLeft * rate + scrollBarLen / 2);
    },
    [isHorizontalScroll],
  );

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

  return useMemo(
    () => ({
      tooltip,
      clearTooltip,
      onMouseEnter,
    }),
    [clearTooltip, onMouseEnter, tooltip],
  );
};
