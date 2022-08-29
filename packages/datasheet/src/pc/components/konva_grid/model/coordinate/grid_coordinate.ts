import { Coordinate } from './coordinate';
import { ItemType, IGridCoordinate } from '../../interface';

/**
 * 用于构建 Canvas Grid 基础坐标系
 */
export class GridCoordinate extends Coordinate {
  // 冻结列数
  public frozenColumnCount: number;
  public autoHeadHeight: boolean;

  constructor({ frozenColumnCount = 0, autoHeadHeight = false, ...rest }: IGridCoordinate) {
    super(rest);
    this.autoHeadHeight = autoHeadHeight;
    this.frozenColumnCount = frozenColumnCount;
  }

  /**
   * 冻结区域宽度
   */
  get frozenColumnWidth() {
    return this.getColumnOffset(this.frozenColumnCount) - this.columnInitSize;
  }

  /**
   * 根据 rowIndex、columnIndex 获取单元格坐标信息
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