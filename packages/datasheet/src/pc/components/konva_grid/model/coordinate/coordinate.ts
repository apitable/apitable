import { RowHeightLevel } from '@vikadata/core';
import {
  ItemType,
  IndicesMap,
  ICoordinate,
  CellMetaData,
  CellMetaDataMap, 
} from '../../interface';

/**
 * 用于构建 Canvas 基础坐标系，之后的绘图工作都是基于此坐标系建立的
 */
export class Coordinate {
  // 行高
  protected _rowHeight: number;
  // 列宽
  protected _columnWidth: number;
  // 总行数
  public rowCount: number;
  // 总列数
  public columnCount: number;
  // 容器宽度
  public containerWidth: number;
  // 容器高度
  public containerHeight: number;
  // 行高异常集合
  public rowIndicesMap: IndicesMap = {};
  // 列宽异常集合
  public columnIndicesMap: IndicesMap = {};
  // 滚动区域纵向初始距离
  public rowInitSize: number;
  // 滚动区域横向初始距离
  public columnInitSize: number;
  // 行坐标集合中最后一行的索引
  public lastRowIndex = -1;
  // 列坐标集合中最后一列的索引
  public lastColumnIndex = -1;
  // 行坐标集合
  public rowMetaDataMap: CellMetaDataMap = {};
  // 列坐标集合
  public columnMetaDataMap: CellMetaDataMap = {};
  // 行高层级
  public rowHeightLevel: RowHeightLevel;

  constructor({
    rowHeight, columnWidth,
    rowCount, columnCount, 
    containerWidth, containerHeight, 
    rowInitSize = 0, columnInitSize = 0,
    rowIndicesMap = {}, columnIndicesMap = {},
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
   * 获取总宽度
   */
  public get totalWidth() {
    const { offset, size } = this.getCellMetaData(this.columnCount - 1, ItemType.Column);
    return offset + size;
  }

  /**
   * 获取总高度
   */
  public get totalHeight() {
    const { offset, size } = this.getCellMetaData(this.rowCount - 1, ItemType.Row);
    return offset + size;
  }

  /**
   * 根据 rowIndex 获取对应行高
   */
  public getRowHeight(index: number) {
    return this.rowMetaDataMap[index]?.size ?? this.rowHeight;
  }

  /**
   * 根据 columnIndex 获取对应列宽
   */
  public getColumnWidth(index: number) {
    return this.columnMetaDataMap[index]?.size ?? this.columnWidth;
  }

  /**
   * 获取每个 “格子” 纵向/横向 的坐标信息
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
   * 查找最近的 “格子” 索引
   * 性能较差，但是任何情况下都可以查找到
   */
  private _findNearestCellIndex(index: number, offset: number, itemType: ItemType) {
    const itemCount = itemType === ItemType.Column ? this.columnCount : this.rowCount;
    let interval = 1;
    
    while (
      index < itemCount &&
      this.getCellMetaData(index, itemType).offset < offset
    ) {
      index += interval;
      interval *= 2;
    }
  
    return this._findNearestCellIndexByBinary(offset, Math.floor(index / 2), Math.min(index, itemCount - 1), itemType);
  }

  /**
   * 二分法查找最近的 “格子” 索引
   * 性能较好，但是需要数据都已经加载过
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
   * 根据 offset 查找到最近的 “格子” 索引
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
   * 根据纵向 offset 查找 “起始格子” 的索引
   */
  public getRowStartIndex(offset: number) {
    return this.findNearestCellIndex(offset, ItemType.Row);
  }

  /**
   * 根据纵向 ”起始格子“ 的索引来查找 “终止格子” 的索引
   */
  public getRowStopIndex(startIndex: number, scrollTop: number) {
    const itemMetadata = this.getCellMetaData(startIndex, ItemType.Row);
    const maxOffset = scrollTop + this.containerHeight;
    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;
  
    while (stopIndex < this.rowCount - 1 && offset < maxOffset) {
      stopIndex ++;
      offset += this.getCellMetaData(stopIndex, ItemType.Row).size;
    }
    return stopIndex;
  }

  /**
   * 根据横向 offset 查找 “起始格子” 的索引
   */
  public getColumnStartIndex(offset: number) {
    return this.findNearestCellIndex(offset, ItemType.Column);
  }

  /**
   * 根据横向 ”起始格子“ 的索引来查找 “终止格子” 的索引
   */
  public getColumnStopIndex(startIndex: number, scrollLeft: number) {
    const itemMetadata = this.getCellMetaData(startIndex, ItemType.Column);
    const maxOffset = scrollLeft + this.containerWidth;
    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;
  
    while (stopIndex < this.columnCount - 1 && offset < maxOffset) {
      stopIndex ++;
      offset += this.getCellMetaData(stopIndex, ItemType.Column).size;
    }
    return stopIndex;
  }

  /**
   * 根据 rowIndex 获取纵向 offset
   */
  public getRowOffset(rowIndex: number) {
    return this.getCellMetaData(rowIndex, ItemType.Row).offset;
  }

  /**
   * 根据 columnIndex 获取横向 offset
   */
  public getColumnOffset(columnIndex: number) {
    return this.getCellMetaData(columnIndex, ItemType.Column).offset;
  }
}