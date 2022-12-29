export interface IScrollBarProps {
  // The width or height of the table dynamically calculated according to AutoSize, depending on the orientation
  gridVisibleLength: number;
  // Total length of slidable data, including the part not displayed on the page
  // In case of horizontal scrolling, non-movable columns are excluded
  dataTotalLength: number;
  // The visible, scrollable part of the view
  // Horizontal: gridVisibleLength removes non-scrollable columns and padding
  scrollAreaLength: number;
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