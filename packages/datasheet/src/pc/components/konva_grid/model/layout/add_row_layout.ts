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
import { ILinearRow, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { GRID_GROUP_OFFSET, GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../../constant';
import { GridLayout } from './layout';

const AddOutlinedPath = AddOutlined.toString();

interface ICell {
  row: any;
  isHoverColumn: boolean;
  width: number;
  isHoverRow: boolean;
  rowCreatable: boolean;
}

export class AddRowLayout extends GridLayout {
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

  private renderCell({ width, isHoverRow, rowCreatable }: Pick<ICell, 'width' | 'isHoverRow' | 'rowCreatable'>) {
    const x = this.x;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const fill = isHoverRow && rowCreatable ? colors.bgBglessHoverSolid : colors.defaultBg;
    this.rect({
      x,
      y: y + 0.5,
      width,
      height: rowHeight,
      fill,
    });
    this.line({
      x,
      y: y + rowHeight,
      points: [0, 0, width, 0],
      stroke: colors.sheetLineColor,
    });
  }

  private renderFirstCell({ row, isHoverRow, isHoverColumn, rowCreatable }: Pick<ICell, 'row' | 'isHoverRow' | 'isHoverColumn' | 'rowCreatable'>) {
    if (!this.isFirst) return;
    const { depth } = row;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    if (depth) this.renderIndentFront(depth - 1);
    const frozenOffset = !depth ? 0.5 : (depth - 1) * GRID_GROUP_OFFSET + 0.5;
    const fill = isHoverRow && rowCreatable ? colors.bgBglessHoverSolid : colors.defaultBg;
    this.rect({
      x: frozenOffset,
      y: y + 0.5,
      width: columnWidth + GRID_ROW_HEAD_WIDTH - frozenOffset + 1,
      height: rowHeight,
      fill,
    });
    this.line({
      x: frozenOffset,
      y,
      points: [0, 0, 0, rowHeight, columnWidth + GRID_ROW_HEAD_WIDTH - frozenOffset + 1, rowHeight],
      stroke: colors.sheetLineColor,
    });
    if (rowCreatable) {
      const curX = depth ? (depth - 1) * GRID_GROUP_OFFSET + 30 : 30;
      this.path({
        x: curX,
        y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
        data: AddOutlinedPath,
        size: 16,
        fill: colors.thirdLevelText,
      });
      if (isHoverColumn && isHoverRow) {
        this.setStyle({
          fontSize: 13,
          fontWeight: 'normal',
        });
        this.text({
          x: curX + 18,
          y: y + rowHeight / 2,
          verticalAlign: 'middle',
          text: t(Strings.add_row_button_tip),
          fillStyle: colors.black[500],
        });
      }
    }
  }

  private renderLastCell({ row, rowCreatable, isHoverRow }: Pick<ICell, 'row' | 'rowCreatable' | 'isHoverRow'>) {
    if (!this.isLast) return;
    const { depth } = row;
    const x = this.x;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    const width = !this.isFirst && depth === 3 ? columnWidth - GRID_GROUP_OFFSET : columnWidth;
    if (!this.isFirst) {
      this.renderCell({
        width,
        rowCreatable,
        isHoverRow,
      });
      if (depth === 3) {
        this.renderIndentEnd(depth);
      }
    }
    if (depth >= 1) {
      this.line({
        x: x + width,
        y,
        points: [0, 0, 0, rowHeight],
        stroke: colors.sheetLineColor,
      });
    }
    this.renderAddFieldBlank(row);
  }

  private renderCommonCell({ rowCreatable, isHoverRow }: Pick<ICell, 'rowCreatable' | 'isHoverRow'>) {
    if (this.isFirst || this.isLast) return;
    this.renderCell({
      width: this.columnWidth,
      rowCreatable,
      isHoverRow,
    });
  }

  // Show "add row" prompt when hovering
  private renderHoverTip({ rowCreatable, isHoverColumn, isHoverRow }: Pick<ICell, 'rowCreatable' | 'isHoverColumn' | 'isHoverRow'>) {
    if (this.isFirst || !rowCreatable || !isHoverColumn || !isHoverRow) return;
    const x = this.x;
    const y = this.y;
    const rowHeight = this.rowHeight;
    this.path({
      x: x + 8.5,
      y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
      data: AddOutlinedPath,
      size: 16,
      fill: colors.thirdLevelText,
    });
    this.setStyle({
      fontSize: 13,
      fontWeight: 'normal',
    });
    this.text({
      x: x + 26.5,
      y: y + rowHeight / 2,
      verticalAlign: 'middle',
      text: t(Strings.add_row_button_tip),
      fillStyle: colors.black[500],
    });
  }

  render({ row, rowCreatable, isHoverRow, isHoverColumn }: Pick<ICell, 'row' | 'rowCreatable' | 'isHoverColumn' | 'isHoverRow'>) {
    this.renderFirstCell({
      row,
      rowCreatable,
      isHoverRow,
      isHoverColumn,
    });
    this.renderCommonCell({
      rowCreatable,
      isHoverRow,
    });
    this.renderLastCell({
      row,
      rowCreatable,
      isHoverRow,
    });
    this.renderHoverTip({
      rowCreatable,
      isHoverRow,
      isHoverColumn,
    });
  }
}

export const addRowLayout = new AddRowLayout();
