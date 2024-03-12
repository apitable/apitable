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
import { FC, useContext } from 'react';
import { black, ILightOrDarkThemeColors, indigo } from '@apitable/components';
import { ILinearRow, KONVA_DATASHEET_ID, StoreActions, Strings, t } from '@apitable/core';
import { TriangleDownFilled, TriangleRightFilled } from '@apitable/icons';
import { DateTimeType, GanttCoordinate, getDayjs, IGanttGroupInfo, PointPosition } from 'pc/components/gantt_view';
import { Icon, Rect } from 'pc/components/konva_components';
import { KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { rgbaToHex } from 'pc/utils';
import { setStorage, StorageName } from 'pc/utils/storage/storage';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

interface ITaskGroupHeaderProps {
  y: number;
  row: ILinearRow;
  instance: GanttCoordinate;
  groupCount: number;
  groupInfo: IGanttGroupInfo;
  pointPosition: PointPosition;
  setTooltipInfo: (info: any) => void;
}

// Icon Path
const TriangleDown16FilledPath = TriangleDownFilled.toString();
const TriangleRight16FilledPath = TriangleRightFilled.toString();

// Constants
const GRID_GROUP_TAB_HEIGHT = 48;
const ICON_COMMON_SIZE = 16;

const getFormatText = (date: DateTimeType | null) => {
  return date != null ? getDayjs(date).format('YYYY/MM/DD') : '';
};

const getTaskGroupHeaderStyle = (depth: number, groupCount: number, colors: ILightOrDarkThemeColors) => {
  const styleList = [
    {
      height: 8,
      stroke: colors.rainbowOrange3,
      background: colors.rainbowOrange2,
    },
    {
      height: 6,
      stroke: indigo[500],
      background: rgbaToHex(indigo[500], 0.4),
    },
    {
      height: 4,
      stroke: black[500],
      background: black[500],
    },
  ];
  return Array.from({ length: groupCount }, (_, index) => {
    return styleList[groupCount - index - 1];
  })[depth];
};

const TaskGroupHeader: FC<React.PropsWithChildren<ITaskGroupHeaderProps>> = (props) => {
  const { y, row, instance, groupInfo, groupCount, pointPosition, setTooltipInfo } = props;

  const { view, datasheetId, isSearching, groupCollapseIds, dispatch } = useContext(KonvaGridViewContext);
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  const viewId = view.id;
  const { unitWidth } = instance;
  const { recordId, depth } = row;
  const { start, end, count } = groupInfo || {};

  if (start == null && end == null) {
    return null;
  }

  const { startOffset, endOffset, width } = instance.getTaskData(start, end);

  if (startOffset == null && endOffset == null) {
    return null;
  }

  const startDateText = getFormatText(start);
  const endDateText = getFormatText(end);
  const pathKey = `${recordId}_${depth}`;
  const groupingCollapseIdsSet = new Set<string>(groupCollapseIds);
  const isCollapse = groupingCollapseIdsSet.has(pathKey);

  const changeGroupCollapseState = (newState: string[]) => {
    // Masked collapse grouping operation for in-table lookup
    if (isSearching) return;
    dispatch(StoreActions.setGroupingCollapse(datasheetId, newState));
    /*
     * QuickAppend The component display depends on the hoverRecordId,
     * which should be cleared in the case of group collapses to avoid visual misleadingness
     **/
    dispatch(StoreActions.setHoverRecordId(datasheetId, null));
    setStorage(StorageName.GroupCollapse, { [`${datasheetId},${viewId}`]: newState });
  };

  const toggleExpandStatus = () => {
    if (groupingCollapseIdsSet.has(pathKey)) {
      groupingCollapseIdsSet.delete(pathKey);
    } else {
      groupingCollapseIdsSet.add(pathKey);
    }
    return changeGroupCollapseState(Array.from(groupingCollapseIdsSet));
  };
  const groupHeaderStyle = getTaskGroupHeaderStyle(depth, groupCount, colors);
  if (!groupHeaderStyle) {
    return null;
  }
  const { height, stroke, background } = groupHeaderStyle;

  return (
    <>
      <Group x={(startOffset ?? endOffset)!} y={y} onClick={toggleExpandStatus} onTap={toggleExpandStatus}>
        <Icon
          name={KONVA_DATASHEET_ID.GANTT_GROUP_TOGGLE_BUTTON}
          x={-16}
          y={(GRID_GROUP_TAB_HEIGHT - ICON_COMMON_SIZE) / 2}
          data={isCollapse ? TriangleRight16FilledPath : TriangleDown16FilledPath}
        />
        <Rect
          name={KONVA_DATASHEET_ID.GANTT_GROUP_TOGGLE_BUTTON}
          y={(GRID_GROUP_TAB_HEIGHT - height) / 2}
          width={width ?? unitWidth}
          height={height}
          cornerRadius={[8, 8, 0, 0]}
          fill={background}
          onMouseMove={() => {
            setTooltipInfo({
              visible: true,
              x: pointPosition.x,
              y: y - (pointPosition.offsetTop - pointPosition.y) - 20,
              text: `${t(Strings.gantt_task_group_tooltip, { count })}，${startDateText} - ${endDateText}`,
            });
          }}
          stroke={stroke}
          strokeWidth={1}
          onMouseLeave={() => setTooltipInfo({ visible: false })}
        />
      </Group>
    </>
  );
};
export default TaskGroupHeader;
