export interface IElementRectProps {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
}

export enum MoveType {
  Column = 'Column',
  Row = 'Row',
}
