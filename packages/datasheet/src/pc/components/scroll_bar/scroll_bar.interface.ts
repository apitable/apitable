export interface IScrollBarProps {
  // 根据AutoSize动态计算的表格的宽或高，取决于方向
  gridVisibleLength: number;
  // 可滑动数据的总长度，包括没有展示在页面上的部分
  // 如果是横向滚动，则不包括不可动的列
  dataTotalLength: number;
  // 视图可见的，可以滚动的部分，例如，
  // 横向：gridVisibleLength 去除掉不可滚动的列 和 padding
  scrollAreaLength: number;
  // 滚动条的方向
  // 表格滚动方法
  onGridScroll: (dist: number) => void;
}

export interface IScrollBarHorizon {
  scrollLeft: number;
}

export interface IScrollBarVertical {
  scrollTop: number;
}

export enum ScrollBarDirection {
  Horizon,
  Vertical,
}

export type IUseScrollBar = IScrollBarProps & {
  direction: ScrollBarDirection,
  scrollBarOffset: number,
};