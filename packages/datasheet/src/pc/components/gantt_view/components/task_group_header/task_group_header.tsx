import { black, ILightOrDarkThemeColors, indigo } from '@vikadata/components';
import { ILinearRow, KONVA_DATASHEET_ID, StoreActions, Strings, t } from '@vikadata/core';
import { TriangleDown16Filled, TriangleRight16Filled } from '@vikadata/icons';
import dynamic from 'next/dynamic';
import { DateTimeType, GanttCoordinate, getDayjs, IGanttGroupInfo, PointPosition } from 'pc/components/gantt_view';
import { Icon, Rect } from 'pc/components/konva_components';
import { KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { rgbaToHex } from 'pc/utils';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import { FC, useContext } from 'react';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

interface ITaskGroupHeaderProps {
  y: number;
  row: ILinearRow;
  instance: GanttCoordinate;
  groupCount: number;
  groupInfo: IGanttGroupInfo;
  pointPosition: PointPosition;
  setTooltipInfo: (info) => void;
}

// Icon Path
const TriangleDown16FilledPath = TriangleDown16Filled.toString();
const TriangleRight16FilledPath = TriangleRight16Filled.toString();

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
      stroke: colors.warningColor,
      background: rgbaToHex(colors.warningColor, 0.4)
    },
    {
      height: 6,
      stroke: indigo[500],
      background: rgbaToHex(indigo[500], 0.4)
    },
    {
      height: 4,
      stroke: black[500],
      background: black[500]
    }
  ];
  return Array.from({ length: groupCount }, (_, index) => {
    return styleList[groupCount - index - 1];
  })[depth];
};

const TaskGroupHeader: FC<ITaskGroupHeaderProps> = (props) => {
  const { y, row, instance, groupInfo, groupCount, pointPosition, setTooltipInfo } = props;

  const {
    view,
    datasheetId,
    isSearching,
    groupCollapseIds,
    dispatch,
  } = useContext(KonvaGridViewContext);
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
    // 表内查找时，屏蔽折叠分组操作
    if (isSearching) return;
    dispatch(StoreActions.setGroupingCollapse(datasheetId, newState));
    // QuickAppend 组件显示依赖于 hoverRecordId, 分组折叠的情况下应该清空, 避免产生视觉误导
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
  const {
    height,
    stroke,
    background,
  } = getTaskGroupHeaderStyle(depth, groupCount, colors);

  return (
    <>
      <Group
        x={(startOffset ?? endOffset)!}
        y={y}
        onClick={toggleExpandStatus}
      >
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
