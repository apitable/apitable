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

import dynamic from 'next/dynamic';
import * as React from 'react';
import { useContext, useMemo } from 'react';
import { DateUnitType, KONVA_DATASHEET_ID } from '@apitable/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@apitable/icons';
import { getStyleConfig } from 'pc/common/style_config';
import { GANTT_MONTH_TIMELINE_HEIGHT, GANTT_TAB_BAR_HEIGHT, GANTT_TIMELINE_HEIGHT, GanttCoordinate, PointPosition } from 'pc/components/gantt_view';

import { Icon } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';

const Button = dynamic(() => import('pc/components/gantt_view/group/button'), { ssr: false });
// Icon Path
const ChevronLeftOutlinedPath = ChevronLeftOutlined.toString();
const ChevronRightOutlinedPath = ChevronRightOutlined.toString();

interface IUseButtonProps {
  instance: GanttCoordinate;
  pointPosition: PointPosition;
  columnStartIndex: number;
  columnStopIndex: number;
}

export const useButton = (props: IUseButtonProps) => {
  const { instance, pointPosition, columnStartIndex, columnStopIndex } = props;

  const { todayIndex, containerWidth, dateUnitType } = instance;
  const { realTargetName: pointRealTargetName } = pointPosition;
  const { isMobile: _isMobile, isTouchDevice, theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const isMobile = _isMobile || isTouchDevice;

  /**
   * Draw the "Return to current time" button
   */
  const backToNowButton = useMemo(() => {
    if (todayIndex > columnStartIndex && todayIndex < columnStopIndex) return null;

    const btnWidth = 68;
    const btnHeight = 24;
    const radius = 8;
    const cornerRadius = todayIndex <= columnStartIndex ? [radius, radius, radius, 0] : [radius, radius, 0, radius];
    const marginRight = isMobile ? 90 + getStyleConfig('gantt_mobile_unit_select_width') : 180;

    return (
      <Button
        containerWidth={containerWidth}
        marginRight={marginRight}
        btnHeight={btnHeight}
        KONVA_DATASHEET_ID={KONVA_DATASHEET_ID}
        btnWidth={btnWidth}
        colors={colors}
        cornerRadius={cornerRadius}
      />
    );
  }, [colors, columnStartIndex, columnStopIndex, containerWidth, isMobile, todayIndex]);

  /**
   * Draw "Previous" and "Next" buttons
   */
  const isHoverLeft = pointRealTargetName === KONVA_DATASHEET_ID.GANTT_PREV_PAGE_BUTTON;
  const isHoverRight = pointRealTargetName === KONVA_DATASHEET_ID.GANTT_NEXT_PAGE_BUTTON;
  const skipButtons = useMemo(() => {
    const skipButtons: React.ReactNode[] = [];
    const isMonthly = [DateUnitType.Month, DateUnitType.Week].includes(dateUnitType);
    const timelineHeight = isMonthly ? GANTT_MONTH_TIMELINE_HEIGHT : GANTT_TIMELINE_HEIGHT;

    skipButtons.push(
      <Icon
        key={'prev-page-button'}
        name={KONVA_DATASHEET_ID.GANTT_PREV_PAGE_BUTTON}
        y={GANTT_TAB_BAR_HEIGHT + 1}
        data={ChevronLeftOutlinedPath}
        fill={isHoverLeft ? colors.primaryColor : colors.thirdLevelText}
        backgroundWidth={timelineHeight}
        backgroundHeight={timelineHeight - 1}
        background={colors.white}
      />,
    );
    skipButtons.push(
      <Icon
        key={'next-page-button'}
        name={KONVA_DATASHEET_ID.GANTT_NEXT_PAGE_BUTTON}
        x={containerWidth - 32}
        y={GANTT_TAB_BAR_HEIGHT + 1}
        data={ChevronRightOutlinedPath}
        fill={isHoverRight ? colors.primaryColor : colors.thirdLevelText}
        backgroundWidth={timelineHeight}
        backgroundHeight={timelineHeight - 1}
        background={colors.white}
      />,
    );
    return skipButtons;
  }, [dateUnitType, isHoverLeft, colors.primaryColor, colors.thirdLevelText, colors.white, containerWidth, isHoverRight]);

  return {
    skipButtons,
    backToNowButton,
  };
};
