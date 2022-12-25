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