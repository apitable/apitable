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
  getElementRect?: (e: MouseEvent, type: MoveType) => IElementRectProps;
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
