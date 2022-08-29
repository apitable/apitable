import { black, ILightOrDarkThemeColors } from '@vikadata/components';
import {
  Field, getFieldResultByStatType, Group as GroupClass, ILinearRow, KONVA_DATASHEET_ID, Selectors, StatType, Strings, t, ViewType
} from '@vikadata/core';
import { TriangleDown16Filled } from '@vikadata/icons';
import { intersection } from 'lodash';
import dynamic from 'next/dynamic';
import { generateTargetName } from 'pc/components/gantt_view';
import { autoSizerCanvas, Icon, Rect, Text } from 'pc/components/konva_components';
import { GRID_ICON_COMMON_SIZE, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import { getFieldStatType, hasLargeSelection } from 'pc/components/multi_grid/cell/stat_option';
import { store } from 'pc/store';
import { FC, memo, useCallback, useContext, useMemo, useState } from 'react';

const TriangleDown16FilledPath = TriangleDown16Filled.toString();
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
interface IStatProps {
  x?: number;
  y?: number;
  width: number;
  height: number;
  fieldId: string;
  row?: ILinearRow;
  isFrozen?: boolean;
  viewType?: ViewType;
}

const getGroupBackgroundByDepth = (depth: number, groupLength: number, viewType: ViewType, colors: ILightOrDarkThemeColors) => {
  if (viewType === ViewType.Gantt) return colors.defaultBg;
  if (!groupLength) return colors.defaultBg;

  const bgList: string[] = [colors.defaultBg];
  if (groupLength > 1) bgList.unshift(colors.fc8);
  if (groupLength > 2) bgList.unshift(colors.highBg);
  return bgList[depth];
};

export const Stat: FC<IStatProps> = memo((props) => {
  const { x = 0, y = 0, width, height, fieldId, row, isFrozen, viewType = ViewType.Grid } = props;
  const [isCurrent, setCurrent] = useState(false);
  const state = store.getState();
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const recordId = row?.recordId;
  const depth = row?.depth;
  const {
    visibleRecordIds,
    selectRecordIds,
    groupBreakpoint,
    groupInfo,
    selectRanges,
    recordRanges,
    fieldMap,
    permissions,
    view,
    mirrorId,
    isManualSaveView
  } = useContext(KonvaGridViewContext);
  const field = fieldMap[fieldId];
  const statType = getFieldStatType(state, fieldId);
  const groupLength = groupInfo?.length;
  const isGroupStat = Boolean(row);
  const isFrozenGroup = isFrozen && recordId;
  const background = isGroupStat ? getGroupBackgroundByDepth(depth || 0, groupLength, viewType, colors) : colors.defaultBg;

  const getStatClickStatus = () => {
    if (!permissions.columnCountEditable || (mirrorId && !isManualSaveView)) {
      return false;
    }
    if (!isManualSaveView && view.lockInfo) {
      return false;
    }
    if (isManualSaveView) {
      return !(view.autoSave && view.lockInfo);
    }
    return true;
  };

  const getStatRecordIds = useCallback(() => {
    let res = visibleRecordIds;
    // 默认是全部记录
    if (isGroupStat) {
      const groupSketch = new GroupClass(groupInfo, groupBreakpoint);
      // 分组的统计栏，展示分组下的记录
      res = groupSketch.getRecordsInGroupByDepth(state, row!.recordId, row!.depth).map(row => row.recordId);
    }
    return res;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRecordIds, isGroupStat, groupInfo, groupBreakpoint, row]);

  /**
   * 统计的选区只针对超过 1 个格子被选中的情况，
   * 如果只选中了一个单元格，则无需获取选区记录。
   */
  const multiSelection = useMemo(() => {
    const isMultiSelection = hasLargeSelection(selectRanges?.[0], recordRanges);
    if (!isMultiSelection) return null;
    if (isGroupStat) {
      return intersection(visibleRecordIds, selectRecordIds);
    }
    return selectRecordIds;
  }, [isGroupStat, recordRanges, selectRanges, selectRecordIds, visibleRecordIds]);

  const statText = useMemo(() => {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state)!;

    if (!statType) {
      return t(Strings.statistics);
    }
    const count = getFieldResultByStatType(
      statType!,
      multiSelection || getStatRecordIds(),
      field,
      snapshot,
      state,
    );
    if (statType === StatType.CountAll) {
      return t(Strings.records_of_count, {
        count,
      });
    }
    const statText = Field.bindModel(field).statType2text(statType!);
    return statText + ' ' + count;
  }, [statType, multiSelection, getStatRecordIds, field]);

  const finalWidth = useMemo(() => {
    if (!isFrozenGroup) {
      return width;
    }
    return autoSizerCanvas.measureText(statText).width + 30;
  }, [isFrozenGroup, statText, width]);

  const finalX = useMemo(() => {
    if (!isFrozenGroup) {
      return x;
    }
    return x + width - finalWidth;
  }, [finalWidth, isFrozenGroup, width, x]);

  const onMouseEnter = () => {
    setCurrent(true);

    if (!statType) {
      sessionStorage.setItem('selected_state', '');
      return;
    }

    sessionStorage.setItem('selected_state', statText);
  };

  const name = generateTargetName({
    targetName: recordId ? KONVA_DATASHEET_ID.GRID_GROUP_STAT : KONVA_DATASHEET_ID.GRID_BOTTOM_STAT,
    fieldId,
    recordId
  });

  return (
    <Group
      x={finalX}
      y={y}
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => setCurrent(false)}
    >
      <Rect
        name={getStatClickStatus() ? name : undefined}
        y={recordId ? 1 : 0}
        width={finalWidth}
        height={recordId ? height - 1 : height}
        fill={isCurrent ? colors.rowSelectedBgSolid : (background || colors.defaultBg)}
      />
      {
        (statType || isCurrent) &&
        <>
          <Text
            width={finalWidth - 20}
            height={height}
            text={statText}
            align={'right'}
            fill={colors.thirdLevelText}
          />
          <Icon
            x={finalWidth - 20}
            y={(height - GRID_ICON_COMMON_SIZE) / 2 + 1}
            data={TriangleDown16FilledPath}
            fill={black[300]}
            scaleX={0.8}
            scaleY={0.8}
            transformsEnabled={'all'}
            listening={false}
          />
        </>
      }
    </Group>
  );
});
