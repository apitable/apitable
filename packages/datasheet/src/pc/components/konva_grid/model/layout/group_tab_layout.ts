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

import { colors, ThemeName } from '@apitable/components';
import { ILinearRow, RowHeightLevel, Strings, t, IField } from '@apitable/core';
import { LockOutlined } from '@apitable/icons';
import { GRID_GROUP_OFFSET, GRID_ICON_COMMON_SIZE, GRID_ROW_HEAD_WIDTH } from '../../constant';
import { IRenderStyleProps } from '../../interface';
import { cellHelper } from '../../utils';
import { GridLayout } from './layout';

interface ICell {
  row: ILinearRow;
  cellValue: any;
  groupField: IField;
  isCryptoField: boolean;
  unitTitleMap?: object;
  cacheTheme: ThemeName;
}

const LockNonzeroOutlinedPath = LockOutlined.toString();

export class GroupTabLayout extends GridLayout {
  protected override renderAddFieldBlank(row: ILinearRow) {
    super.renderAddFieldBlank(row);
    const { depth } = row;
    if (depth === 0) {
      const width = this.addBtnWidth;
      this.line({
        x: this.x + this.columnWidth,
        y: this.y,
        points: [0, 0, width, 0],
        stroke: colors.sheetLineColor,
      });
    }
  }

  private renderFirstCell({ row, cellValue, groupField, isCryptoField, unitTitleMap, cacheTheme }: ICell) {
    if (!this.isFirst) return;
    const { recordId, depth } = row;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    if (depth) this.renderIndentFront(depth);
    const groupOffset = depth * GRID_GROUP_OFFSET + 0.5;
    const fill = this.getGroupBackgroundByDepth(depth);
    this.rect({
      x: groupOffset,
      y,
      width: columnWidth - groupOffset + GRID_ROW_HEAD_WIDTH + 0.5,
      height: rowHeight,
      fill,
      stroke: colors.sheetLineColor,
    });

    if (isCryptoField) {
      this.setStyle({ fontSize: 14 });
      this.text({
        x: groupOffset + 35,
        y: y + (rowHeight - 14) / 2,
        text: t(Strings.crypto_field),
        fillStyle: colors.thirdLevelText,
        fontSize: 14,
      });
      return this.path({
        x: groupOffset + 120.5,
        y: y + (rowHeight - GRID_ICON_COMMON_SIZE) / 2 - 0.5,
        data: LockNonzeroOutlinedPath,
        size: GRID_ICON_COMMON_SIZE,
        fill: colors.fourthLevelText,
      });
    }

    // Compatible with grouping condition column with incorrect data
    if (groupField == null) {
      this.setStyle({ fontSize: 14 });
      return this.text({
        x: groupOffset + 35,
        y: y + (rowHeight - 14) / 2,
        text: t(Strings.group_field_error_tips),
        fillStyle: colors.thirdLevelText,
        fontSize: 14,
      });
    }

    this.setStyle({ fontSize: 12 });
    this.text({
      x: groupOffset + 35,
      y: y + 6,
      text: groupField.name,
      fillStyle: colors.thirdLevelText,
      fontSize: 12,
    });
    if (cellValue != null) {
      this.setStyle({ fontSize: 13 });
      this.ctx.save();
      this.ctx.rect(groupOffset + 25.5, y + 17.5, columnWidth, rowHeight - 18);
      this.ctx.clip();
      this.ctx.restore();
      const renderProps = {
        x: groupOffset + 25.5,
        y: y + 17.5,
        columnWidth,
        rowHeight: rowHeight - 18,
        recordId,
        field: groupField,
        cellValue,
        isActive: false,
        style: { textAlign: 'left' } as IRenderStyleProps,
        rowHeightLevel: RowHeightLevel.Short,
        unitTitleMap,
        cacheTheme,
      };
      return cellHelper.renderCellValue(renderProps, this.ctx);
    }
    this.setStyle({ fontSize: 14 });
    this.text({
      x: groupOffset + 36,
      y: y + 24,
      text: `(${cellValue == null ? t(Strings.content_is_empty) : t(Strings.data_error)})`,
      fillStyle: colors.thirdLevelText,
      fontSize: 14,
    });
  }

  private renderLastCell(row: ILinearRow) {
    if (!this.isLast) return;
    this.renderAddFieldBlank(row);
    if (this.isFirst) return;

    const { depth } = row;
    if (depth) this.renderIndentEnd(depth);

    const x = this.x;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    const lastTabOffsetList = [40, 0, -GRID_GROUP_OFFSET];
    const width = columnWidth + lastTabOffsetList[depth];
    const fill = this.getGroupBackgroundByDepth(depth);
    this.rect({
      x,
      y: y + 0.5,
      width,
      height: rowHeight,
      fill,
    });
    this.line({
      x,
      y,
      points: [0, 0, width, 0, width, rowHeight, 0, rowHeight],
      stroke: colors.sheetLineColor,
    });
  }

  private renderCommonCell(row: ILinearRow) {
    if (this.isFirst || this.isLast) return;
    const x = this.x;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    const { depth } = row;
    const fill = this.getGroupBackgroundByDepth(depth);
    this.rect({
      x,
      y,
      width: columnWidth,
      height: rowHeight,
      fill,
    });
    this.line({
      x,
      y,
      points: [0, 0, columnWidth, 0],
      stroke: colors.sheetLineColor,
    });
    this.line({
      x,
      y,
      points: [0, rowHeight, columnWidth, rowHeight],
      stroke: colors.sheetLineColor,
    });
  }

  render({ row, cellValue, groupField, isCryptoField, unitTitleMap, cacheTheme }: ICell) {
    this.renderFirstCell({
      row,
      cellValue,
      groupField,
      isCryptoField,
      unitTitleMap,
      cacheTheme,
    });
    this.renderLastCell(row);
    this.renderCommonCell(row);
  }
}

export const groupTabLayout = new GroupTabLayout();
