import { teal } from '@vikadata/components';
import { ILinearRowRecord, KONVA_DATASHEET_ID, RowHeight, Strings, t } from '@vikadata/core';
import { CommentBjEntireFilled } from '@vikadata/icons';
import dynamic from 'next/dynamic';
import { Icon, Rect, Text } from 'pc/components/konva_components';
import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH, GridCoordinate, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import { FC, memo, useContext } from 'react';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
interface IRowHeadIndexProps {
  instance: GridCoordinate;
  row: ILinearRowRecord;
  rowIndex: number;
  commentCount: number;
}

// Icon Path
const CommentBjFilledPath = CommentBjEntireFilled.toString();

const ICON_SIZE = 16;

export const RowHeadIndex: FC<IRowHeadIndexProps> = memo((props) => {
  const { instance, row, rowIndex, commentCount } = props;
  const { rowHeight } = instance;
  const { displayIndex, depth } = row;
  const { setTooltipInfo, clearTooltipInfo, theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { allowShowCommentPane } = useContext(KonvaGridViewContext);
  // 由于 Konva 使用自定义的渲染器，因此其中所有的元素必须是 Konva 节点，
  // allowShowCommentPane 可能为 ""，导致之后的渲染崩溃
  const commentVisible = Boolean(allowShowCommentPane) && Boolean(commentCount);

  if (rowIndex == null) return null;
  const y = instance.getRowOffset(rowIndex);
  const iconOffsetY = (RowHeight.Short - 16) / 2;

  const onMouseEnter = () => {
    setTooltipInfo({
      placement: 'bottom',
      title: t(Strings.activity_marker),
      visible: true,
      width: ICON_SIZE,
      height: ICON_SIZE,
      x: 48,
      y: y + 24
    });
  };
  const x = depth ? (depth - 1) * GRID_GROUP_OFFSET : 0;

  return (
    <Group
      x={x}
      y={y}
    >
      <Rect
        name={KONVA_DATASHEET_ID.GRID_ROW_HEAD}
        y={1}
        width={GRID_ROW_HEAD_WIDTH + 1}
        height={rowHeight - 1}
        fill={colors.defaultBg}
      />
      <Text
        width={GRID_ROW_HEAD_WIDTH}
        height={RowHeight.Short}
        align="center"
        text={displayIndex}
      />
      {
        commentVisible &&
        <Group
          x={48}
          y={iconOffsetY}
        >
          <Icon
            name={KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD}
            data={CommentBjFilledPath}
            fill={teal[50]}
            onMouseEnter={onMouseEnter}
            onMouseOut={clearTooltipInfo}
          />
          <Text
            width={16}
            height={16}
            text={String(commentCount)}
            align={'center'}
            fill={teal[500]}
          />
        </Group>
      }
    </Group>
  );
});
