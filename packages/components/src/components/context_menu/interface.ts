import React from 'react';

/**
 * 菜单信息
 */
export interface IContextMenuClickState {
  /**
   * 鼠标屏幕坐标
   */
  offset: number[] | null;

  /**
   * 额外携带的信息，用于提供 hidden = function 与 click 时的回调参数
   */
  extraInfo?: any;
}

/**
 * 点击事件的回调函数
 */
export interface IContextCbProps {
  /**
   * 自定义数据菜单项
   */
  item: IContextMenuItemProps;

  /**
   * 当前菜单路径
   */
  keyPath: string[];

  /**
   * 鼠标事件
   */
  event: React.MouseEvent<HTMLElement>;

  /**
   * 额外携带的信息，用于提供 hidden = function 与 click 时的回调参数
   */
  extraInfo?: any;
}

/**
 * 自定义数据菜单项
 */
export interface IContextMenuItemProps {
  /**
   * 键 - 唯一标识
   */
  key: string;

  /**
   * 显示的文本
   */
  label: string;

  /**
   * 子菜单项
   */
  children?: IContextMenuItemProps[];

  /**
   * 是否隐藏
   */
  hidden?: boolean | (({ props }: any) => void);

  /**
   * 是否禁用
   */
  disabled?: boolean | ((arg?: any) => boolean);

  /**
   * 禁用提示
   */
  disabledTip?: string;

  /**
   * 菜单项前置图标
   */
  icon?: JSX.Element;

  /**
   * 菜单项箭头
   */
  arrow?: JSX.Element;

  /**
   * 额外渲染，优先级高于 arrow
   */
  extraElement?: JSX.Element;

  /**
   * 分组聚合标识
   */
  groupId?: string;

  /**
   * 点击回调函数
   */
  // onClick?: (args?: any) => void;

  [props: string]: any;
}

/**
 * 右键菜单参数
 */
export interface IContextMenuProps {
  /**
   * 偏移量
   */
  menuOffset?: number[];

  /**
   * 菜单宽度
   */
  width?: number;

  /**
   * 接收的菜单信息
   */
  contextMenu?: IContextMenuClickState;

  /**
   * 菜单关闭时回调
   */
  onClose?: () => void;

  /**
   * 菜单开启后的回调
   */
  onShown?: (args?: any) => void;

  /**
   * 自定义数据项
   */
  overlay?: IContextMenuItemProps[];

  /**
   * 点击回调
   */
  onClick?: (args: IContextCbProps) => void;

  /**
   * 指定右键菜单 id（不推荐使用）
   */
  menuId?: string;

  /**
   * 剩余空间，通常用于滚动高度下剩余多少不占据空间
   */
  menuSubSpaceHeight?: number;

  id?: string;

  /**
   * 自定义右键菜单元素
   */
  children?: React.ReactNode;
}

/**
 * data 缓存信息
 */
export interface ICacheOverlay {
  /**
   * 菜单项
   */
  item: IContextMenuItemProps;

  /**
   * 菜单的层级
   */
  level: number;

  /**
   * 菜单的索引
   */
  index: number;
}

/**
 * Item 传递信息
 */
export interface IContextMenuStyleProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 是否分组
   */
  isGroup?: boolean;
}
