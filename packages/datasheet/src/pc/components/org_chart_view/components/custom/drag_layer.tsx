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

import { useUpdateEffect } from 'ahooks';
import { FC, useContext } from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';
import { useStoreState, useZoomPanHelper } from '@apitable/react-flow';
import { RecordCard } from '../../../record_card';
import { CARD_WIDTH, DRAG_ITEM_WIDTH, COVER_HEIGHT, DragNodeType, SCROLL_SPEED, SHOW_EPMTY_COVER, SHOW_EPMTY_FIELD } from '../../constants';
import { FlowContext } from '../../context/flow_context';
import styles from './styles.module.less';

export const DragLayer: FC<React.PropsWithChildren<unknown>> = () => {
  const [translateX, translateY, scale] = useStoreState((state) => state.transform);

  const { transform } = useZoomPanHelper();

  const getItemStyles = (initialOffset: XYCoord | null, currentOffset: XYCoord | null) => {
    if (!initialOffset || !currentOffset) {
      return {
        display: 'none',
      };
    }
    const transform = `translate3d(${currentOffset.x}px, ${currentOffset.y}px, 0) scale(${scale})`;
    return {
      transform,
      transformOrigin: 'left top',
      cursor: 'grabbing',
      width: itemWidth,
      opacity: 0.8,
    };
  };

  const { isDragging, item, initialOffset, currentOffset, diffOffset } = useDragLayer((monitor: DragLayerMonitor) => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    diffOffset: monitor.getDifferenceFromInitialOffset(),
  }));

  const { orgChartStyle, bodySize, offsetLeft, offsetTop, columns, orgChartViewStatus, datasheetId } = useContext(FlowContext);

  const { settingPanelVisible, settingPanelWidth, rightPanelWidth, rightPanelVisible } = orgChartViewStatus;

  const { coverFieldId } = orgChartStyle;

  const _scale = item?.type === DragNodeType.RENDER_NODE ? scale : 1;
  const itemHeight = item?.type === DragNodeType.RENDER_NODE ? item.data.height * _scale : 32;
  const itemWidth = item?.type === DragNodeType.RENDER_NODE ? CARD_WIDTH * _scale : DRAG_ITEM_WIDTH;

  const overflowX = (currentOffset: XYCoord) => {
    // When the right sidebar is open, scrolling is not allowed
    if (settingPanelVisible && currentOffset.x + itemWidth >= bodySize.width - settingPanelWidth) {
      return false;
    }

    if (rightPanelVisible && currentOffset.x + itemWidth >= bodySize.width - rightPanelWidth) {
      return false;
    }

    return currentOffset!.x < offsetLeft || currentOffset.x + itemWidth + 32 > bodySize.width!;
  };

  const overflowY = (currentOffset: XYCoord) => {
    return currentOffset!.y < offsetTop || currentOffset.y + itemHeight > bodySize.height!;
  };

  useUpdateEffect(() => {
    if (!currentOffset || !initialOffset || !diffOffset || !item) {
      return;
    }

    if (!(item.type === DragNodeType.OTHER_NODE || item.type === DragNodeType.RENDER_NODE)) {
      return;
    }

    const horizontalDir = diffOffset.x > 0 ? 1 : diffOffset.x < 0 ? -1 : 0;
    const verticalDir = diffOffset.y > 0 ? 1 : diffOffset.y < 0 ? -1 : 0;

    let rafId: number | null = null;

    if (overflowX(currentOffset)) {
      rafId = requestAnimationFrame(() =>
        transform({
          x: translateX - horizontalDir * SCROLL_SPEED,
          y: translateY,
          zoom: scale,
        }),
      );
    } else if (overflowY(currentOffset)) {
      rafId = requestAnimationFrame(() =>
        transform({
          x: translateX,
          y: translateY - verticalDir * SCROLL_SPEED,
          zoom: scale,
        }),
      );
    }
    return () => {
      rafId && cancelAnimationFrame(rafId);
    };
  });

  if (!isDragging || !item || item.type !== DragNodeType.RENDER_NODE) {
    return null;
  }

  return (
    <div className={styles.layer}>
      <div
        style={{
          ...getItemStyles(initialOffset, currentOffset),
        }}
      >
        <RecordCard
          datasheetId={datasheetId}
          className={styles.draggingCard}
          showEmptyCover={SHOW_EPMTY_COVER}
          coverFieldId={coverFieldId}
          showEmptyField={SHOW_EPMTY_FIELD}
          multiTextMaxLine={4}
          coverHeight={COVER_HEIGHT}
          cardWidth={CARD_WIDTH}
          isCoverFit={false}
          isColNameVisible
          recordId={item.id}
          visibleFields={columns}
        />
      </div>
    </div>
  );
};
