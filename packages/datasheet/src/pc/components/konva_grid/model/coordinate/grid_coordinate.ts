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

import { ItemType, IGridCoordinate } from '../../interface';
import { Coordinate } from './coordinate';

/**
 * Used to build the Canvas Grid base coordinate system
 */
export class GridCoordinate extends Coordinate {
  public frozenColumnCount: number;
  public autoHeadHeight: boolean;

  constructor({ frozenColumnCount = 0, autoHeadHeight = false, ...rest }: IGridCoordinate) {
    super(rest);
    this.autoHeadHeight = autoHeadHeight;
    this.frozenColumnCount = frozenColumnCount;
  }

  /**
   * Width of frozen area
   */
  get frozenColumnWidth() {
    return this.getColumnOffset(this.frozenColumnCount) - this.columnInitSize;
  }

  /**
   * Get cell coordinate information according to rowIndex, columnIndex
   */
  public getCellRect(rowIndex: number, columnIndex: number) {
    const { size: height, offset: y } = this.getCellMetaData(rowIndex, ItemType.Row);
    const { size: width, offset: x } = this.getCellMetaData(columnIndex, ItemType.Column);
    return {
      x,
      y,
      width,
      height,
    };
  }
}
