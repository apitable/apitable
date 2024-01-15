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
import { FC, memo, useContext } from 'react';
import { teal } from '@apitable/components';
import { KONVA_DATASHEET_ID, RowHeight, Strings, t } from '@apitable/core';
import { DragOutlined, ExpandOutlined, CommentBgFilled } from '@apitable/icons';
import { generateTargetName } from 'pc/components/gantt_view';
import { Icon, IconType, Rect, Text } from 'pc/components/konva_components';
import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH, GridCoordinate, KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
interface IRowHeadOperationProps {
  instance: GridCoordinate;
  isChecked: boolean;
  isHovered: boolean;
  isActive: boolean;
  rowIndex: number;
  commentCount: number;
  isAllowDrag: boolean;
  isWillMove?: boolean;
  isPreview?: boolean;
  recordId: string;
}

// Icon Path
const DragOutlinedPath = DragOutlined.toString();
const ExpandRecordOutlinedPath = ExpandOutlined.toString();
const CommentBjFilledPath = CommentBgFilled.toString();

const ICON_SIZE = 16;

export const RowHeadOperation: FC<React.PropsWithChildren<IRowHeadOperationProps>> = memo((props) => {
  const { instance, isChecked, isHovered, isActive, rowIndex, commentCount, isAllowDrag, recordId, isPreview } = props;
  const { rowHeight } = instance;
  const { setTooltipInfo, clearTooltipInfo, theme } = useContext(KonvaGridContext);
  const { allowShowCommentPane, linearRows } = useContext(KonvaGridViewContext);
  const commentVisible = allowShowCommentPane && Boolean(commentCount);
  const colors = theme.color;

  if (rowIndex == null) return null;
  const y = instance.getRowOffset(rowIndex);
  const iconOffsetY = (RowHeight.Short - 16) / 2;
  const { depth } = linearRows[rowIndex];
  const x = depth > 0 ? (depth - 1) * GRID_GROUP_OFFSET : 0;

  const onExpandMouseEnter = () => {
    setTooltipInfo({
      placement: 'bottom',
      title: commentVisible ? t(Strings.activity_marker) : t(Strings.expand_current_record),
      visible: true,
      width: ICON_SIZE,
      height: 1,
      x: x + 48,
      y: y + 24,
      coordXEnable: false,
    });
  };

  const onDragMouseEnter = () => {
    if (isAllowDrag) return;
    setTooltipInfo({
      placement: 'top',
      title: t(Strings.grit_keep_sort_disable_drag),
      visible: true,
      width: ICON_SIZE,
      height: 1,
      x: x + 8,
      y,
      coordXEnable: false,
    });
  };

  return (
    <Group x={x} y={y}>
      {/* Provide background color */}
      <Rect
        name={generateTargetName({
          targetName: KONVA_DATASHEET_ID.GRID_ROW_HEAD,
          recordId,
        })}
        width={GRID_ROW_HEAD_WIDTH + 1}
        height={rowHeight}
        fill={'transparent'}
      />

      {(isChecked || isHovered || isActive) && (
        <Group>
          {/* Drag and drop row */}
          <Icon
            name={generateTargetName({
              targetName: KONVA_DATASHEET_ID.GRID_ROW_DRAG_HANDLER,
              recordId,
            })}
            x={6}
            y={iconOffsetY}
            data={DragOutlinedPath}
            fill={isChecked ? colors.primaryColor : colors.thirdLevelText}
            onMouseEnter={onDragMouseEnter}
            onMouseOut={clearTooltipInfo}
          />

          {/* Select row */}
          <Icon
            name={generateTargetName({
              targetName: KONVA_DATASHEET_ID.GRID_ROW_SELECT_CHECKBOX,
              recordId,
            })}
            x={27}
            y={iconOffsetY + 1}
            type={isChecked ? IconType.Checked : IconType.Unchecked}
            fill={isChecked ? colors.primaryColor : colors.thirdLevelText}
          />

          {/* Expanded Lines/Comments */}
          <Group x={48} y={iconOffsetY} onMouseEnter={!isPreview && onExpandMouseEnter} onMouseOut={clearTooltipInfo}>
            {!commentVisible ? (
              <Icon
                x={1}
                name={generateTargetName({
                  targetName: KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD,
                  recordId,
                })}
                data={ExpandRecordOutlinedPath}
                fill={colors.primaryColor}
              />
            ) : (
              <>
                <Icon
                  x={-3}
                  y={-4}
                  name={generateTargetName({
                    targetName: KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD,
                    recordId,
                  })}
                  scaleX={0.375}
                  scaleY={0.375}
                  transformsEnabled={'all'}
                  data={CommentBjFilledPath}
                  fill={colors.rainbowTeal1}
                />
                <Text x={-2} width={22} height={16} text={String(commentCount)} align={'center'} fill={teal[500]} listening={false} />
              </>
            )}
          </Group>
        </Group>
      )}
    </Group>
  );
});
