import { Coordinate } from './coordinate';
import { ItemType, IGridCoordinate } from '../../interface';

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