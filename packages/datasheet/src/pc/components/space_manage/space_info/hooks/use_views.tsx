import { useMemo } from 'react';
import { ViewGanttGreyOutlined, ViewCalendarFilled, FormOutlined, MirrorOutlined } from '@vikadata/icons';
import { useThemeColors } from '@vikadata/components';
import { IHooksParams, IMultiLineItemProps } from '../interface';
import { calcPercent } from './utils';
import { Strings, t } from '@vikadata/core';

export const useView = ({ spaceInfo, subscription }: IHooksParams): IMultiLineItemProps[] => {
  const colors = useThemeColors();
  return useMemo(() => {
    return [
      {
        unit: t(Strings.unit_piece),
        total: subscription?.maxGanttViewsInSpace,
        used: spaceInfo?.ganttViewNums,
        name: t(Strings.gantt_view),
        icon: <ViewGanttGreyOutlined color={colors.black[500]} />,
        percent: calcPercent(spaceInfo?.ganttViewNums, subscription?.maxGanttViewsInSpace),
        showProgress: true,
      },
      {
        unit: t(Strings.unit_piece),
        total: subscription?.maxCalendarViewsInSpace,
        used: spaceInfo?.calendarViewNums,
        name: t(Strings.calendar_view),
        icon: <ViewCalendarFilled color={colors.black[500]} />,
        percent: calcPercent(spaceInfo?.calendarViewNums, subscription?.maxCalendarViewsInSpace),
        showProgress: true,
      },
      {
        unit: t(Strings.unit_piece),
        total: subscription?.maxFormViewsInSpace,
        used: spaceInfo?.formViewNums,
        name: t(Strings.vika_form),
        icon: <FormOutlined color={colors.black[500]} />,
        percent: calcPercent(spaceInfo?.formViewNums, subscription?.maxFormViewsInSpace),
        showProgress: true,
      },
      {
        unit: t(Strings.unit_piece),
        total: subscription?.maxMirrorNums,
        used: spaceInfo?.mirrorNums,
        name: t(Strings.mirror),
        icon: <MirrorOutlined color={colors.black[500]} />,
        percent: calcPercent(spaceInfo?.mirrorNums, subscription?.maxMirrorNums),
        showProgress: true,
      },
    ];
  }, [subscription, spaceInfo, colors]);
};
