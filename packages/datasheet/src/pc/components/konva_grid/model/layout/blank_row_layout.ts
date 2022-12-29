import { ILinearRow } from '@apitable/core';
import { GridLayout } from './layout';
import { colors } from '@apitable/components';
import { GRID_GROUP_OFFSET, GRID_ROW_HEAD_WIDTH } from '../../constant';

export class BlankRowLayout extends GridLayout {
  renderAddFieldBlank(row: ILinearRow) {
    super.renderAddFieldBlank(row);
    const { depth } = row;
    const width = this.addBtnWidth;
    const rowHeight = this.rowHeight;
    if (depth <= 1) {
      this.line({
        x: this.x + this.columnWidth,
        y: this.y,
        points: [0, rowHeight, width, rowHeight],
        stroke: colors.sheetLineColor
      });
    }
  }

  private renderFirstCell(row, colors) {
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
        fill: colors.lowestBg
      });
    }
    this.renderIndentFront(depth);
    this.rect({
      x: x + 0.5,
      y: y + 0.5,
      width: columnWidth + GRID_ROW_HEAD_WIDTH + 0.5,
      height: rowHeight,
      fill: this.getGroupBackgroundByDepth(depth - 1)
    });
    this.line({
      x: x + 0.5,
      y,
      points: [0, rowHeight, columnWidth + GRID_ROW_HEAD_WIDTH, rowHeight],
      stroke: colors.sheetLineColor,
    });
  }

  private renderLastCell(row) {
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
      fill: this.getGroupBackgroundByDepth(depth - 1)
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

  private renderCommonCell(row) {
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
      fill: this.getGroupBackgroundByDepth(depth - 1)
    });
    this.line({
      x: x + 0.5,
      y,
      points: [0, rowHeight, columnWidth, rowHeight],
      stroke: colors.sheetLineColor,
    });
  }

  render({ row, colors }) {
    this.renderFirstCell(row, colors);
    this.renderCommonCell(row);
    this.renderLastCell(row);
  }
}

export const blankRowLayout = new BlankRowLayout();