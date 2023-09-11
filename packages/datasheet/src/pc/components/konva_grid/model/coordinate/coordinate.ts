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

import { RowHeightLevel } from '@apitable/core';
import { ItemType, IndicesMap, ICoordinate, CellMetaData, CellMetaDataMap } from '../../interface';

/**
 * Used to build the Canvas base coordinate system on which subsequent drawing work is based
 */
export class Coordinate {
  protected _rowHeight: number;
  protected _columnWidth: number;
  public rowCount: number;
  public columnCount: number;
  public containerWidth: number;
  public containerHeight: number;
  // Row height exception map
  public rowIndicesMap: IndicesMap = {};
  // Column width exception map
  public columnIndicesMap: IndicesMap = {};
  // Scrolling area vertical initial distance
  public rowInitSize: number;
  // Scrolling area horizontal initial distance
  public columnInitSize: number;
  // Index of the last row in the set of row coordinates
  public lastRowIndex = -1;
  // Index of the last column in the set of column coordinates
  public lastColumnIndex = -1;
  // Collection of row coordinates
  public rowMetaDataMap: CellMetaDataMap = {};
  // Collection of column coordinates
  public columnMetaDataMap: CellMetaDataMap = {};
  public rowHeightLevel: RowHeightLevel;

  constructor({
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    containerWidth,
    containerHeight,
    rowInitSize = 0,
    columnInitSize = 0,
    rowIndicesMap = {},
    columnIndicesMap = {},
    rowHeightLevel = RowHeightLevel.Short,
  }: ICoordinate) {
    this._rowHeight = rowHeight;
    this._columnWidth = columnWidth;
    this.rowHeightLevel = rowHeightLevel;
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.rowInitSize = rowInitSize;
    this.columnInitSize = columnInitSize;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.rowIndicesMap = rowIndicesMap;
    this.columnIndicesMap = columnIndicesMap;
  }

  public get columnWidth() {
    return this._columnWidth;
  }

  public set columnWidth(width: number) {
    this._columnWidth = width;
  }

  public get rowHeight() {
    return this._rowHeight;
  }

  public set rowHeight(height: number) {
    this._rowHeight = height;
  }

  /**
   * Total width
   */
  public get totalWidth() {
    const { offset, size } = this.getCellMetaData(this.columnCount - 1, ItemType.Column);
    return offset + size;
  }

  /**
   * Total height
   */
  public get totalHeight() {
    const { offset, size } = this.getCellMetaData(this.rowCount - 1, ItemType.Row);
    return offset + size;
  }

  /**
   * Get the corresponding row height based on rowIndex
   */
  public getRowHeight(index: number) {
    return this.rowMetaDataMap[index]?.size ?? this.rowHeight;
  }

  /**
   * Get the corresponding column width based on columnIndex
   */
  public getColumnWidth(index: number) {
    return this.columnMetaDataMap[index]?.size ?? this.columnWidth;
  }

  /**
   * Get the coordinate information of each "grid" in vertical/horizontal direction
   */
  protected getCellMetaData(index: number, itemType: ItemType): CellMetaData {
    let cellMetadataMap, itemSize, lastMeasuredIndex, offset;
    const isColumnType = itemType === ItemType.Column;

    if (isColumnType) {
      itemSize = this.columnWidth;
      offset = this.columnInitSize;
      lastMeasuredIndex = this.lastColumnIndex;
      cellMetadataMap = this.columnMetaDataMap;
    } else {
      itemSize = this.rowHeight;
      offset = this.rowInitSize;
      lastMeasuredIndex = this.lastRowIndex;
      cellMetadataMap = this.rowMetaDataMap;
    }
    if (index > lastMeasuredIndex) {
      if (lastMeasuredIndex >= 0) {
        const itemMetadata = cellMetadataMap[lastMeasuredIndex];
        offset = itemMetadata.offset + itemMetadata.size;
      }

      for (let i = lastMeasuredIndex + 1; i <= index; i++) {
        const size = (isColumnType ? this.columnIndicesMap[i] : this.rowIndicesMap[i]) ?? itemSize;

        cellMetadataMap[i] = {
          offset,
          size,
        };
        offset += size;
      }
      if (isColumnType) {
        this.lastColumnIndex = index;
      } else {
        this.lastRowIndex = index;
      }
    }
    return cellMetadataMap[index] || { size: 0, offset: 0 };
  }

  /**
   * Find the nearest cell index
   * Poor performance, but can be found in any case
   */
  private _findNearestCellIndex(index: number, offset: number, itemType: ItemType) {
    const itemCount = itemType === ItemType.Column ? this.columnCount : this.rowCount;
    let interval = 1;

    while (index < itemCount && this.getCellMetaData(index, itemType).offset < offset) {
      index += interval;
      interval *= 2;
    }

    return this._findNearestCellIndexByBinary(offset, Math.floor(index / 2), Math.min(index, itemCount - 1), itemType);
  }

  /**
   * Dichotomy to find the nearest cell index
   * Better performance, but requires data to be loaded
   */
  private _findNearestCellIndexByBinary(offset: number, low: number, high: number, itemType: ItemType) {
    while (low <= high) {
      const middle = low + Math.floor((high - low) / 2);
      const currentOffset = this.getCellMetaData(middle, itemType).offset;

      if (currentOffset === offset) {
        return middle;
      } else if (currentOffset < offset) {
        low = middle + 1;
      } else if (currentOffset > offset) {
        high = middle - 1;
      }
    }
    return low > 0 ? low - 1 : 0;
  }

  /**
   * Find the nearest cell index based on offset
   */
  public findNearestCellIndex(offset: number, itemType: ItemType) {
    let itemMetadataMap, lastIndex;

    if (itemType === ItemType.Column) {
      itemMetadataMap = this.columnMetaDataMap;
      lastIndex = this.lastColumnIndex;
    } else {
      itemMetadataMap = this.rowMetaDataMap;
      lastIndex = this.lastRowIndex;
    }
    const lastMeasuredItemOffset = lastIndex > 0 ? itemMetadataMap[lastIndex].offset : 0;

    if (lastMeasuredItemOffset >= offset) {
      return this._findNearestCellIndexByBinary(offset, 0, lastIndex, itemType);
    }
    return this._findNearestCellIndex(Math.max(0, lastIndex), offset, itemType);
  }

  /**
   * Find the index of the starting cell based on the vertical offset
   */
  public getRowStartIndex(offset: number) {
    return this.findNearestCellIndex(offset, ItemType.Row);
  }

  /**
   * Find the index of the end cell based on the index of the vertical start cell
   */
  public getRowStopIndex(startIndex: number, scrollTop: number) {
    const itemMetadata = this.getCellMetaData(startIndex, ItemType.Row);
    const maxOffset = scrollTop + this.containerHeight;
    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;

    while (stopIndex < this.rowCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += this.getCellMetaData(stopIndex, ItemType.Row).size;
    }
    return stopIndex;
  }

  /**
   * Find the index of the starting cell based on the horizontal offset
   */
  public getColumnStartIndex(offset: number) {
    return this.findNearestCellIndex(offset, ItemType.Column);
  }

  /**
   * Find the index of the end cell based on the index of the horizontal start cell
   */
  public getColumnStopIndex(startIndex: number, scrollLeft: number) {
    const itemMetadata = this.getCellMetaData(startIndex, ItemType.Column);
    const maxOffset = scrollLeft + this.containerWidth;
    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;

    while (stopIndex < this.columnCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += this.getCellMetaData(stopIndex, ItemType.Column).size;
    }
    return stopIndex;
  }

  /**
   * Get vertical offset based on rowIndex
   */
  public getRowOffset(rowIndex: number) {
    return this.getCellMetaData(rowIndex, ItemType.Row).offset;
  }

  /**
   * Get horizontal offset based on columnIndex
   */
  public getColumnOffset(columnIndex: number) {
    return this.getCellMetaData(columnIndex, ItemType.Column).offset;
  }
}
