import { ChangeEvent, ReactNode } from 'react';
import { DropdownRenderMode, IDropdownItem } from '../dropdown/interface';

export type SelectMode = 'single' | 'multiple' | 'tag';

export type ISelectItem = IDropdownItem;

export interface ISelectChangeData {
  /**
   * 选择的下拉
   */
  option: ISelectItem;

  /**
   * 最新的回调值
   */
  newOptions: ISelectItem[];

  /**
   * 上一次的回调值
   */
  oldOptions: ISelectItem[];
}

export interface ISelect {
  /**
   * 数据源
   */
  data: ISelectItem[];

  /**
   * 数据值
   */
  value: string[];

  /**
   * 选择模式
   */
  mode?: SelectMode;

  /**
   * 前缀图标
   */
  prefix?: ReactNode;

  /**
   * 后缀图标
   */
  suffix?: ReactNode;

  /**
   * 提示文字
   */
  placeholder?: string;

  /**
   * 类名
   */
  className?: string;

  /**
   * 容器类名
   */
  wrapClassName?: string;

  /**
   * 自定义渲染
   */
  renderItem?: (item: ISelectItem) => JSX.Element;

  /**
   *  搜索回调
   */
  onSearch?: (e: ChangeEvent<HTMLInputElement>) => void;

  /**
   * 下拉值改变回调
   */
  onChange?: (data: ISelectChangeData) => void;

  /**
   * 下拉类名
   */
  dropdownClassName?: string;

  /**
   * 下拉渲染模式
   */
  dropdownMode?: DropdownRenderMode;

  /**
   * 下拉尾部
   */
  dropdownFooter?: ReactNode;
}