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

import React, { MouseEvent } from 'react';

export interface IContextMenuClickState {
  /**
   * Mouse screen coordinates
   */
  offset: number[] | null;

  /**
   * extra information
   */
  extraInfo?: any;
}

/**
 * click event interface
 */
export interface IContextCbProps {
  /**
   * custom menu item props
   */
  item: IContextMenuItemProps;

  /**
   * current menu path
   */
  keyPath: string[];

  /**
   * mouse event
   */
  event: React.MouseEvent<HTMLElement>;

  /**
   * extra information
   */
  extraInfo?: any;
}

/**
 * custom menu item props
 */
export interface IContextMenuItemProps {
  /**
   * primary key
   */
  key: string;

  /**
   * item text
   */
  label: string | (({ props }: any) => void);

  /**
   * child context menu
   */
  children?: IContextMenuItemProps[];

  /**
   * whether should be hidden
   */
  hidden?: boolean | (({ props }: any) => void);

  /**
   * whether should be disabled
   */
  disabled?: boolean | ((arg?: any) => boolean);

  /**
   * disabled tips
   */
  disabledTip?: string;

  /**
   * menu prefix icon
   */
  icon?: JSX.Element;

  /**
   * menu arrow
   */
  arrow?: JSX.Element;

  /**
   * extra render UI
   */
  extraElement?: JSX.Element;

  /**
   * Grouping aggregation ID
   */
  groupId?: string;

  /**
   * click callback
   */
  // onClick?: (args?: any) => void;

  [props: string]: any;
}

/**
 * right click menu interface
 */
export interface IContextMenuProps {
  /**
   * offset position
   */
  menuOffset?: number[];

  /**
   * menu width
   */
  width?: number;

  /**
   * menu state
   */
  contextMenu?: IContextMenuClickState;

  /**
   * menu close callback
   */
  onClose?: () => void;

  /**
   * menu open callback
   */
  onShown?: (args?: any) => void;

  /**
   * custom overlay
   */
  overlay?: IContextMenuItemProps[];

  /**
   * click callback
   */
  onClick?: (args: IContextCbProps) => void;

  /**
   * set menu id
   */
  menuId?: string;

  /**
   * Remaining space, usually used for how much space is left under the rolling height
   */
  menuSubSpaceHeight?: number;

  id?: string;

  /**
   * custom children
   */
  children?: React.ReactNode;

  data?: IContextMenuItemProps[];
}

/**
 * cache overlay data
 */
export interface ICacheOverlay {
  /**
   * menu item
   */
  item: IContextMenuItemProps;

  /**
   * menu layer
   */
  level: number;

  /**
   * menu index
   */
  index: number;
}

export interface IContextMenuStyleProps {
  /**
   * whether should be displayed
   */
  disabled?: boolean;

  /**
   * whether should be grouping
   */
  isGroup?: boolean;
}

export interface IMenuConfig {
  e: MouseEvent<HTMLElement>;
  extraInfo?: any;
}

export type IMenuEventHandler = (configs?: IMenuConfig) => void;
