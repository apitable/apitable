import { IElementRectProps, MoveType } from '../hover_line/interface';

export interface IDragProps {
  width: number;
  height: number;
  rowHeight: number;
  gridRef: React.RefObject<HTMLElement> | undefined;
  scrollWhenHitViewEdg(e: MouseEvent): void;
  getFieldId?: (e: MouseEvent) => string | null | undefined;
  getRecordId?: (e: MouseEvent) => string | null | undefined;
  checkInGrid?: (e: MouseEvent) => boolean;
  checkIsOpacityLine?: (e: MouseEvent) => boolean;
  getClickCellId?: (e: MouseEvent) => { fieldId?: string | null; recordId?: string | null };
  getElementRect?: (e, type: MoveType) => IElementRectProps;
}

export interface INeedChangeColumnsWidthRef {
  current: Element | null; // The currently clicked fieldHead
  pageX: number; // PageX when clicking down
  scrollLeft: number; // Dragging will slide on the page, you need to calculate the distance scratched to be the real width
  changeWidthFieldId: string;
}

export interface IDragOption {
  overTargetId: string;
  overGroupPath: string;
  dragOffsetX: number;
  dragOffsetY: number;
}

export type IGlobalRef = INeedChangeColumnsWidthRef & { originPageX: number };
