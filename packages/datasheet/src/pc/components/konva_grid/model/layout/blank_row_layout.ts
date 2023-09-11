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

import { colors } from '@apitable/components';
import { ILinearRow } from '@apitable/core';
import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../../constant';
import { GridLayout } from './layout';

export class BlankRowLayout extends GridLayout {
  override renderAddFieldBlank(row: ILinearRow) {
    super.renderAddFieldBlank(row);
    const { depth } = row;
    const width = this.addBtnWidth;
    const rowHeight = this.rowHeight;
    if (depth <= 1) {
      this.line({
        x: this.x + this.columnWidth,
        y: this.y,
        points: [0, rowHeight, width, rowHeight],
        stroke: colors.sheetLineColor,
      });
    }
  }

  private renderFirstCell(row: ILinearRow, colors: { lowestBg: string; sheetLineColor: string }) {
    if (!this.isFirst) return;

    const { depth } = row;
    const x = (depth - 1) * GRID_GROUP_OFFSET + 0.5;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    if (depth === 0) {
      return this.rect({
        x: 0.5,
        y: y + 0.5,
        width: columnWidth + GRID_ROW_HEAD_WIDTH + 0.5,
        height: rowHeight,
        fill: colors.lowestBg,
      });
    }
    this.renderIndentFront(depth);
    this.rect({
      x: x + 0.5,
      y: y + 0.5,
      width: columnWidth + GRID_ROW_HEAD_WIDTH + 0.5,
      height: rowHeight,
      fill: this.getGroupBackgroundByDepth(depth - 1),
    });
    this.line({
      x: x + 0.5,
      y,
      points: [0, rowHeight, columnWidth + GRID_ROW_HEAD_WIDTH, rowHeight],
      stroke: colors.sheetLineColor,
    });
  }

  private renderLastCell(row: ILinearRow) {
    if (!this.isLast) return;
    if (this.isFirst) {
      return this.renderAddFieldBlank(row);
    }
    const { depth } = row;
    if (depth === 0) return;

    const x = this.x;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    const width = depth === 1 ? columnWidth + 39 : columnWidth;
    this.renderIndentEnd(depth);
    this.rect({
      x: x + 0.5,
      y: y + 0.5,
      width: width + 0.5,
      height: rowHeight,
      fill: this.getGroupBackgroundByDepth(depth - 1),
    });
    this.line({
      x: x + 0.5,
      y,
      points: [0, rowHeight, width, rowHeight],
      stroke: colors.sheetLineColor,
    });
    if (depth === 2) {
      this.line({
        x: x + columnWidth,
        y,
        points: [0, 0, 0, rowHeight],
        stroke: colors.sheetLineColor,
      });
    }
  }

  private renderCommonCell(row: ILinearRow) {
    if (this.isFirst || this.isLast) return;

    const { depth } = row;
    const x = this.x;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    this.rect({
      x: x + 0.5,
      y: y + 0.5,
      width: columnWidth + 0.5,
      height: rowHeight,
      fill: this.getGroupBackgroundByDepth(depth - 1),
    });
    this.line({
      x: x + 0.5,
      y,
      points: [0, rowHeight, columnWidth, rowHeight],
      stroke: colors.sheetLineColor,
    });
  }

  render({ row, colors }: { row: ILinearRow; colors: { lowestBg: string; sheetLineColor: string } }) {
    this.renderFirstCell(row, colors);
    this.renderCommonCell(row);
    this.renderLastCell(row);
  }
}

export const blankRowLayout = new BlankRowLayout();
