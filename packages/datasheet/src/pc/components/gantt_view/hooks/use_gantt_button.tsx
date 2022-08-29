import { DateUnitType, KONVA_DATASHEET_ID } from '@vikadata/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@vikadata/icons';
import dynamic from 'next/dynamic';
import { getStyleConfig } from 'pc/common/style_config';
import { GANTT_MONTH_TIMELINE_HEIGHT, GANTT_TAB_BAR_HEIGHT, GANTT_TIMELINE_HEIGHT, GanttCoordinate, PointPosition } from 'pc/components/gantt_view';

import { Icon } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import * as React from 'react';
import { useContext, useMemo } from 'react';

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
  const {
    instance,
    pointPosition,
    columnStartIndex,
    columnStopIndex,
  } = props;

  const { todayIndex, containerWidth, dateUnitType } = instance;
  const { realTargetName: pointRealTargetName } = pointPosition;
  const { isMobile: _isMobile, isTouchDevice, theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const isMobile = _isMobile || isTouchDevice;

  /**
   * 绘制 “返回当前时间” 按钮
   */
  const backToNowButton = useMemo(() => {
    if (todayIndex > columnStartIndex && todayIndex < columnStopIndex) return null;

    const btnWidth = 68;
    const btnHeight = 24;
    const radius = 8;
    const cornerRadius = todayIndex <= columnStartIndex ? [radius, radius, radius, 0] : [radius, radius, 0, radius];
    const marginRight = isMobile ? 90 + getStyleConfig('gantt_mobile_unit_select_width') : 180;

    return <Button
      containerWidth={containerWidth}
      marginRight={marginRight}
      btnHeight={btnHeight}
      KONVA_DATASHEET_ID={KONVA_DATASHEET_ID}
      btnWidth={btnWidth}
      colors={colors}
      cornerRadius={cornerRadius}
    />;
  }, [colors, columnStartIndex, columnStopIndex, containerWidth, isMobile, todayIndex]);

  /**
   * 绘制 “上一页” 和 “下一页” 按钮
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
      />
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
      />
    );
    return skipButtons;
  }, [dateUnitType, isHoverLeft, colors.primaryColor, colors.thirdLevelText, colors.white, containerWidth, isHoverRight]);

  return {
    skipButtons,
    backToNowButton
  };
};
