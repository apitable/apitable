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

import { TooltipPlacement } from 'antd/lib/tooltip';
import * as React from 'react';
import { ITheme } from '@apitable/components';
import { ICell } from '@apitable/core';
import { CellBound, ICellScrollState, IScrollHandler } from 'pc/components/gantt_view';

export interface ITooltipInfo {
  title: JSX.Element | string;
  width: number;
  height: number;
  x: number;
  y: number;
  rowIndex: number;
  columnIndex: number;
  visible: boolean;
  placement: TooltipPlacement;
  /**
   * Whether to enable coordinate system for positioning
   */
  coordXEnable?: boolean;
  coordYEnable?: boolean;
  rowsNumber?: number;
}

export interface IDraggingOutlineInfoProps {
  rowIndex: number;
  columnIndex: number;
}

export interface IKonvaGridContext {
  theme: ITheme;
  activeNodePrivate?: boolean;
  tooltipInfo: ITooltipInfo;
  setTooltipInfo: (info: Partial<ITooltipInfo>) => void;
  clearTooltipInfo: () => void;
  activeCellBound: CellBound;
  setActiveCellBound: (cellBound: Partial<CellBound>) => void;
  scrollTo: (params: { scrollTop?: number; scrollLeft?: number }) => void;
  scrollToItem: (params: { rowIndex?: number; columnIndex?: number }) => void;
  onEditorPosition: (activeCell?: ICell) => void | undefined;
  setMouseStyle: (mouseStyle: string) => void;
  isCellDown: boolean;
  setCellDown: (isDown: boolean) => void;
  draggingOutlineInfo: IDraggingOutlineInfoProps | null;
  setDraggingOutlineInfo: (props: IDraggingOutlineInfoProps | null) => void;
  cellScrollState: ICellScrollState;
  setCellScrollState: (state: Partial<ICellScrollState>) => void;
  resetCellScroll: Function;
  scrollHandler: IScrollHandler;
  isMobile?: boolean;
  isTouchDevice?: boolean;
  canAppendRow: boolean;
  onSetCanAppendRow: React.Dispatch<React.SetStateAction<boolean>>;
  activeUrlAction: boolean;
  setActiveUrlAction: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KonvaGridContext = React.createContext({} as IKonvaGridContext);
