import { KONVA_DATASHEET_ID, StoreActions } from '@vikadata/core';
import { TriangleDown16Filled, TriangleRight16Filled } from '@vikadata/icons';
import dynamic from 'next/dynamic';
import { Icon, Rect } from 'pc/components/konva_components';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import * as React from 'react';
import { FC, memo, useCallback, useContext } from 'react';
import { GRID_ICON_COMMON_SIZE } from '../../../constant';
import { KonvaGridViewContext } from '../../../context';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
interface IGroupTabProps {
  x?: number;
  y?: number;
  height: number;
  width: number;
  depth: number;
  recordId: string;
}

const TriangleDown16FilledPath = TriangleDown16Filled.toString();
const TriangleRight16FilledPath = TriangleRight16Filled.toString();

export const GroupTab: FC<IGroupTabProps> = memo((props) => {
  const { x = 0, y = 0, width, height, recordId, depth } = props;
  const {
    datasheetId,
    view,
    isSearching,
    groupCollapseIds,
    dispatch,
  } = useContext(KonvaGridViewContext);
  const viewId = view.id;
  const pathKey = `${recordId}_${depth}`;
  const groupingCollapseIdsSet = new Set<string>(groupCollapseIds);
  const isCollapse = groupingCollapseIdsSet.has(pathKey);

  const changeGroupCollapseState = useCallback((newState: string[]) => {
    // 表内查找时，屏蔽折叠分组操作
    if (isSearching) return;
    dispatch(StoreActions.setGroupingCollapse(datasheetId, newState));
    // QuickAppend 组件显示依赖于 hoverRecordId, 分组折叠的情况下应该清空, 避免产生视觉误导
    dispatch(StoreActions.setHoverRecordId(datasheetId, null));
    setStorage(StorageName.GroupCollapse, { [`${datasheetId},${viewId}`]: newState });
  }, [isSearching, dispatch, datasheetId, viewId]);

  function clickExpandToggle(e: React.MouseEvent) {
    if (groupingCollapseIdsSet.has(pathKey)) {
      groupingCollapseIdsSet.delete(pathKey);
    } else {
      groupingCollapseIdsSet.add(pathKey);
    }
    return changeGroupCollapseState(Array.from(groupingCollapseIdsSet));
  }

  return (
    <Group
      x={x}
      y={y}
    >
      <Rect
        name={KONVA_DATASHEET_ID.GRID_GROUP_TAB}
        width={width}
        height={height}
        fill={'transparent'}
      />
      <Icon
        name={KONVA_DATASHEET_ID.GRID_GROUP_TOGGLE_BUTTON}
        x={16}
        y={(height - GRID_ICON_COMMON_SIZE) / 2}
        data={isCollapse ? TriangleRight16FilledPath : TriangleDown16FilledPath}
        onClick={clickExpandToggle}
      />
    </Group>
  );
});
