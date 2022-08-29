import { IUseListenTriggerInfo } from 'helper';
import { HTMLAttributes, ReactElement, ReactNode } from 'react';

export interface IListDeprecateProps {

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
  onClick(e: React.MouseEvent | null, index: number): void

  /**
   * @description 没有数据时的提示
   */
  noDataTip?: string | (() => ReactNode)

  /**
   * @description 组件底部区域的选软组件
   */
  footerComponent?: () => ReactNode;

  className?: string;
  style?: React.CSSProperties

  /**
   * @description 当前正在聚焦的 item 的位置，原本这个参数由组件内部控制，但是在 draft 中，需要维护编辑器自己的 index，因此需要像组件内部传入
   * @type {number}
   */
  activeIndex?: number

  /**
   *
   */
  searchProps?: ISearchProps

  triggerInfo?: IUseListenTriggerInfo;

  autoHeight?: boolean;
}

export interface IListItemProps extends HTMLAttributes<HTMLDivElement> {

  /**
   * @description 当前选项的下标
   * @type {number}
   */
  currentIndex: number;

  /**
   * @description 在选项排序的时候会需要包裹一层其他的组件，但是对于内部不好处理
   * 所以可以通过这个属性传入一个包裹的函数
   * @param {*} children
   * @returns {ReactNode}
   */
  wrapperComponent?(children: ReactNode): ReactNode

  disabled?: boolean;
}

export interface ISearchProps {
  /**
   * @description 给 Input 组件绑定的引用，用来 focus
   * @type {React.RefObject<IInputRef>}
   */
  inputRef?: React.RefObject<HTMLInputElement>;

  /**
   * @description 自定义输入框的样式
   * @type {React.CSSProperties}
   */
  style?: React.CSSProperties

  /**
   * @description input 的提示语
   * @type {string}
   */
  placeholder?: string

  /**
   * @description input 按下 Enter 键的回调函数
   * @param {() => void} clearKeyword 组件内部传入的处理函数，可以在这里处理一些组件内部的操作
   * 比如清除输入框内的数据
   */
  onInputEnter?(clearKeyword: () => void): void

  /**
   * @description 输入内容后的回调
   * @param {React.ChangeEvent} e
   * @param {string} keyword
   */
  onSearchChange?(e: React.ChangeEvent, keyword: string): void
}
