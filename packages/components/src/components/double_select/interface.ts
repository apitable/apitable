import { ISelectProps, ISelectValue } from 'components/select';

type IDoubleSelectPropsBase = Pick<ISelectProps, 'disabled' | 'triggerStyle' | 'triggerCls'>;

export interface IDoubleSelectProps extends IDoubleSelectPropsBase {
  value: ISelectValue;

  /**
   * @description 显示的选项列表
   */
  options: IDoubleOptions[];

  /**
   * @description 选中选项的事件回调
   * @param {IDoubleOptions} option
   * @param {number} index
   */
  onSelected: (option: IDoubleOptions, index: number) => void;
}

export interface IDoubleOptions {
  /**
   * @description 当前选项的值，在列表中保证唯一
   */
  value: ISelectValue;

  /**
   * @description 需要展示的主标题
   */
  label: string;

  /**
   * @description 需要展示的副标题
   */
  subLabel: string

  /**
   * @description 标记当前选项是否可选
   */
  disabled?: boolean;

  /**
   * @description 当选项不可选，可以提供一个 tooltip 提示
   */
  disabledTip?: string;
}

export interface IDoubleOptionsProps {
  /**
   * @description 当前需要展示的选项的信息
   */
  option: IDoubleOptions;

  /**
   * @description 当前选项在数组中的下标
   */
  currentIndex: number;

  /**
   * @description 当前已经选中的值，标记当前的选项是否处于激活状态
   */
  selectedValue: ISelectValue;
}
