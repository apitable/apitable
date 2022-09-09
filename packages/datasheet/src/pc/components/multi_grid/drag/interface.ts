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
  current: Element | null; // 当前点击的 fieldHead
  pageX: number; // 点击下去时的pageX
  scrollLeft: number; // 拖动会对页面进行滑动，需要计算划过的距离才是真的宽度
  changeWidthFieldId: string;
}

export interface IDragOption {
  overTargetId: string;
  overGroupPath: string;
  dragOffsetX: number;
  dragOffsetY: number;
}

export type IGlobalRef = INeedChangeColumnsWidthRef & { originPageX: number };
