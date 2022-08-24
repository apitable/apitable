import { ChangeEvent, ReactNode } from 'react';

/**
 * pc 端样式生效
 * 全局 - fixed，局部 - absolute，普通 - none;
 */
export type DropdownRenderMode = 'global' | 'local' | 'common';

export type DropdownSelectedMode = 'icon' | 'background' | 'check';

export interface IDropdownItem {
  label: string;
  labelTip?: string;
  describe?: string;
  value: string;
  avatar?: string | ReactNode;
  extra?: string | ReactNode;
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
   * 搜索回调
   */
  onSearch?: (e: ChangeEvent<HTMLInputElement>) => void;

  /**
   * 自定义渲染
   */
  renderItem?: (item: IDropdownItem) => JSX.Element;
}