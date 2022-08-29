import { HTMLAttributes, ReactElement, ReactNode } from 'react';

export interface ICommonListProps {

  /**
   * @description 每个选项包裹的组件，
   * 也就是绑定在 CommonList 组件上的静态组件
   * @type {ReactElement[]}
   */
  children: ReactElement[];

  /**
   * @description 点击每个选项的处理函数
   * @param {(React.MouseEvent | null)} e
   * @param {number} index
   */
  onClickItem(e: React.MouseEvent | null, index: number): void

  /**
   * @description input 按下 Enter 键的回调函数
   * @param {() => void} clearKeyword 组件内部传入的处理函数，可以在这里处理一些组件内部的操作
   * 比如清除输入框内的数据
   */
  onInputEnter?(clearKeyword: () => void): void

  /**
   * @description 给 Input 组件绑定的引用，用来 focus
   * @type {React.RefObject<IInputRef>}
   */
  inputRef?: React.RefObject<HTMLInputElement>;

  /**
   * @description 没有数据时的提示
   */
  noDataTip?: string | (() => ReactNode)

  /**
   * @description 搜索结果为空的提示
   */
  noSearchResult?: string | (() => ReactNode);

  /**
   * @description 组件底部区域的选软组件
   */
  footerComponent?: () => ReactNode;

  /**
   * @description 已经选中的值
   * @type {string}
   */
  value?: (string | number)[] | null,

  className?: string;
  style?: React.CSSProperties

  /**
   * @description input 的提示语
   * @type {string}
   */
  inputPlaceHolder?: string

  /**
   * @description 输入内容后的回调
   * @param {React.ChangeEvent} e
   * @param {string} keyword
   */
  onSearchChange?(e: React.ChangeEvent | null, keyword: string): void

  /**
   * @description 是否显示 input 组件
   * @type {boolean}
   */
  showInput?: boolean

  /**
   * @description 用于重新渲染的监控源
   * @type {string}
   */
  monitorId?: string

  /**
   * @description 当前正在聚焦的 item 的位置，原本这个参数由组件内部控制，但是在 draft 中，需要维护编辑器自己的 index，因此需要像组件内部传入
   * @type {number}
   */
  activeIndex?: number

  /**
   * @description 自定义输入框的样式
   * @type {React.CSSProperties}
   */
  inputStyle?: React.CSSProperties;

  getListContainer?: (children: React.ReactNode) => React.ReactNode;

  onInputClear?: () => void;
}

export interface IOptionItemProps extends HTMLAttributes<HTMLDivElement> {

  /**
   * @description 当前选项的下标
   * @type {number}
   */
  currentIndex: number;

  /**
   * @description 当前选项的唯一特征，用来判断是否被选中
   * @type {string}
   */
  id: string

  /**
   * @description 是否被选中，这个会在组件内部判断，外部可以传入，但是会被覆盖
   * @type {boolean}
   */
  isChecked?: boolean

  /**
   * @description 在选项排序的时候会需要包裹一层其他的组件，但是对于内部不好处理
   * 所以可以通过这个属性传入一个包裹的函数
   * @param {*} children
   * @returns {ReactNode}
   */
  wrapperComponent?(children): ReactNode

  disabled?: boolean;
}