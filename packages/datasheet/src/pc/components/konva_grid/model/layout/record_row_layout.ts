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

import * as React from 'react';
import { ILightOrDarkThemeColors } from '@apitable/components';
import { ILinearRow, ILinearRowRecord, RowHeight } from '@apitable/core';
import { CommentBgFilled } from '@apitable/icons';
import { GRID_GROUP_OFFSET, GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../../constant';
import { GridLayout } from './layout';

interface IFirstCell {
  row: ILinearRow;
  style: React.CSSProperties;
  isActiveRow: boolean;
  isCheckedRow: boolean;
  isHoverRow: boolean;
  isDraggingRow: boolean;
  isThisCellWillMove: boolean;
  commentCount: any;
  commentVisible?: boolean;
  colors: ILightOrDarkThemeColors;
}

const CommentBjFilledPath = CommentBgFilled.toString();

export class RecordRowLayout extends GridLayout {
  private renderFirstCell({
    row,
    style,
    isActiveRow,
    isCheckedRow,
    isHoverRow,
    isDraggingRow,
    isThisCellWillMove,
    commentCount,
    commentVisible,
    colors,
  }: IFirstCell) {
    if (!this.isFirst) return;

    const { depth } = row;
    const { fill } = style;
    if (depth) this.renderIndentFront(depth - 1);
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    const groupOffset = depth ? (depth - 1) * GRID_GROUP_OFFSET + 0.5 : 0.5;
    this.rect({
      x: groupOffset,
      y,
      width: GRID_ROW_HEAD_WIDTH + columnWidth - groupOffset + 0.5,
      height: rowHeight,
      fill: isDraggingRow ? colors.lowestBg : colors.white,
      stroke: colors.sheetLineColor,
    });
    this.rect({
      x: GRID_ROW_HEAD_WIDTH + groupOffset,
      y: y + 0.5,
      width: columnWidth - groupOffset,
      height: rowHeight - 1,
      fill: fill || 'transparent',
    });
    if (isHoverRow || isCheckedRow || isActiveRow || isThisCellWillMove) {
      let fill: string = colors.bgBglessHoverSolid;
      if (isDraggingRow) {
        fill = colors.lowestBg;
      } else if (isThisCellWillMove) {
        fill = colors.warnLight;
      } else if (isCheckedRow || isActiveRow) {
        fill = colors.bgBrandLightDefaultSolid;
      }
      return this.rect({
        x: groupOffset + 0.5,
        y: y + 0.5,
        width: GRID_ROW_HEAD_WIDTH,
        height: rowHeight - 1,
        fill,
      });
    }
    this.setStyle({ fontSize: 13 });
    this.text({
      x: groupOffset + GRID_ROW_HEAD_WIDTH / 2,
      y: y + 10,
      text: String((row as ILinearRowRecord).displayIndex),
      textAlign: 'center',
    });
    if (commentVisible) {
      this.path({
        x: groupOffset + 44.5,
        y: y + (RowHeight.Short - GRID_ICON_COMMON_SIZE) / 2 - 5,
        data: CommentBjFilledPath,
        size: GRID_ICON_COMMON_SIZE,
        scaleX: 0.375,
        scaleY: 0.375,
        fill: colors.rainbowTeal1,
      });
      this.text({
        x: groupOffset + 48.5 + GRID_ICON_COMMON_SIZE / 2,
        y: y + (RowHeight.Short - 14) / 2,
        text: String(commentCount),
        fillStyle: colors.teal[500],
        textAlign: 'center',
      });
    }
  }

  private renderLastCell({ row, style, colors }: Pick<IFirstCell, 'row' | 'style' | 'colors'>) {
    if (!this.isLast) return;
    this.renderAddFieldBlank(row);
    if (this.isFirst) return;

    const { depth } = row;
    const { fill, stroke } = style;
    const columnWidth = this.columnWidth;
    const width = depth === 3 ? columnWidth - GRID_GROUP_OFFSET : columnWidth;
    this.rect({
      x: this.x,
      y: this.y,
      width,
      height: this.rowHeight,
      fill: fill || colors.defaultBg,
      stroke: stroke || colors.sheetLineColor,
    });
    if (depth > 1) {
      this.renderIndentEnd(depth - 1);
    }
  }

  private renderCommonCell({ style, colors }: Pick<IFirstCell, 'style' | 'colors'>) {
    if (this.isFirst || this.isLast) return;

    const { fill, stroke } = style;
    this.rect({
      x: this.x,
      y: this.y,
      width: this.columnWidth,
      height: this.rowHeight,
      fill: fill || colors.defaultBg,
      stroke: stroke || colors.sheetLineColor,
    });
  }

  render(props: IFirstCell) {
    const { row, style, isHoverRow, isCheckedRow, isActiveRow, isDraggingRow, isThisCellWillMove, commentCount, commentVisible, colors } = props;

    this.renderFirstCell({
      row,
      style,
      isHoverRow,
      isActiveRow,
      isCheckedRow,
      isDraggingRow,
      isThisCellWillMove,
      commentCount,
      commentVisible,
      colors,
    });
    this.renderCommonCell({
      style,
      colors,
    });
    this.renderLastCell({
      row,
      style,
      colors,
    });
  }
}

export const recordRowLayout = new RecordRowLayout();
