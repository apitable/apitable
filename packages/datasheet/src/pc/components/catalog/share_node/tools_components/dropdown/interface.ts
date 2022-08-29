import React, { ChangeEvent, MouseEventHandler, ReactNode, RefObject } from 'react';

/**
 * pc 端样式生效
 * 全局 - fixed，局部 - absolute，普通 - none;
 */
export type DropdownRenderMode = 'global' | 'local' | 'common';

export type DropdownSelectedMode = 'icon' | 'background' | 'check';

export interface IDropdownItem {
  label: string;
  labelTip?: string | ReactNode;
  describe?: string;
  value: string;
  icon?: string | ReactNode;
  extra?: string | ReactNode;
  disabled?: boolean;
  [propsname: string]: any;
}

export interface IDropdown {
  /**
   * 数据源
   */
  data: IDropdownItem[];

  /**
   * 数据值
   */
  value: string[];

  /**
   * 渲染模式
   */
  mode?: DropdownRenderMode;

  /**
   * 选中的渲染模式
   */
  selectedMode?: DropdownSelectedMode;

  /**
   * 类名
   */
  className?: string;

  /**
   * 可搜索
   */
  searchable?: boolean;

  /**
   * 尾部
   */
  footer?: ReactNode;

  /**
   * 可见性
   */
  visible?: boolean;

  /**
   * 分割线
   */
  divide?: boolean;

  /**
   * 以 html 形式插入 label
   */
  labelInDangerHTML?: boolean;

  /**
   * 触发器
   */
  triggerRef?: RefObject<HTMLElement>;

  /**
   * 自适应 trigger 宽度
   */
  autoWidth?: boolean;

  /**
   * 鼠标移入时若存在则显示
   */
  hoverElement?: ReactNode;

  /**
   * 空数据
   */
  empty?: ReactNode;

  /**
   * 搜索回调
   */
  onSearch?: (e: ChangeEvent<HTMLInputElement>) => void;

  /**
   * hover 回调
   */
  onMouseenter?: (option: IDropdownItem, triggerElement: HTMLElement, e: MouseEventHandler<HTMLDivElement>) => void;

  /**
   * click 回调
   */
  onClick?: (option: IDropdownItem, e: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * 自定义渲染
   */
  renderItem?: (item: IDropdownItem) => JSX.Element;

  /**
   * 关闭时的回调
   */
  onClose?: (e) => void;
}