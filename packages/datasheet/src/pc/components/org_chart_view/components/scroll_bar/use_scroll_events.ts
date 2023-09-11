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

import { useContext, useLayoutEffect } from 'react';
import { useStoreState, useZoomPanHelper } from '@apitable/react-flow';
import { CARD_WIDTH, BOUNDS_PADDING } from '../../constants';
import { FlowContext } from '../../context/flow_context';
import { ScrollBarType } from '../../interfaces';

export const useScrollEvents = (direction: ScrollBarType, containerRef: React.RefObject<HTMLDivElement>) => {
  const { bounds, offsetLeft, offsetTop, bodySize, orgChartViewStatus } = useContext(FlowContext);

  const { settingPanelVisible, settingPanelWidth, rightPanelWidth, rightPanelVisible } = orgChartViewStatus;

  const [translateX, translateY, scale] = useStoreState((state) => state.transform);

  const { transform } = useZoomPanHelper();

  const { left, top, right, bottom } = bounds;

  // Coordinate conversion: Convert graph coordinate system to container coordinate system
  const leftInContainer = left * scale + translateX;
  const rightInContainer = right * scale + translateX + CARD_WIDTH * scale;

  const topInContainer = top * scale + translateY;
  const bottomInContainer = bottom * scale + translateY;

  const graphWidth = rightInContainer - leftInContainer;
  const graphHeight = bottomInContainer - topInContainer;

  const getContainerWidth = () => {
    let width = bodySize.width - offsetLeft;
    if (rightPanelVisible) {
      width -= rightPanelWidth;
    } else if (settingPanelVisible) {
      width -= settingPanelWidth;
    }

    return width;
  };
  const containerWidth = getContainerWidth();
  const containerHeight = bodySize.height - offsetTop;

  const contentWidth = graphWidth + containerWidth * 2 - BOUNDS_PADDING * 2;
  const contentHeight = graphHeight + containerHeight * 2 - BOUNDS_PADDING * 2;

  const translateXMin = -graphWidth + BOUNDS_PADDING - left * scale;
  const translateXMax = containerWidth - BOUNDS_PADDING - left * scale;

  const translateYMin = -graphHeight + BOUNDS_PADDING - top * scale;
  const translateYMax = containerHeight - BOUNDS_PADDING - top * scale;

  useLayoutEffect(() => {
    if (direction === ScrollBarType.Horizontal) {
      // The distance of the left boundary of the graph from the right boundary of the container
      const scrollLeft = containerWidth - leftInContainer - BOUNDS_PADDING;
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: scrollLeft,
        });
      }
      return;
    }

    // Distance of the upper boundary of the graph from the lower boundary of the container
    const scrollTop = containerHeight - topInContainer - BOUNDS_PADDING;
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: scrollTop,
      });
    }
    // eslint-disable-next-line
  }, [containerWidth, leftInContainer, containerHeight, topInContainer]);

  const isOutBounds = () => {
    return translateX < translateXMin || translateX > translateXMax || translateY < translateYMin || translateY > translateYMax;
  };

  useLayoutEffect(() => {
    if (isOutBounds()) {
      let _translateX = translateX;
      let _translateY = translateY;

      if (translateX < translateXMin) {
        _translateX = translateXMin;
      }
      if (translateX > translateXMax) {
        _translateX = translateXMax;
      }

      if (translateY < translateYMin) {
        _translateY = translateYMin;
      }
      if (translateY > translateYMax) {
        _translateY = translateYMax;
      }
      transform({
        x: _translateX,
        y: _translateY,
        zoom: scale,
      });
    }

    // eslint-disable-next-line
  }, [translateX, translateY, scale]);

  const scrollHandler = (e: any) => {
    if (direction === ScrollBarType.Horizontal) {
      const _scrollLeft = e.currentTarget.scrollLeft;
      const initialTranslateX = containerWidth - left * scale;

      transform({
        x: initialTranslateX - _scrollLeft - BOUNDS_PADDING,
        y: translateY,
        zoom: scale,
      });
      return;
    }

    const _scrollTop = e.currentTarget.scrollTop;
    const initialTranslateY = containerHeight - top * scale;
    transform({
      y: initialTranslateY - _scrollTop - BOUNDS_PADDING,
      x: translateX,
      zoom: scale,
    });
  };

  return {
    scrollHandler,
    contentSize: direction === ScrollBarType.Horizontal ? contentWidth : contentHeight,
  };
};
