import React, { ReactNode } from 'react';

export type ISelectValue = string | number;

export interface ISelectProps {
  /**
   * 已经选中的值，对应 IOptions 中的 value，类型为 string | number
   */
  value?: ISelectValue;

  /**
   * 选中某个选项的回调
   */
  onSelected?: (option: IOption, index: number) => void;

  /**
   * 需要在下拉框中展现的数据
   */
  options?: IOption[];

  /**
   * 初始状态的提示展示
   */
  placeholder?: string;

  /**
   * 触发器中，在文字之前的 icon，如果没有指定属性，是否显示 icon 根据  item 中是否存在 prefixIcon 决定，如果 item 和当前属性都传入了 icon，则以当前属性的权重更高
   */
  prefixIcon?: React.ReactNode;

  /**
   * 触发器中，文字后面跟随的 icon，和 prefixIcon 一样，不存在该属性时，以 item 的 suffixIcon 显示为准，如果当前属性存在，则当前属性的权重更高
   */
  suffixIcon?: React.ReactNode;

  /**
   * 下拉框是否需要和触发器保持相同的宽度，false - 根据下拉框的内容自动撑开下拉框
   */
  dropdownMatchSelectWidth?: boolean;

  /**
   * 设置触发器的行内样式
   */
  triggerStyle?: React.CSSProperties;

  /**
   * 设置触发器的类名
   */
  triggerCls?: string;

  /**
   * 自定义下拉列表的类名
   */
  listCls?: string;

  /**
   * 自定义下拉列表的行内样式
   */
  listStyle?: React.CSSProperties;

  /**
   * 是否需要开启搜索
   */
  openSearch?: boolean;

  /**
   * 开启搜索后，搜索框的 placeholder
   */
  searchPlaceholder?: string;

  /**
   * 开启搜索后，搜索关键词样式
   */
  highlightStyle?: React.CSSProperties

  /**
   * 没有数据时的提示
   */
  noDataTip?: string | (() => ReactNode)

  /**
   * 是否需要隐藏已经被选中的项
   */
  hideSelectedOption?: boolean;

  /**
   * 自定义下拉组件
   */
  dropdownRender?: React.ReactNode;

  /**
   * 针对触发器设置不可用状态，设置该选项后，触发器不会反馈 hover 和 focus 的变化
   */
  disabled?: boolean;

  /**
   * 可以自定义触发器中值的文字部分
   */
  renderValue?: (option: IOption) => string;

  /**
   * dropdownMatchSelectWidth 为 true 时，列表根据内容的宽度撑开，但是如果内容过长，列表也会变得很宽
   * 因此提供一个参数用来设置最大宽度
   */
  maxListWidth?: number;

  /**
   * 默认开关
   */
  defaultVisible?: boolean;

  /**
   * 隐藏箭头
   */
  hiddenArrow?: boolean;

  /**
   * 固定显示的文字
   */
  triggerLabel?: string | React.ReactNode;
}

export interface IOption {
  /**
   * 选中的值，在一个选项列表中具有唯一性
   * @type {(string | number)}
   */
  value: ISelectValue;

  /**
   * 面向用户的展示内容
   * @type {string}
   */
  label: string;

  /**
   * 选项的前面的 icon
   * @type {JSX.Element}
   */
  prefixIcon?: React.ReactNode;

  /**
   * 选项后面的icon
   * @type {JSX.Element}
   */
  suffixIcon?: React.ReactNode;

  /**
   * 当前选项是否不可选
   * @type {boolean}
   */
  disabled?: boolean;

  /**
   * 无法操作的提示
   * @type {string}
   */
  disabledTip?: string;
}

export interface ISelectOption {
  option: Pick<IOption, 'value' | 'disabled' | 'disabledTip'>;
  currentIndex: number;
  className?: string;
  style?: React.CSSProperties;
}
