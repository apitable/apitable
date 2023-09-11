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

import { range } from 'lodash';
import { colors } from '@apitable/components';
import { ILinearRow, ViewType } from '@apitable/core';
import { GRID_ADD_FIELD_BUTTON_WIDTH, GRID_GROUP_ADD_FIELD_BUTTON_WIDTH, GRID_GROUP_OFFSET } from '../../constant';
import { KonvaDrawer } from '../../utils/drawer';

interface ILayout {
  x: number;
  y: number;
  rowIndex: number;
  columnIndex: number;
  rowHeight: number;
  columnWidth: number;
  groupCount: number;
  columnCount: number;
  viewType: ViewType;
}

export class GridLayout extends KonvaDrawer {
  protected x = 0;
  protected y = 0;
  protected rowHeight = 0;
  protected columnWidth = 0;
  protected rowIndex = 0;
  protected columnIndex = 0;
  protected groupCount = 0;
  protected columnCount = 0;
  protected viewType = ViewType.Grid;

  init({ x, y, rowIndex, columnIndex, rowHeight, columnWidth, groupCount, columnCount, viewType }: ILayout) {
    this.x = x;
    this.y = y;
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
    this.rowHeight = rowHeight;
    this.columnWidth = columnWidth;
    this.groupCount = groupCount;
    this.columnCount = columnCount;
    this.viewType = viewType;
  }

  protected get isFirst() {
    return this.columnIndex === 0;
  }

  protected get isLast() {
    return this.columnIndex === this.columnCount - 1;
  }

  protected get addBtnWidth() {
    return this.groupCount ? GRID_GROUP_ADD_FIELD_BUTTON_WIDTH : GRID_ADD_FIELD_BUTTON_WIDTH;
  }

  /**
   * Get the list of corresponding background colors according to the group length
   */
  private getGroupBackgrounds() {
    const length = this.groupCount;
    const backgrounds: string[] = [colors.defaultBg];
    if (length > 1) backgrounds.unshift(colors.fc8);
    if (length > 2) backgrounds.unshift(colors.highBg);
    return backgrounds;
  }

  /**
   * Get the corresponding background color according to the corresponding depth
   */
  protected getGroupBackgroundByDepth(depth: number) {
    if (this.viewType === ViewType.Gantt) return colors.defaultBg;
    if (!this.groupCount) return colors.defaultBg;
    const backgrounds = this.getGroupBackgrounds();
    return backgrounds[depth];
  }

  protected renderAddFieldBlank(_row: ILinearRow) {
    const width = this.addBtnWidth;
    const background = this.getGroupBackgroundByDepth(0);
    const x = this.x + this.columnWidth;
    const y = this.y;
    const rowHeight = this.rowHeight;
    this.rect({
      x: x + 0.5,
      y: y - 0.5,
      width,
      height: rowHeight + 1,
      fill: background,
    });
    this.line({
      x,
      y,
      points: [width, 0, width, rowHeight],
      stroke: colors.sheetLineColor,
    });
  }

  /**
   * Render row header indent area
   */
  protected renderIndentFront(depth: number) {
    range(depth).forEach((i) => {
      this.rect({
        x: i * GRID_GROUP_OFFSET,
        y: this.y - 0.5,
        width: GRID_GROUP_OFFSET,
        height: this.rowHeight,
        fill: this.getGroupBackgroundByDepth(i),
      });
      this.line({
        x: i * GRID_GROUP_OFFSET + 0.5,
        y: this.y,
        points: [0, 0, 0, this.rowHeight],
        stroke: colors.sheetLineColor,
      });
    });
  }

  /**
   * Render row end indent area
   */
  protected renderIndentEnd(depth: number) {
    const x = this.x;
    const y = this.y;
    const rowHeight = this.rowHeight;
    const columnWidth = this.columnWidth;
    const tabSizeList = [40, GRID_GROUP_OFFSET, 0];
    range(depth).forEach((i) => {
      const isFirstGroup = i === 0;
      const rectOffsetX = isFirstGroup ? 0 : -GRID_GROUP_OFFSET;
      const lineOffsetX = isFirstGroup ? 40 : 0;
      this.rect({
        x: x + columnWidth + rectOffsetX + 0.5,
        y: y - 0.5,
        width: tabSizeList[i],
        height: rowHeight,
        fill: this.getGroupBackgroundByDepth(i),
      });
      this.line({
        x: x + columnWidth + lineOffsetX,
        y,
        points: [0, 0, 0, rowHeight],
        stroke: colors.sheetLineColor,
      });
    });
  }
}
