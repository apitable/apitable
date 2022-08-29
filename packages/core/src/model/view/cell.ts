import { IReduxState, Selectors } from '../../store';
import { ICell } from './range';

export enum CellDirection {
  Up, Down, Left, Right, UpEdge, DownEdge, LeftEdge, RightEdge,
}

export class Cell {

  static instance = new Cell('', '');

  static bindModel(cell: ICell) {
    this.instance.recordId = cell.recordId;
    this.instance.fieldId = cell.fieldId;
    return this.instance;
  }

  constructor(public recordId: string, public fieldId: string) {

  }

  getIndex(state: IReduxState, cell?: ICell) {
    return Selectors.getCellIndex(state, cell || Cell.instance);
  }

  getUIIndex(state: IReduxState, cell?: ICell) {
    return Selectors.getCellUIIndex(state, cell || Cell.instance);
  }

  move(state: IReduxState, direction: CellDirection, breakpoints: number[] = []) {
    const columns = Selectors.getVisibleColumns(state);
    const rows = Selectors.getVisibleRows(state);
    const rowCount = rows.length;
    const maxColumnIndex = columns.length - 1;
    let minRowIndex = 0;
    let maxRowIndex = rowCount - 1;
    let { recordIndex, fieldIndex }: { recordIndex: number, fieldIndex: number } = Selectors.getCellIndex(state, Cell.instance)!;

    /**
     * 针对以下两种情况，无需进行操作：
     * 1. 激活单元格处于第一行，且要向上移动
     * 2. 激活单元格处于最后一行，且要向下移动
     */
    if (
      ([CellDirection.Up, CellDirection.UpEdge].includes(direction) && recordIndex === 0) ||
      ([CellDirection.Down, CellDirection.DownEdge].includes(direction) && recordIndex === rowCount - 1)
    ) {
      return Cell.instance;
    }

    // 针对分组进行处理
    if (breakpoints.length) {
      const nextBreakpointIndex = breakpoints.findIndex(bp => bp > recordIndex);
      if (nextBreakpointIndex > -1) {
        const nextBreakpoint = breakpoints[nextBreakpointIndex];
        const currentBreakpoint = breakpoints[nextBreakpointIndex - 1];
        minRowIndex = (currentBreakpoint === recordIndex ? breakpoints[nextBreakpointIndex - 2] : currentBreakpoint) || 0;
        maxRowIndex = (nextBreakpoint === recordIndex + 1 ? breakpoints[nextBreakpointIndex + 1] - 1 : nextBreakpoint - 1) || maxRowIndex;
      }
    }

    switch (direction) {
      case CellDirection.Left:
        fieldIndex--;
        break;
      case CellDirection.Right:
        fieldIndex++;
        break;
      case CellDirection.Up: {
        recordIndex--;
        break;
      }
      case CellDirection.Down: {
        recordIndex++;
        break;
      }
      case CellDirection.LeftEdge:
        fieldIndex = 0;
        break;
      case CellDirection.RightEdge:
        fieldIndex = maxColumnIndex;
        break;
      case CellDirection.UpEdge:
        recordIndex = minRowIndex;
        break;
      case CellDirection.DownEdge:
        recordIndex = maxRowIndex;
        break;
      default: {
        return;
      }
    }
    // 修正超出边界，则停留在边界。
    if (recordIndex < 0) recordIndex = 0;
    if (recordIndex > rowCount - 1) recordIndex = rowCount - 1;
    if (fieldIndex < 0) fieldIndex = 0;
    if (fieldIndex > maxColumnIndex) fieldIndex = maxColumnIndex;
    return Selectors.getCellByIndex(state, { recordIndex, fieldIndex });
  }
}