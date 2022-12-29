import React from 'react';

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
  label: string;

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
