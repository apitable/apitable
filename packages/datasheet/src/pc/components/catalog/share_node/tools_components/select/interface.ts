import React, { ChangeEvent, ReactNode } from 'react';
import { DropdownRenderMode, IDropdownItem } from '../dropdown/interface';

export type SelectMode = 'single' | 'multiple' | 'tag';

export type ISelectItem = IDropdownItem;

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
   * 以 html 形式插入
   */
  labelInDangerHTML?: boolean;

  /**
   * 自定义渲染值
   */
  renderValue?: () => React.ReactNode;

  /**
   *  搜索回调
   */
  onSearch?: (e: ChangeEvent<HTMLInputElement>) => void;

  /**
   * 下拉值改变回调
   */
  onChange?: (value: string[], option: ISelectItem, e: React.MouseEvent<HTMLElement>) => void;

  // -------下拉-------
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

  /**
   * 自适应 trigger 宽度
   */
  autoWidth?: boolean;

  /**
   * 空数据
   */
  empty?: ReactNode;

  /**
   * 自定义渲染
   */
  renderItem?: (item: ISelectItem) => JSX.Element;
}